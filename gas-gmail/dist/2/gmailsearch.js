class GmailSearch {
  /**
   * GmailSearchクラスのコンストラクタ
   * @throws {Error} configがnullまたはundefinedの場合
   */
  constructor(){
  }

  /**
   * メール検索を実行し、結果を処理する
   * @param {Object} queryInfo - 検索クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} threads - 検索結果のスレッドの配列
   * @throws {Error} maxThreadsが0以下の場合
   */
  search(queryInfo, way){
    const maxThreads = queryInfo.maxThreads
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }
    const query = queryInfo.getQuery(way)
    YKLiblog.Log.debug(`GmailSearch search Before way=${way} query.string=${query.string}`)
    const threads = this.getThreadsWithQuery(query, maxThreads)
    queryInfo.setQueryResultByIndex(query.index, threads)

    return threads
  }

  /**
   * メール検索を実行し、結果を処理する
   * @param {Object} queryInfo - 検索クエリ情報オブジェクト
   * @param {Object} registeredEmail - メール登録管理オブジェクト
   * @param {string} way - 検索方法
   * @param {Object} config - GmailSearchの設定オブジェクト
   * @returns {Array} [newLastDateTime, within, remain] - 新しい最終日時、処理済みデータ、未処理データ
   * @throws {Error} maxThreadsが0以下の場合
   */
  searchAndClassify(queryInfo, registeredEmail, way, config){
    const threads = this.search(queryInfo, way)

    const maxSearchesAvailable = queryInfo.maxSearchesAvailable
    const maxThreads = queryInfo.maxThreads

    const [within, remain] = this.classifySearchResults(threads, maxThreads, maxSearchesAvailable, registeredEmail, config)
    within.setQueryInfo(queryInfo)

    registeredEmail.targetedEmail.setCount( within.msgCount )

    const newLastDateTime = within.lastDate.getTime()

    return [newLastDateTime, within, remain]
  }

  /**
   * メッセージの処理状態を判定する
   * @param {boolean} msgsStatus - 現在のメッセージ処理状態
   * @param {Object} currentValue - 現在処理中のスレッドとメッセージデータ配列
   * @param {Array} accumulator - 累積処理結果の配列
   * @returns {boolean} 更新されたメッセージ処理状態
   */
  determinStatus(msgsStatus, currentValue, accumulator){
    const msgCount = currentValue.getMsgCount()

    const maxSearchesAvailable = accumulator[0].maxSearchesAvailable;
    const maxThreads = accumulator[0].maxThreads;        

    if( msgsStatus ){
      if( (msgCount > maxSearchesAvailable) || maxThreads <= 0 ){
        msgsStatus = false
      }
    }
    return msgsStatus
  }

  /**
   * スレッドをメッセージデータ配列として分類する
   * Google Apps Scriptの実行制限を考慮し、検索結果をスプレッドシートに記録する際に、
   * 記録するスレッド数またはメッセージ数で記録処理を打ち切るか否かを決定する。
   * 戻り値の配列の0番目の要素には処理済みのスレッド・メッセージが格納され、
   * 1番目の要素には検索されたが未処理のスレッド・メッセージが格納される。
   * 記録済みメッセージが存在した場合、記録処理は行わないが、
   * スレッドのメタデータ計算の対象には含める。
   * @param {string} threads - 検索されたスレッドの配列
   * @param {number} maxThreads - 最大スレッド数
   * @param {number} maxSearchesAvailable - 利用可能な最大検索数
   * @param {Object} registeredEmail - Gmailメッセージの登録管理
   * @param {Object} config - GmailSearchの設定オブジェクト
   * @returns {Array} [within, remain] - 処理済みデータと未処理データの配列
   * @throws {Error} maxThreadsが0以下の場合
   */
  classifySearchResults(threads, maxThreads, maxSearchesAvailable, registeredEmail, config){
    YKLiblog.Log.debug(`GmailSearch classifySearchResults maxThreads=${maxThreads} maxSearchesAvailable=${maxSearchesAvailable}`)
    const resultArray = [
      new Messagearray(),
      new Messagearray(),
    ]
  
    let msgsStatus = true

    if( threads === null ){
      YKLiblog.Log.debug(`GmailSearch classifySearchResults 2  threads === null`)

      return resultArray
    }
    YKLiblog.Log.debug(`Gmailsearch classifySearchResults threads !== null threads.length=${threads.length}`)
    let totalMessages = 0
    let overMessages = false
    const threadsLength = threads.length
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([threadsLength, maxThreads])
    const tableDef = config.getRegisteredEmailTableDef()
    const header = tableDef.getHeader()

    for(let i = 0; i < min; i++){
      const thread = threads[i]
      const messageCount = thread.getMessageCount()
      totalMessages += messageCount
      if( totalMessages >= maxSearchesAvailable){
        overMessages = true
        break
      }
      const messages = thread.getMessages()

      const messagedataArray = messages.map( (message) =>  {
        const messageId = message.getId()
        const recorded = registeredEmail.hasId(messageId)
        const date = message.getDate()

        const messagedata = new Messagedata(header, message, date, recorded, config )
        YKLiblog.Log.debug(`GmailSearch classifySearchResults typeof(messagedata)=${typeof(messagedata)} messageId=${messageId} recorded=${recorded}`)

        return messagedata
      } )
      messagedataArray.flat()
      YKLiblog.Log.debug(`GmailSearch classifySearchResults messagedataArray.length=${messagedataArray.length}`)
      const threadAndMessagedataarray = new ThreadAndMessagedataarray(thread, messagedataArray)

      resultArray[0].add(threadAndMessagedataarray)
    }
    
    return resultArray
  }

  /**
   * クエリを使用してGmailスレッドを取得する
   * @param {string} queryString - 検索文字列
   * @param {number} maxThreads - 最大スレッド数
   * @returns {Array|null} 取得したスレッドの配列、またはnull（検索結果がない場合）
   * @throws {Error} maxThreadsが0以下の場合
   */
  getThreadsWithQuery(queryString, maxThreads){
    YKLiblog.Log.unknown(`###A1 GmailSearch getThreadsWithQuery 0 queryString=${queryString} maxThreads)=${maxThreads}`)
    const [ret, threads] = this.gmailSearch(queryString, maxThreads)
    if( ret ){
      YKLiblog.Log.unknown(`###A2 GmailSearch getThreadsWithQuery 1 threads.length=${threads.length}`)
      return threads
    }
    else{
      YKLiblog.Log.unknown(`###A3 GmailSearch getThreadsWithQuery 2 threads=null`)
      return null
    }
  }

  /**
   * GmailAppを使用して実際のGmail検索を実行する
   * 取得したスレッドを日付の古い順にソートする
   * @param {string} queryString - 検索クエリ文字列
   * @param {number} maxThreads - 最大スレッド数
   * @returns {Array} [success, threads] - 成功フラグとスレッド配列のタプル
   */
  gmailSearch(queryString, maxThreads){
    const start = 0
    YKLiblog.Log.unknown(`###11  GmailSearch gmailSearch queryString=${queryString} start=${start} maxThreads=${maxThreads}`)
    const threads = GmailApp.search(queryString, start, maxThreads);
    YKLiblog.Log.unknown(`###12  GmailSearch gmailSearch threads.length=${threads.length}`)
    threads.sort(function(a, b) {
      return a.getLastMessageDate().getTime() - b.getLastMessageDate().getTime();
    });
    if( threads.length > 0 ){
      return [true, threads];
    }
    else{
      return [false, null];
    }
  }
}
