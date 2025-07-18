class GmailSearch {
  /**
   * GmailSearchクラスのコンストラクタ
   * @param {Object} registeredEmail - 登録済みメール情報を管理するオブジェクト
   * @param {Object} config - GmailSearchの設定オブジェクト
   * @throws {Error} configがnullまたはundefinedの場合
   */
  constructor(registeredEmail, config){
    this.registeredEmail = registeredEmail
    if( !config ){
      throw new Error('GamilSearch config is null')
    }
    if( typeof(config) === "undefined" ){
      throw new Error('GamilSearch config is undefined')
    }
    this.config = config
  }

  /**
   * メール検索を実行し、結果を処理する
   * @param {Object} queryInfo - 検索クエリ情報オブジェクト
   * @param {Object} targetedEmail - 対象メール情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} [newLastDateTime, within, remain] - 新しい最終日時、処理済みデータ、未処理データ
   * @throws {Error} maxThreadsが0以下の場合
   */
  search(queryInfo, targetedEmail, way){
    let queryString

    const maxSearchesAvailable = queryInfo.maxSearchesAvailable
    const maxThreads = queryInfo.maxThreads
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }
    queryString = queryInfo.getQueryString(way)
    YKLiblog.Log.debug(`GmailSearch search queryString=${queryString}`)
    const [newLastDateTime, within, remain] = this.searchBase(queryString, targetedEmail, maxThreads, maxSearchesAvailable)
    return [newLastDateTime, within, remain]
  }

  /**
   * 検索の基本処理を実行する
   * @param {string} queryString - 検索クエリ文字列
   * @param {Object} targetedEmail - 対象メール情報オブジェクト
   * @param {number} maxThreads - 最大スレッド数
   * @param {number} maxSearchesAvailable - 利用可能な最大検索数
   * @returns {Array} [newLastDateTime, within, remain] - 新しい最終日時、処理済みデータ、未処理データ
   * @throws {Error} maxThreadsが0以下の場合
   */
  searchBase(queryString, targetedEmail, maxThreads, maxSearchesAvailable){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }

    const [within, remain] = this.getThreadsAndMessagedataArray(queryString, maxThreads, maxSearchesAvailable)
    targetedEmail.setCount( within.msgCount )

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
    const messagedataArray = currentValue.messagedataArray

    const maxSearchesAvailable = accumulator[0].maxSearchesAvailable;
    const maxThreads = accumulator[0].maxThreads;        

    if( msgsStatus ){
      if( (messagedataArray.length > maxSearchesAvailable) || maxThreads <= 0 ){
        msgsStatus = false
      }
    }
    return msgsStatus
  }

  /**
   * クエリに基づいてスレッドとメッセージデータ配列を取得する
   * Google Apps Scriptの実行制限を考慮し、検索結果をスプレッドシートに記録する際に、
   * 記録するスレッド数またはメッセージ数で記録処理を打ち切るか否かを決定する。
   * 戻り値の配列の0番目の要素には処理済みのスレッド・メッセージが格納され、
   * 1番目の要素には検索されたが未処理のスレッド・メッセージが格納される。
   * 記録済みメッセージが存在した場合、記録処理は行わないが、
   * スレッドのメタデータ計算の対象には含める。
   * @param {string} query - 検索クエリ
   * @param {number} maxThreads - 最大スレッド数
   * @param {number} maxSearchesAvailable - 利用可能な最大検索数
   * @returns {Array} [within, remain] - 処理済みデータと未処理データの配列
   * @throws {Error} maxThreadsが0以下の場合
   */
  getThreadsAndMessagedataArray(query, maxThreads, maxSearchesAvailable){
    YKLiblog.Log.debug(`GmailSearch getThreadsAndMessagedataArray query=${query} maxSearchesAvailable=${maxSearchesAvailable}`)
    const initialValue = [
      new Messagearray(maxSearchesAvailable),
      new Messagearray(maxSearchesAvailable),
    ]
    initialValue[0].maxSearchesAvailable = maxSearchesAvailable
    initialValue[0].maxThreads = maxThreads
  
    let msgsStatus = true

    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }
    const threads = this.getThreadsWithQuery(query, maxThreads)

    if( threads !== null ){
      YKLiblog.Log.debug(`Gmailsearch getThreadsAndMessagedataArray threads !== null`)

      const threadAndMessagedataarrayList = threads.map( (thread) => {
        YKLiblog.Log.debug(`this.getThreadsAndMessagedataArray thread.getMessageCount()=${thread.getMessageCount()}`)
        const messages = thread.getMessages()
        const messagedataArray = messages.map( (message) =>  {
          const messageId = message.getId()
          const recorded = this.registeredEmail.hasId(messageId)
          const tabledef = this.config.getRegisteredEmailTableDef()
          const messagedata = new Messagedata(tabledef.getHeader(), message, message.getDate(), recorded, this.config )
          YKLiblog.Log.debug(`GmailSearch getThreadsAndMessagedataArray typeof(messagedata)=${typeof(messagedata)} messageId=${messageId} recorded=${recorded}`)

          return messagedata
        } )
        return new ThreadAndMessagedataarray(thread, messagedataArray)
      } )

      const resultArray = threadAndMessagedataarrayList.reduce( (accumulator, currentValue) => {
        msgsStatus = this.determinStatus(msgsStatus, currentValue, accumulator)

        if( msgsStatus ){
          accumulator[0].addValidMessagedataarray(currentValue)
        }
        else{
          accumulator[1].addInvalidMessagedataarray(currentValue)
        }
        return accumulator
      }, initialValue )
      YKLiblog.Log.debug(`GmailSearch getThreadsAndMessagedataArray 1`)

      return resultArray
    }
    else{
      YKLiblog.Log.debug(`GmailSearch getThreadsAndMessagedataArray 2`)

      return initialValue
    }
  }

  /**
   * クエリを使用してGmailスレッドを取得する
   * @param {string} query - 検索クエリ
   * @param {number} maxThreads - 最大スレッド数
   * @returns {Array|null} 取得したスレッドの配列、またはnull（検索結果がない場合）
   * @throws {Error} maxThreadsが0以下の場合
   */
  getThreadsWithQuery(query, maxThreads){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}` )
    }
    YKLiblog.Log.debug(`### GmailSearch getThreadsWithQuery 0 query=${query} maxThreads)=${maxThreads}`)
    const [ret, threads] = this.gmailSearch(query, maxThreads)
    if( ret ){
      YKLiblog.Log.debug(`### GmailSearch getThreadsWithQuery 1 threads.length=${threads.length}`)
      return threads
    }
    else{
      YKLiblog.Log.debug(`### GmailSearch getThreadsWithQuery 2 threads=null`)
      return null
    }
  }

  /**
   * GmailAppを使用して実際のGmail検索を実行する
   * 取得したスレッドを日付の古い順にソートする
   * @param {string} query - 検索クエリ
   * @param {number} maxThreads - 最大スレッド数
   * @returns {Array} [success, threads] - 成功フラグとスレッド配列のタプル
   */
  gmailSearch(query, maxThreads){
    const start = 0
    YKLiblog.Log.debug(`GmailSearch gmailSearch query=${query} start=${start} maxThreads=${maxThreads}`)
    const threads = GmailApp.search(query, start, maxThreads);
    YKLiblog.Log.debug(`GmailSearch gmailSearch threads.length=${threads.length}`)
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
