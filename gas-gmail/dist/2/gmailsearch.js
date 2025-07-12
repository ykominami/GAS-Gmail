class GmailSearch {
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
  search(queryInfo, targetedEmail, way){
    let queryString
    let newLastDateTime, within, remain

    const maxSearchesAvailable = queryInfo.maxSearchesAvailable
    const maxThreads = queryInfo.maxThreads
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }

    if( way === EmailFetcherAndStorer.SearchWithTargetLabel()){
      queryString = queryInfo.getQuery0()
    }
    else{
      queryString = queryInfo.getQuery1()
    }
    [newLastDateTime, within, remain] = this.searchBase(queryString, targetedEmail, maxThreads, maxSearchesAvailable)
    return [newLastDateTime, within, remain]
  }
  searchBase(queryString, targetedEmail, maxThreads, maxSearchesAvailable){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }

    const [within, remain] = this.getThreadsAndMessagedataArray(queryString, maxThreads, maxSearchesAvailable)
    targetedEmail.setCount( within.msgCount )

    const newLastDateTime = within.lastDate.getTime()

    return [newLastDateTime, within, remain]
  }
  determinStatus(msgsStatus, currentValue, accumulator){
    // thread = currentValue.thread
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
  //  const firstQuery = queryInfo.getQuery0()
  getThreadsAndMessagedataArray(query, maxThreads, maxSearchesAvailable){
    // Google Apps Scriptの実行事件の制限を考慮し、検索結果をスプレッドシートに記録する際に、記録するスレッド数またはメッセージ数で、記録処理を打ち切るか否か決める
    // このメソッドの借地の配列の0番目の要素が、処理済みのスレッド、メッセージが格納される。
    // 1番目の要素には、検索されたが、このメソッドでは未処理のスレッド、メッセージが格納される。
    // また、検索結果に、すでに記録済みのメッセージが存在した場合、記録処理またはオリジナル版データ保存処理はしない。
    // ただし、スレッドに関するメタデータの計算の対象には含める。
    YKLiblog.Log.debug(`################## query=${query} maxSearchesAvailable=${maxSearchesAvailable}`)
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
    // queryによる検索結果をスレッドの配列として取得
    const threads = this.getMailListWithQuery(query, maxThreads)

    if( threads !== null ){
      YKLiblog.Log.debug(`Gmailsearch getThreadsAndMessagedataArray threads !== null`)
      // 検索結果(threadの配列全体)に含まれるメッセージ全体に関するメタデータを取得する

      // １個のthreadと、threadから取得した全メッセージに関連するメタデータ
      // ThreadAndMessagedataarrayのインスタンスの配列
      // をつくる
      // 1個のメッセージから、対応する1個のMessagedataクラスのインスタンスを生成する
      // 1個のthreadと（スレッドの属する全メッセージに対応する)Messagedataの配列を持つ、1個のThreadAndMessagedataarrayを作成する
      const threadAndMessagedataarrayList = threads.map( (thread) => {
        YKLiblog.Log.debug(`this.getThreadsAndMessagedataArray thread.getMessageCount()=${thread.getMessageCount()}`)
        const messages = thread.getMessages()
        const messagedataArray = messages.map( (message) =>  {
          // 記録済みメッセージであるか否かを判定
          const messageId = message.getId()
          const recorded = this.registeredEmail.hasId(messageId)
          // const recorded = this.targetedEmailIds.doneHas(messageId)
          const tabledef = this.config.getRegisteredEmailTableDef()
          const messagedata = new Messagedata(tabledef.getHeader(), message, message.getDate(), recorded, this.config )
          YKLiblog.Log.debug(`GmailSearch getThreadsAndMessagedataArray typeof(messagedata)=${typeof(messagedata)} messageId=${messageId} recorded=${recorded}`)

          return messagedata
        } )
        messagedataArray.map( (item) => YKLiblog.Log.debug( typeof(item) ) )
        return new ThreadAndMessagedataarray(thread, messagedataArray)
      } )

      // let msgsStatus = true ← 削除（関数冒頭で宣言済み）
      // 順次ThreadAndMessagedataarrayの単位で、検索結果を記録していく。検索対象IDごとに、Google Spreadsheetのワークシートを用意し、1メッセージ1行で記録する。
      // また切り詰めが発生した場合は、オリジナルのMessagedataの内容をGoogle Docsファイルに、1メッセージ1ファイルで本損する。
      // ただし、記録する前に、記録後の総スレッド数または、総メッセージ数が指定された制限を超える場合は、記録せずに、1番目要素に追加していく
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
      YKLiblog.Log.debug(`Gmailsearch getThreadsAndMessagedataArray 1`)
      if (typeof resultArray[0].debug === 'function') resultArray[0].debug();
      if (typeof resultArray[1].debug === 'function') resultArray[1].debug();

      return resultArray
    }
    else{
      YKLiblog.Log.debug(`Gmailsearch getThreadsAndMessagedataArray 2`)
      if (typeof initialValue[0].debug === 'function') initialValue[0].debug();
      if (typeof initialValue[1].debug === 'function') initialValue[1].debug();

      return initialValue
    }
  }
  getMailListWithQuery(query, maxThreads){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}` )
    }
    YKLiblog.Log.debug(`### get_mail_list_with_query 0 query=${query} maxThreads)=${maxThreads}`)
    const [ret, threads] = this.gmailSearch(query, maxThreads)
    if( ret ){
      // YKLiblog.Log.debug(`##### gmailsearch|getMailListWithQuery ret=${ret} threads.length=${threads.length}`)
      YKLiblog.Log.debug(`### getMailListWithQuery 1 threads.length=${threads.length}`)
      return threads
    }
    else{
      YKLiblog.Log.debug(`### getMailListWithQuery 2 threads=null`)
      return null
    }
  }
  gmailSearch(query, maxThreads){
    const start = 0
    YKLiblog.Log.debug(`query=${query} start=${start} maxThreads=${maxThreads}`)
    const threads = GmailApp.search(query, start, maxThreads);
    YKLiblog.Log.debug(`threads.length=${threads.length}`)
    // 取得したスレッドを日付の古い順にソート
    threads.sort(function(a, b) {
      return a.getLastMessageDate().getTime() - b.getLastMessageDate().getTime();
    });
    if( threads.length > 0 ){
      // null.y
      return [true, threads];
    }
    else{
      // null.x
      return [false, null];
    }
  }
}
