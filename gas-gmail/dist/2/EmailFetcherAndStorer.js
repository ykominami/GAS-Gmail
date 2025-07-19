class EmailFetcherAndStorer{
  /**
   * 検索方法を表す定数を返す
   * @returns {string} "SearchWithTargetLabel" - ターゲットラベルを使用した検索方法
   */
  static SearchWithTargetLabel(){
    return "SearchWithTargetLabel"
  }
  
  /**
   * 検索方法を表す定数を返す
   * @returns {string} "SearchWithFrom" - Fromフィールドを使用した検索方法
   */
  static SearchWithFrom(){
    return "SearchWithFrom"
  }
  
  /**
   * 検索方法を表す定数を返す
   * @returns {string} "TargetLabel" - ターゲットラベル検索
   */
  static TargetLabel(){
    return "TargetLabel"
  }
  
  /**
   * 検索方法を表す定数を返す
   * @returns {string} "EndTargetLabel" - 終了ターゲットラベル検索
   */
  static EndTargetLabel(){
    return "EndTargetLabel"
  }
  
  /**
   * 検索方法を表す定数を返す
   * @returns {string} "From" - From検索
   */
  static From(){
    return "From"
  }
  
  /**
   * 利用可能な全ての検索方法の配列を返す
   * @returns {Array<string>} 検索方法の配列
   */
  static Ways(){
    return [ 
      EmailFetcherAndStorer.SearchWithTargetLabel() ,
      EmailFetcherAndStorer.SearchWithFrom() ,
      EmailFetcherAndStorer.TargetLabel() ,
      EmailFetcherAndStorer.EndTargetLabel() ,
      EmailFetcherAndStorer.From() 
    ]
  }
  
  /**
   * EmailFetcherAndStorerクラスのコンストラクタ
   * @param {Object} targetedEmail - 対象メールの設定情報
   * @param {Object} registeredEmail - 登録済みメールの管理オブジェクト
   * @param {number} limitx - 処理制限数
   * @param {string} op - 操作タイプ
   * @param {number} nth - 処理回数
   * @param {Object} config - 設定オブジェクト
   * @param {Object} bTable - データテーブルオブジェクト
   */
  constructor(targetedEmail, registeredEmail, limitx, op, nth, config, bTable){
    this.config = config
    this.bTable = bTable
    this.targetedEmail =  targetedEmail;
    this.registeredEmail = registeredEmail;

    this.gmailSearch = new GmailSearch( registeredEmail , config)
    this.limitx = limitx;
    const [pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo()
    this.pairLabel = pairLabel
    this.queryInfo = queryInfo
    this.op = op
    this.nth = nth
  }

  /**
   * 指定された検索条件と方法でメールを取得する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} [within, remain, newLastDateTime] - 処理対象メール、残りメール、最新日時
   */
  fetchEmail(queryInfo, way){
    const [newLastDateTime, within, remain] = this.gmailSearch.search(queryInfo, this.targetedEmail, way)

    return [within, remain, newLastDateTime]
  }

  /**
   * 取得したメールをストレージに保存し、関連データを更新する
   * @param {Object} within - 処理対象のメールデータ
   * @param {Object} remain - 残りのメールデータ
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   */
  storeEmail(within, remain, queryInfo, way){
    YKLiblog.Log.debug(`storeEmail 1 way=${way} within.msgCount.length=${within.msgCount.length}`)
    if( typeof(within.msgCount) === "undefined" ){
      throw new Error(`storeEmail within.msgCount`)
    }
    if( within.msgCount > 0 ){
      YKLiblog.Log.debug(`storeEmail 2`)
      //
      const queryString = queryInfo.getQueryString(way)
      const existingMsgCount = this.registeredEmail.getIdsSize()
      const existingId = this.registeredEmail.getLastId()

      let withinId = ""

      YKLiblog.Log.unknown(`EmailFetcherAndStorer storeEmail queryString=${queryString}`)
      const threadAndMessagedataarray = within.getThreadAndMessagedataarrayByIndex(0)
      if( threadAndMessagedataarray === null ){
        YKLiblog.Log.unknown(`threadAndMessagedataarray.constructor=null`)
        const messageData = null
      }
      else{
        const messageData = threadAndMessagedataarray.getMessagedataByIndex(0)
        withinId = messageData.getMessageId()
      }
      //

      const lastDate = this.targetedEmail.getLastDate()
      const [messageDataList] = this.registeredEmail.registerData(within, this.op, this.limitx, lastDate)
      //
      const existingMsgCount2 = this.registeredEmail.getIdsSize()
      const existingId2 = this.registeredEmail.getLastId()

      const array = [this.targetedEmail.getName(), this.targetedEmail.getCondition(), queryString, existingMsgCount, existingMsgCount2, existingId, existingId2, within.msgCount , withinId, remain.msgCount, this.targetedEmail.getNth(), way]
      this.bTable.addDataRowAndUpdate(array)
      //

      // 切り詰めメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList.length > 0 ){
        YKLiblog.Log.debug(`storeEmail messageDataList.length=${messageDataList.length}`)
        this.targetedEmail.saveData(messageDataList)
      }
      // throw Error(`under saveData`)
    }
  }

  /**
   * 最新の日時を登録し、必要に応じて更新する
   * @param {string} newLastDateTime1 - 新しい最新日時1
   * @param {string} newLastDateTime2 - 新しい最新日時2
   * @param {string} lastDateTime - 現在の最新日時
   */
  registerLastDateTime(newLastDateTime1, newLastDateTime2, lastDateTime){
    const array = [newLastDateTime1, newLastDateTime2, lastDateTime]
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    YKLiblog.Log.debug(`registerLastDateTime latestDateTime=${latestDateTime}`)
    if( YKLiba.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      // store.set('last_date_time', latestDateTime)
      this.targetedEmail.setValidLatestDateAndDateTime(latestDateTime)
    }
  }
  
  /**
   * 処理回数を登録する
   */
  registerNth(){
    this.targetedEmail.setNth(this.nth)
  }
  
  /**
   * メールを取得、保存、ラベル追加を一連の処理として実行する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  fetchAndStoreAndAddThreadToLabel(queryInfo, way){
    const [within, remain, newLastDateTime] = this.fetchEmail(queryInfo, way)
    this.storeEmail(within, remain, queryInfo, way)
    queryInfo.pairLabel.addThreadToLabel(within, way)
    return [within, newLastDateTime]
  }
  
  /**
   * 指定された検索方法でメールを検索する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  searchWith(queryInfo, way){
    const [within, newLastDateTime] = this.fetchAndStoreAndAddThreadToLabel(queryInfo, way)
    return [within, newLastDateTime]
  }
  
  /**
   * ターゲットラベルを使用してメールを検索する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  searchWithTargetLabel(queryInfo){
    const way = EmailFetcherAndStorer.SearchWithTargetLabel()
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchWithTargetLabel way=${way}`)
    return this.searchWith(queryInfo, way)
  }
  
  /**
   * Fromフィールドを使用してメールを検索する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  searchWithFrom(queryInfo){
    const way = EmailFetcherAndStorer.SearchWithFrom()
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchWithFrom way=${way}`)
    return this.searchWith(queryInfo, way)
  }
  
  /**
   * 複数の検索方法を組み合わせてメールを検索し、結果を登録する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   */
  searchAndRegister(queryInfo){
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchAndRegister queryInfo.maxThreads=${queryInfo.maxThreads}, queryInfo.lastDate=${queryInfo.lastDate}, queryInfo.lastDateTime=${queryInfo.lastDateTime}, queryInfo.maxSearchesAvailable=${queryInfo.maxSearchesAvailable}`)
    
    const [within1, newLastDateTime1] = this.searchWithTargetLabel(queryInfo)

    let within6 = within1
    let newLastDateTime6 = newLastDateTime1

    const [within2, newLastDateTime2] = this.searchWithFrom(queryInfo)
    
    // いかの２つの検索で、どちらも存在しない場合
    // 　1)検索対象ラベルが付いていて、検索済みラベルが付いていないメッセージ
    //   2)指定検索条件に合致するが、検索済みラベルがついていないメッセージ
    if( within6.getMsgCount() === 0 && within2.getMsgCount() === 0 ){
      // スプレッドシートに検索結果記録が存在しない場合、(検索済みであることを示す)endLabelを剥がして、検索をやり直す
      const idsSize = this.registeredEmail.getIdsSize()
      if( idsSize === 0 ){
        queryInfo.pairLabel.removeEndLabelFromEmails()
        const [within3, newLastDateTime3] = this.searchWithTargetLabel(queryInfo)
        // この段階で、検索結果が0であれば、そもそも検索対象が存在しないとみなす
        within6 = within3
        newLastDateTime6 = newLastDateTime3
      }
      // スプレッドシートに検索結果記録が存在する場合、新しい検索対象が存在しないとみなす
    }

    YKLiblog.Log.debug(`EmailFetcherAndStorer searchAndRegister newLastDateTime2=${newLastDateTime2}`)
    const lastDateTime = queryInfo.lastDateTime

    // 検索結果メッセージのうちでも最も新しい日付を更新する
    this.registerLastDateTime(newLastDateTime6, newLastDateTime2, lastDateTime)
    this.registerNth()
  }
}
