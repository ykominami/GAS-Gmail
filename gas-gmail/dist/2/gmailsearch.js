class GmailSearch {
  constructor(targetedEmailIds){
    this.targetedEmailIds = targetedEmailIds
  }
  SearchWithTargetLabel(queryInfo, targetedEmail, start, maxThreads, maxSearchesAvailable){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }
    
    // queryInfo.getQuery0()の存在チェック
    if (!queryInfo || typeof queryInfo.getQuery0 !== 'function') {
      YKLiblog.Log.debug("SearchWithTargetLabel: queryInfo.getQuery0 is not available");
      return [null, null, null];
    }
    
    const [newLastDateTime, within, remain] = this.SearchWithBase(queryInfo.getQuery0(), targetedEmail, start, maxThreads, maxSearchesAvailable)
    return [newLastDateTime, within, remain]
  }
  SearchWithFrom(queryInfo, targetedEmail,  start, maxThreads, maxSearchesAvailable){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }
    
    // queryInfo.getQuery1()の存在チェック
    if (!queryInfo || typeof queryInfo.getQuery1 !== 'function') {
      YKLiblog.Log.debug("SearchWithFrom: queryInfo.getQuery1 is not available");
      return [null, null, null];
    }
    
    const [newLastDateTime, within, remain] = this.SearchWithBase(queryInfo.getQuery1(), targetedEmail, start, maxThreads, maxSearchesAvailable)
    return [newLastDateTime, within, remain]
  }
  SearchWithBase(query, targetedEmail, start, maxThreads, maxSearchesAvailable){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }

    const [within, remain] = this.getThreadsAndMessagedataArray(query, start, maxThreads, maxSearchesAvailable)
    
    // targetedEmail.setCount()とwithin.msgCountの存在チェック
    if (targetedEmail && typeof targetedEmail.setCount === 'function' && within && typeof within.msgCount !== 'undefined') {
      targetedEmail.setCount( within.msgCount )
    } else {
      YKLiblog.Log.debug("SearchWithBase: targetedEmail.setCount or within.msgCount is not available");
    }

    // within.lastDate.getTime()の存在チェック
    if (within && within.lastDate && typeof within.lastDate.getTime === 'function') {
      const newLastDateTime = within.lastDate.getTime()
      return [newLastDateTime, within, remain]
    } else {
      YKLiblog.Log.debug("SearchWithBase: within.lastDate.getTime is not available");
      return [null, within, remain]
    }
  }
  determinStatus(msgsStatus, currentValue, accumulator){
    // thread = currentValue.thread
    const messagedataArray = currentValue.messagedataArray

    // accumulator[0]の存在チェック
    if (!accumulator || !accumulator[0]) {
      YKLiblog.Log.debug("determinStatus: accumulator[0] is not available");
      return false;
    }

    const maxSearchesAvailable = accumulator[0].maxSearchesAvailable;
    const maxThreads = accumulator[0].maxThreads;        

    if( msgsStatus ){
      if( (messagedataArray.length > maxSearchesAvailable) || maxThreads <= 0 ){
        return false  // msgsStatusを直接変更せずに戻り値として返す
      }
    }
    return msgsStatus
  }
  //  const firstQuery = queryInfo.getQuery0()
  getThreadsAndMessagedataArray(query, start, maxThreads, maxSearchesAvailable){
    // Google Apps Scriptの実行事件の制限を考慮し、検索結果をスプレッドシートに記録する際に、記録するスレッド数またはメッセージ数で、記録処理を打ち切るか否か決める
    // このメソッドの借地の配列の0番目の要素が、処理済みのスレッド、メッセージが格納される。
    // 1番目の要素には、検索されたが、このメソッドでは未処理のスレッド、メッセージが格納される。
    // また、検索結果に、すでに記録済みのメッセージが存在した場合、記録処理またはオリジナル版データ保存処理はしない。
    // ただし、スレッドに関するメタデータの計算の対象には含める。
    YKLiblog.Log.debug(`################## query=${query} maxSearchesAvailable=${maxSearchesAvailable}`)
    
    // Messagearrayクラスの存在チェック
    if (typeof Messagearray === 'undefined') {
      YKLiblog.Log.debug("Messagearray class is not defined");
      return [null, null];
    }
    
    const initialValue = [
      new Messagearray(maxSearchesAvailable),
      new Messagearray(maxSearchesAvailable),
    ]
    initialValue[0].maxSearchesAvailable = maxSearchesAvailable
    initialValue[0].maxThreads = maxThreads
  
    let msgsStatus = true

    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)  // maxTreadsをmaxThreadsに修正
    }
    // queryによる検索結果をスレッドの配列として取得
    const threads = this.getMailListWithQuery(query, start, maxThreads)

    if( threads !== null ){
      YKLiblog.Log.debug(`Gmailsearch getThreadsAndMessagedataArray threads !== null`)
      // 検索結果(threadの配列全体)に含まれるメッセージ全体に関するメタデータを取得する

      // １個のthreadと、threadから取得した全メッセージに関連するメタデータ
      // ThreadAndMessagedataarrayのインスタンスの配列
      // をつくる
      // 1個のメッセージから、対応する1個のMessagedataクラスのインスタンスを生成する
      // 1個のthreadと（スレッドの属する全メッセージに対応する)Messagedataの配列を持つ、1個のThreadAndMessagedataarrayを作成する
      
      // Messagedataクラスの存在チェック
      if (typeof Messagedata === 'undefined') {
        YKLiblog.Log.debug("Messagedata class is not defined");
        return initialValue;
      }
      
      // ThreadAndMessagedataarrayクラスの存在チェック
      if (typeof ThreadAndMessagedataarray === 'undefined') {
        YKLiblog.Log.debug("ThreadAndMessagedataarray class is not defined");
        return initialValue;
      }
      
      // CONFIGの存在チェック
      if (typeof CONFIG === 'undefined' || typeof CONFIG.getHeaders !== 'function') {
        YKLiblog.Log.debug("CONFIG.getHeaders is not available");
        return initialValue;
      }
      
      const threadAndMessagedataarrayList = threads.map( (thread) => {
        // thread.getMessageCount()の存在チェック
        if (!thread || typeof thread.getMessageCount !== 'function') {
          YKLiblog.Log.debug("getThreadsAndMessagedataArray: thread.getMessageCount is not available");
          return null;
        }
        
        YKLiblog.Log.debug(`this.getThreadsAndMessagedataArray thread.getMessageCount()=${thread.getMessageCount()}`)
        
        // thread.getMessages()の存在チェック
        if (typeof thread.getMessages !== 'function') {
          YKLiblog.Log.debug("getThreadsAndMessagedataArray: thread.getMessages is not available");
          return null;
        }
        
        const messages = thread.getMessages()
        const messagedataArray = messages.map( (message) =>  {
          // message.getId()の存在チェック
          if (!message || typeof message.getId !== 'function') {
            YKLiblog.Log.debug("getThreadsAndMessagedataArray: message.getId is not available");
            return null;
          }
          
          // message.getDate()の存在チェック
          if (typeof message.getDate !== 'function') {
            YKLiblog.Log.debug("getThreadsAndMessagedataArray: message.getDate is not available");
            return null;
          }
          
          // 記録済みメッセージであるか否かを判定
          const messageId = message.getId()
          const recorded = this.targetedEmailIds.doneHas(messageId)
          const messagedata = new Messagedata(CONFIG.getHeaders(), message, message.getDate(), recorded )
          YKLiblog.Log.debug(`GmailSearch getThreadsAndMessagedataArray typeof(messagedata)=${typeof(messagedata)} messageId=${messageId} recorded=${recorded}`)

          return messagedata
        } ).filter(item => item !== null)  // nullアイテムをフィルタリング
        
        messagedataArray.map( (item) => YKLiblog.Log.debug( typeof(item) ) )
        return new ThreadAndMessagedataarray(thread, messagedataArray)
      } ).filter(item => item !== null)  // nullアイテムをフィルタリング

      // 順次ThreadAndMessagedataarrayの単位で、検索結果を記録していく。検索対象IDごとに、Google Spreadsheetのワークシートを用意し、1メッセージ1行で記録する。
      // また切り詰めが発生した場合は、オリジナルのMessagedataの内容をGoogle Docsファイルに、1メッセージ1ファイルで本損する。
      // ただし、記録する前に、記録後の総スレッド数または、総メッセージ数が指定された制限を超える場合は、記録せずに、1番目要素に追加していく
      const resultArray = threadAndMessagedataarrayList.reduce( (accumulator, currentValue) => {
        msgsStatus = this.determinStatus(msgsStatus, currentValue, accumulator)

        if( msgsStatus ){
          // accumulator[0].addValidMessagedataarray()の存在チェック
          if (accumulator[0] && typeof accumulator[0].addValidMessagedataarray === 'function') {
            accumulator[0].addValidMessagedataarray(currentValue)
          } else {
            YKLiblog.Log.debug("getThreadsAndMessagedataArray: accumulator[0].addValidMessagedataarray is not available");
          }
        }
        else{
          // accumulator[1].addInvalidMessagedataarray()の存在チェック
          if (accumulator[1] && typeof accumulator[1].addInvalidMessagedataarray === 'function') {
            accumulator[1].addInvalidMessagedataarray(currentValue)
          } else {
            YKLiblog.Log.debug("getThreadsAndMessagedataArray: accumulator[1].addInvalidMessagedataarray is not available");
          }
        }
        return accumulator
      }, initialValue )
      YKLiblog.Log.debug(`Gmailsearch getThreadsAndMessagedataArray 1`)
      resultArray[0].debug
      resultArray[1].debug

      return resultArray
    }
    else{
      YKLiblog.Log.debug(`Gmailsearch getThreadsAndMessagedataArray 2`)
      initialValue[0].debug
      initialValue[1].debug

      return initialValue
    }
  }
  getMailListWithQuery(query, start, maxThreads){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}` )
    }
    YKLiblog.Log.debug(`### get_mail_list_with_query 0 query=${query} start=${start} maxThreads)=${maxThreads}`)
    const [ret, threads] = this.gmailSearch(query, start, maxThreads)
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
  gmailSearch(query, start, maxThreads){
    // GmailAppの存在チェック
    if (typeof GmailApp === 'undefined' || typeof GmailApp.search !== 'function') {
      YKLiblog.Log.debug("gmailSearch: GmailApp.search is not available");
      return [false, null];
    }
    
    const threads = GmailApp.search(query, start, maxThreads);
    
    // threads.sort()の存在チェック
    if (!threads || !Array.isArray(threads) || typeof threads.sort !== 'function') {
      YKLiblog.Log.debug("gmailSearch: threads.sort is not available");
      return [false, null];
    }
    
    // 取得したスレッドを日付の古い順にソート
    threads.sort(function(a, b) {
      // getLastMessageDate()の存在チェック
      if (!a || typeof a.getLastMessageDate !== 'function' || !b || typeof b.getLastMessageDate !== 'function') {
        YKLiblog.Log.debug("gmailSearch: getLastMessageDate is not available");
        return 0;
      }
      
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
