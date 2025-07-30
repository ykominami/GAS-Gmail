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

    this.gmailSearch = new GmailSearch()
    this.limitx = limitx;
    const [pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo()
    this.pairLabel = pairLabel
    this.queryInfo = queryInfo
    this.op = op
    this.nth = nth

    this.numberOfThreadsOfTargetLabel = -1
    this.numberOfThreadsOfEndLabel = -1
    this.numberOfThreadsOfTargetLabelRetry = -1

    this.dateRangeQueryList = null
    this.threshold = 50
    this.maxYearsAgo = 6
    this.maxThreads = this.queryInfo.maxThreads
    if( this.isBigMessageNumber() ){
      const way = EmailFetcherAndStorer.From()
      this.dateRangeQueryList = new DateRangeQueryList(way, this.maxThreads)
      this.dateRangeQueryList.collectThreads(this.gmailSearch, this.queryInfo, this.maxThreads)
      this.dateRangeQueryList.getThreads(this.gmailSearch, this.queryInfo, this.maxThreads)
    } 
  }

  getDateRangeQueryList(){
    return this.dateRangeQueryList
  }

  existYears(){
    let size = 0
    const dateRangeQueryList = this.getDateRangeQueryList()
    if( dateRangeQueryList !== null ){
      size = dateRangeQueryList.getYearsSize() 
    }
    return (size > 0)
  }

  isBigMessageNumber(){
    return (this.targetedEmail.getMcount() > this.targetedEmail.getThreshold)
  }
  
  /**
   * 複数の検索方法を組み合わせてメールを検索し、結果を登録する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   */
  searchAndRegisterLastDateTime(queryInfo){
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchAndRegisterLastDateTime queryInfo.maxThreads=${queryInfo.maxThreads}, queryInfo.lastDate=${queryInfo.lastDate}, queryInfo.lastDateTime=${queryInfo.lastDateTime}, queryInfo.maxSearchesAvailable=${queryInfo.maxSearchesAvailable}`)

    let targetLabelAndNoEndLabel
    let newLastDateTimeOfTargetLabelAndNoEndLabel
    // 検索対象ラベルが付いているが、検索済ラベルが付いていないスレッドを検索する
    [targetLabelAndNoEndLabel, newLastDateTimeOfTargetLabelAndNoEndLabel] = this.searchWithTargetLabelAndStore(queryInfo)


    // 指定検索条件(From)に合致するが、検索済ラベルが付いていないスレッドを検索する
    const [fromAndNoEndLabel, newLastDateTimeOfFromAndNoEndLabel] = this.searchWithFromAndStore(queryInfo)
    
    // 検索対象ラベルがついたスレッドの個数を取得
    const threadsOfTargetLabel = this.pairLabel.getThreadsFromTargetLabel()
    const numberOfThreadsOfTargetLabel = threadsOfTargetLabel.length
    this.numberOfThreadsOfTargetLabel = numberOfThreadsOfTargetLabel
    YKLiblog.Log.debug(`this.numberOfThreadsOfTargetLabel=${this.numberOfThreadsOfTargetLabel}`)
    // @ts-ignore
    // 検索済ラベルがついたスレッドの個数を取得
    const threadsOfEndLabel = this.pairLabel.getThreadsFromEndLabel()
    const numberOfThreadsOfEndLabel = threadsOfEndLabel.length
    this.numberOfThreadsOfEndLabel = numberOfThreadsOfEndLabel
    YKLiblog.Log.debug(`this.numberOfThreadsOfEndLabel=${this.numberOfThreadsOfEndLabel}`)

    // 以下の２つの検索で、どちらも存在しない場合
    // 　1)検索対象ラベルが付いていて、検索済みラベルが付いていないメッセージ
    //   2)指定検索条件に合致するが、検索済みラベルがついていないメッセージ
    const msgCountOfTargetLabelAndNoEndLabel = targetLabelAndNoEndLabel.getMsgCount()
    const msgCountOfFromAndNoEndLabel = fromAndNoEndLabel.getMsgCount()
    YKLiblog.Log.debug(`msgCountOfTargetLabelAndNoEndLabel=${msgCountOfTargetLabelAndNoEndLabel}`)
    YKLiblog.Log.debug(`msgCountOfFromAndNoEndLabel=${msgCountOfFromAndNoEndLabel}`)
    if( msgCountOfTargetLabelAndNoEndLabel === 0 && msgCountOfFromAndNoEndLabel === 0 ){
      // 検索対象ラベルが付いたスレッドが存在するならば、新しい検索対象が存在しないとみなす
      // スプレッドシートに検索結果記録が存在しない場合、(検索済みであることを示す)endLabelを剥がして、検索をやり直す
      const idsSize = this.registeredEmail.getIdsSize()
      if( idsSize === 0 ){
        this.searchWithTargetLabel(queryInfo)
        queryInfo.pairLabel.removeEndLabelFromEmails()
        const [targetLabelAndNoEndLabelRetry, newLastDateTimeOfTargetLabelAndNoEndLabelRetry] = this.searchWithTargetLabel(queryInfo)
        // この段階で、検索結果が0であれば、そもそも検索対象が存在しないとみなす
        targetLabelAndNoEndLabel = targetLabelAndNoEndLabelRetry
        newLastDateTimeOfTargetLabelAndNoEndLabel = newLastDateTimeOfTargetLabelAndNoEndLabelRetry

        const threadsOfTargetLabelRetry = this.pairLabel.getThreadsFromTargetLabel()
        const numberOfThreadsOfTargetLabelRetry = threadsOfTargetLabelRetry.length
        this.numberOfThreadsOfTargetLabelRetry = numberOfThreadsOfTargetLabelRetry
        YKLiblog.Log.debug(`this.numberOfThreadsOfTargetLabelRetry=${this.numberOfThreadsOfTargetLabelRetry}`)
      }
      // スプレッドシートに検索結果記録が存在する場合、新しい検索対象が存在しないとみなす
    }

    YKLiblog.Log.debug(`EmailFetcherAndStorer searchAndRegisterLastDateTime newLastDateTimeOfTargetLabelAndNoEndLabel=${newLastDateTimeOfTargetLabelAndNoEndLabel}`)
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchAndRegisterLastDateTime newLastDateTimeOfFromAndNoEndLabel=${newLastDateTimeOfFromAndNoEndLabel}`)
    const lastDateTime = queryInfo.lastDateTime

    // 検索結果メッセージのうちでも最も新しい日付を更新する
    queryInfo.lastDateTime = this.registerLastDateTime(newLastDateTimeOfTargetLabelAndNoEndLabel, newLastDateTimeOfFromAndNoEndLabel, lastDateTime)
  }
  
  searchWithTargetLabel(queryInfo){
    const way = EmailFetcherAndStorer.SearchWithTargetLabel()
    YKLiblog.Log.debug(`EmailFetcher searchWithTargetLabel way=${way} queryInfo.additionalQuery=${queryInfo.additionalQuery}`)
    const [within, newLastDateTime] = this.searchWith(queryInfo, way)
    YKLiblog.Log.debug(`EmailFetcher searchWithTargetLabel within.msgCount=${within.msgCount}`)
    return [within, newLastDateTime]
  }

  searchWith(queryInfo, way){
    const [within, remain, newLastDateTime] = this.fetchEmail(queryInfo, way)
    return [within, newLastDateTime]
  }

  /**
   * ターゲットラベルを使用してメールを検索する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  searchWithTargetLabelAndStore(queryInfo){
    const way = EmailFetcherAndStorer.SearchWithTargetLabel()
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchWithTargetLabel way=${way}`)
    const [within, newLastDateTime] = this.searchWithAndStore(queryInfo, way)
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchWithTargetLabel within.msgCount=${within.msgCount}`)
    return [within, newLastDateTime]
  }

  /**
   * ターゲットラベルのみを使用してメールを検索する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  searchWithTargetLabelOnlyAndStore(queryInfo){
    const way = EmailFetcherAndStorer.SearchWithTargetLabelOnly()
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchWithTargetLabelOnly way=${way}`)
    const [within, newLastDateTime] = this.searchWithAndStore(queryInfo, way)
    return [within, newLastDateTime]
  }
  
  /**
   * Fromフィールドを使用してメールを検索する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  searchWithFromAndStore(queryInfo){
    const way = EmailFetcherAndStorer.SearchWithFrom()
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchWithFrom way=${way}`)
    const [within, newLastDateTime] = this.searchWithAndStore(queryInfo, way)
    return [within, newLastDateTime]
  }
  
  /**
   * 指定された検索方法でメールを検索する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  searchWithAndStore(queryInfo, way){
    const [within, newLastDateTime] = this.fetchAndRegisterAndStoreAndAddThreadToLabel(queryInfo, way)
    return [within, newLastDateTime]
  }
  
  /**
   * メールを取得、保存、ラベル追加を一連の処理として実行する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} [within, newLastDateTime] - 処理対象メール、最新日時
   */
  fetchAndRegisterAndStoreAndAddThreadToLabel(queryInfo, way){
    // remainは処理の対象から外す
    const [within, remain, newLastDateTime] = this.fetchEmail(queryInfo, way)
    //
    const queryString = queryInfo.getQueryString(way)
    this.registerDataAndAddDataRowAndUpdate(within, queryString)

    if( within.getMsgCount() > 0){
      this.storeEmail(within, way)
      queryInfo.pairLabel.addThreadToLabel(within, way)
    }
    return [within, newLastDateTime]
  }

  /**
   * 指定された検索条件と方法でメールを取得する
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @returns {Array} [within, remain, newLastDateTime] - 処理対象メール、残りメール、最新日時
   */
  fetchEmail(queryInfo, way){
    const [newLastDateTime, within, remain] = this.gmailSearch.searchAndClassify(queryInfo, this.registeredEmail, way, this.config)

    return [within, remain, newLastDateTime]
  }

  /**
   * 取得したメールをストレージに保存し、関連データを更新する
   * @param {Object} within - 処理対象のメールデータ
   * @param {string} way - 検索方法
   */
  storeEmail(within, way){
    YKLiblog.Log.debug(`storeEmail 1 way=${way} within.msgCount=${within.msgCount} within.threadCount=${within.threadCount}`)
    //

    if( within.getMsgCount() === 0 ){
      return
    }
    // 切り詰めメッセージが1個以上であれば、Google Docsファイルとして保存する
    const messageDataList = within
    YKLiblog.Log.debug(`storeEmail messageDataList.length=${messageDataList.length}`)
    this.targetedEmail.saveData(messageDataList)
  }
  getEmailSearchResultStateBefore(){
    const existingMsgCount = this.registeredEmail.getIdsSize()
    const existingId = this.registeredEmail.getLastId()

    const lastDate = this.targetedEmail.getLastDate()
    return [existingMsgCount, existingId, lastDate]
  }
  getEmailSearchResultStateAfter(){
    const existingMsgCount2 = this.registeredEmail.getIdsSize()
    const existingId2 = this.registeredEmail.getLastId()

    let msgCount
    if( messageDataList == null ){
      msgCount = 0
    }
    else{
      msgCount = messageDataList.length
    }
    return [existingMsgCount2, existingId2, msgCount]
  }
  makeDataRows(queryString, existingMsgCount, existingMsgCount2, existingId, existingId2, msgCount, msgCount2, way){
    //
    //[nameOfId, "condition", "query", "existingMsgCount", "existingMsgCount2", "existing_id", "existing_id2", "messageSize", "within",  "numberOfThreadsOfTargetLabel","numberOfThreadsOfEndLabel""numberOfThreadsOfTargetLabelRetry","nth", "way"]

    const array = [this.targetedEmail.getName(), this.targetedEmail.getCondition(), queryString, existingMsgCount, existingMsgCount2, existingId, existingId2, msgCount, msgCount2 , 
    this.numberOfThreadsOfTargetLabel,
    this.numberOfThreadsOfEndLabel,
    this.numberOfThreadsOfTargetLabelRetry,
    this.targetedEmail.getNth(), way]

    return array
  }
  registerDataAndAddDataRowAndUpdate(within, queryString){
    if( typeof(within.msgCount) === "undefined" ){
      throw new Error(`storeEmail within.msgCount`)
    }
    if( within.getMsgCount() == 0 ){
      // return
    }
    YKLiblog.Log.debug(`storeEmail 2`)
    //
    const [existingMsgCount, existingId, lastDate] = getEmailSearchResultStateBefore()

    const messageDataList = this.registeredEmail.registerData(within, this.op, this.limitx, lastDate)

    const [existingMsgCount2, existingId2, msgCount] = getEmailSearchResultStateAfter()

    const array = makeDataRows(queryString, existingMsgCount, existingMsgCount2, existingId, existingId2, msgCount, within.msgCount, way)

    this.bTable.addDataRowsAndUpdate(array)
  }

  /**
   * 最新の日時を登録し、必要に応じて更新する
   * @param {string} newLastDateTime1 - 新しい最新日時1
   * @param {string} newLastDateTime2 - 新しい最新日時2
   * @param {string} lastDateTime - 現在の最新日時
   */
  registerLastDateTime(newLastDateTime1, newLastDateTime2, lastDateTime){
    let returnValue = lastDateTime

    const array = [newLastDateTime1, newLastDateTime2, lastDateTime]
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    YKLiblog.Log.debug(`registerLastDateTime latestDateTime=${latestDateTime}`)
    if( YKLiba.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      // store.set('last_date_time', latestDateTime)
      this.targetedEmail.setValidLatestDateAndDateTime(latestDateTime)
      returnValue = latestDateTime
    }
    return returnValue
  }
}
