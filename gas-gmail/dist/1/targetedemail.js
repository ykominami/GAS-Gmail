class TargetedEmail {
  /**
   * TargetedEmailクラスのコンストラクタ
   * スプレッドシートの行データからメール検索設定を初期化します
   * 
   * @param {number} index - スプレッドシートの行インデックス
   * @param {Array} item - スプレッドシートの行データ配列
   * @param {Object} searchConf - 検索設定オブジェクト
   * @param {Object} rowRange - スプレッドシートの行範囲オブジェクト
   */
  constructor(index, item, searchConf, rowRange){
    this.rowRange = rowRange
    this.item = item
    this.index = index

    let currentIndex = 1
    this.index_name = currentIndex++
    this.name = item[ this.index_name ]

    this.index_condition = currentIndex++
    this.condition = item[ this.index_condition ]

    this.index_backupFolderId = currentIndex++
    this.backupFolderId = item[ this.index_backupFolderId ]

    this.index_backupFolderUrl = currentIndex++
    this.backupFolderUrl = item[ this.index_backupFolderUrl ]

    this.index_worksheetUrl = currentIndex++
    this.worksheetUrl = item[ this.index_worksheetUrl ]

    this.index_existingMessageCount = currentIndex++
    let existingMessageCount = item[ this.index_existingMessageCount ]
    existingMessageCount = parseInt(existingMessageCount, 10)
    if( isNaN(existingMessageCount) ){
      existingMessageCount = 0
    }
    this.existingMessageCount = existingMessageCount

    this.index_messageCount = currentIndex++
    let messageCount = item[ this.index_messageCount ]
    messageCount = parseInt(messageCount, 10)
    if( isNaN(messageCount) ){
      messageCount = 0
    }
    this.messageCount = messageCount

    this.index_remainMessageCount = currentIndex++
    let remainMessageCount = item[ this.index_remainMessageCount ]
    remainMessageCount = parseInt(remainMessageCount, 10)
    if( isNaN(remainMessageCount) ){
      remainMessageCount = 0
    }
    this.remainMessageCount = remainMessageCount

    this.index_lastDateTime = currentIndex++
    this.index_lastDateStr = currentIndex++

    let lastDateTime = item[this.index_lastDateTime]
    lastDateTime = parseInt(lastDateTime, 10)
    if( isNaN(lastDateTime) ){
      lastDateTime = 0
    }
    //  this.lastDate = new Date(lastDateTime)
    // this.lastDateTime = lastDate.getTime()
    // this.lastDateStr
    this.setValidLatestDateAndDateTime(lastDateTime)
  

    this.index_nth = currentIndex++
    let nth = parseInt(item[ this.index_nth ], 10)
    if( isNaN(nth) ){
      nth = 1
    }
    this.nth = nth

    this.index_count = currentIndex++
    let count = parseInt(item[ this.index_count ], 10)
    if( isNaN(count) ){
      count = 10
    }
    this.count = count

    this.index_count2 = currentIndex++
    let count2 = parseInt(item[ this.index_count2 ], 10)
    if( isNaN(count2) ){
      count2 = 10
    }
    this.count2 = count2

    this.searchConf = searchConf
  }

  /**
   * 有効な最新日時と日時文字列を設定します
   * 
   * @param {number} lastDateTime - タイムスタンプ（ミリ秒）
   */
  setValidLatestDateAndDateTime(lastDateTime){
    const [validLastDate, validLastDateTime, validLastDateStr] = YKLibb.Util.getValidDateAndDateTime(lastDateTime)
    this.lastDate = validLastDate
    this.lastDateTime = validLastDateTime
    this.lastDateStr = validLastDateStr
  }

  /**
   * 検索の準備を行います
   * バックアップフォルダの作成とバックアップファイルの初期化を行います
   * 
   * @param {Object} backupRootFolderInfo - バックアップルートフォルダ情報
   * @throws {Error} バックアップフォルダの作成に失敗した場合
   */
  prepareForSearch(backupRootFolderInfo){
    this.backupFolder = this.getOrCreateBackupFolderFromBackupRootFolder(backupRootFolderInfo)
    if(this.backupFolder === null){
      throw Error("Can't get or create backupFolder")
    }
    const backupFolderId = this.backupFolder.getId()
    this.backupFolderId = backupFolderId  
    YKLiblog.Log.debug(`TargetedEmail this.backupFolderId=${this.backupFolderId}`)

    // 検索したEメールのうち、スプレッドシートにすべてを記録できなかったものをGoogle DocsファイルとしてJSON形式で出力する
    this.backupFile = new BackupFile( this.backupFolder )
    this.backupFolderUrl = this.backupFile.getUrl()
    
    this.setValidLatestDateAndDateTime(this.lastDateTime)
  }

  /**
   * 親フォルダの直下に指定したフォルダ名が存在するかを確認し、
   * 存在すればそのフォルダを、存在しなければ新規作成してそのフォルダを返します。
   *
   * @param {Object} parentFolder - 親フォルダオブジェクト
   * @param {string} folderName - 検索または作成するフォルダ名
   * @returns {Object} 見つかった、または新規作成されたフォルダオブジェクト
   * @throws {Error} フォルダの取得または作成中にエラーが発生した場合
   */
  getOrCreateFolder(parentFolder, folderName) {
    let folder = null
    try {
      // 親フォルダの直下にあるフォルダを検索
      const subFolders = parentFolder.getFolders();
      while (subFolders.hasNext()) {
        folder = subFolders.next();
        if (folder.getName() === folderName) {
          // 指定したフォルダ名が見つかった場合、そのIDを返す
          YKLiblog.Log.debug(`"${folderName}" フォルダが既存のため、IDを返します: ${folder.getId()}`);
          return folder;
        }
      }

      // 指定したフォルダ名が見つからなかった場合、新規作成する
      const newFolder = parentFolder.createFolder(folderName);
      YKLiblog.Log.debug(`"${folderName}" フォルダを新規作成しました。ID: ${newFolder.getId()}`);
      return newFolder;

    } catch (e) {
      YKLiblog.Log.error("エラーが発生しました: " + e.toString());
      throw new Error("フォルダの取得または作成中にエラーが発生しました。入力IDとアクセス権を確認してください。");
    }
  }

  /**
   * バックアップルートフォルダからバックアップフォルダを取得または作成します
   * 
   * @param {Object} backupRootFolderInfo - バックアップルートフォルダ情報
   * @returns {Object|null} バックアップフォルダオブジェクト、失敗時はnull
   */
  getOrCreateBackupFolderFromBackupRootFolder(backupRootFolderInfo){
    const parentFolder = backupRootFolderInfo.getFolder()
    return this.getOrCreateBackupFolder(this.backupFolderId, parentFolder, this.name )
  }

  /**
   * 指定されたIDまたは名前でバックアップフォルダを取得または作成します
   * 
   * @param {string|null} backupFolderId - バックアップフォルダID（オプション）
   * @param {Object} parentFolder - 親フォルダオブジェクト
   * @param {string} folderName - フォルダ名
   * @returns {Object|null} バックアップフォルダオブジェクト、失敗時はnull
   */
  getOrCreateBackupFolder(backupFolderId, parentFolder, folderName){
    let backupFolder = null
    if( backupFolderId ){
      YKLiblog.Log.debug(`backupFolderId=${backupFolderId}`)
      try{
        backupFolder = DriveApp.getFolderById(backupFolderId)
      }
      catch(e){
        YKLiblog.Log.unknown(e.name)
        YKLiblog.Log.unknown(e.message)
        YKLiblog.Log.unknown(e.stack)
        backupFolderId = null
        backupFolder = null
      }
    }
    if( !backupFolder ){
      try {
        backupFolder = this.getOrCreateFolder(parentFolder, folderName )
      } catch(e) {
        YKLiblog.Log.unknown(e.name)
        YKLiblog.Log.unknown(e.message)
        YKLiblog.Log.unknown(e.stack)
        backupFolder = null
        backupFolderId = null
      }
    }
    return backupFolder
  }

  /**
   * TargetedEmailの情報をもとに、PairLabelとQueryInfoを作成します
   * 
   * @returns {Array} [pairLabel, queryInfo] の配列
   * @throws {Error} 必要な設定値が不足している場合
   */
  makePairLabelAndQueryInfo(){
    const pairLabel = new PairLabel(this.name)

    if(this.getMaxThreads < 0 ){
      throw Error(`maxThreads=${this.getMaxThreads}`)
    }
    YKLiblog.Log.debug(`TargetedEmail typeof(this.getMaxSearchesAvailable())=${ typeof(this.getMaxSearchesAvailable) }`)

    if( !this.condition){
      throw new Error("this.confition is null")
    }
    if( typeof(this.condition) === "undefined"){
      throw new Error("Can't get this.confition")
    }
    if( !pairLabel){
      throw new Error("pairLabel is null")
    }
    if( typeof(pairLabel) === "undefined"){
      throw new Error("Can't get pairLabel")
    }
    if( !this.searchConf){
      throw new Error("this.searchConf is null")
    }
    if( typeof(this.searchConf) === "undefined"){
      throw new Error("Can't get this.searchConf")
    }
    if( !this.searchConf.maxThreads){
      throw new Error("this.searchConf.maxThreads is null")
    }
    if( typeof(this.searchConf.maxThreads) === "undefined"){
      throw new Error("Can't get this.searchConf.maxThreads")
    }
    if( !this.searchConf.maxSearchesAvailable){
      throw new Error("this.searchConf.maxSearchesAvailable is null")
    }
    if( typeof(this.searchConf.maxSearchesAvailable) === "undefined"){
      throw new Error("Can't get this.searchConf.maxSearchesAvailable")
    }
    Logger.log(`makePairLabelAndQueryInfo this.lastDateTime=${this.lastDateTime}`)
    if( this.lastDateTime === null ){
      throw new Error("this.lastDateTime is null")
    }
    if( typeof(this.lastDateTime) === "undefined"){
      throw new Error("Can't get this.lastDateTime")
    }

    const queryInfo = new QueryInfo(this.condition, pairLabel, this.searchConf.maxThreads, this.searchConf.maxSearchesAvailable, this.lastDateTime, EmailFetcherAndStorer.Ways())
    return [pairLabel, queryInfo]
  }

  /**
   * メッセージデータをバックアップファイルに保存します
   * 
   * @param {Array} messageDataList - 保存するメッセージデータの配列
   */
  saveData(messageDataList){
    this.backupFile.saveData(messageDataList)
  }

  /**
   * スプレッドシートの行データを現在のインスタンスの値で更新します
   */
  rewrite(){
    // YKLiblog.Log.debug(`------------------rewrite`)
    YKLiblog.Log.debug(`rewrite this.index=${this.index}`)
    YKLiblog.Log.debug(`rewrite this.name=${this.name}`)
    YKLiblog.Log.debug(`rewrite this.item.length=${ this.item.length }`)
    YKLiblog.Log.debug(`rewrite this.item[${this.index}]=${ JSON.stringify( this.item ) }`)
    this.item[this.index_name] = this.name;
    this.item[this.index_backupFolderId] = this.backupFolderId;

    this.item[this.index_backupFolderId] = this.backupFolderId;
    this.item[this.index_backupFolderUrl] = this.backupFolderUrl;

    this.item[this.index_existingMessageCount] = this.existingMessageCount;
    this.item[this.index_messageCount] = this.messageCount;
    this.item[this.index_remainMessageCount] = this.remainMessageCount;
    this.item[this.index_worksheetUrl] = this.worksheetUrl;

    // this.item[this.index_lastDate] = this.lastDate;
    // this.item[this.index_lastDateStr] = this.lastDateStr;
    this.item[this.index_lastDateTime] = this.lastDateTime;
    const lastDateStr = YKLibb.Util.dateTimeToString(this.lastDate);
    this.item[this.index_lastDateStr] = lastDateStr;

    YKLiblog.Log.debug(`this.index=${this.index} this.index_lastDateStr=${this.index_lastDateStr} this.item[${this.index}][${this.index_lastDateStr}]=${this.item[this.index_lastDateStr]}`)
    this.item[this.index_nth] = this.nth;
    // this.item[this.index_count] = this.count;
    this.item[this.index_count2] = this.count2;
    YKLiblog.Log.unknown(`TargetedEmail rewrite this.name=${this.name} this.existingMessageCount=${ this.existingMessageCount }`)
    YKLiblog.Log.unknown(`TargetedEmail rewrite this.name=${this.name} this.messageCount=${ this.messageCount }`)
    YKLiblog.Log.unknown(`TargetedEmail rewrite this.name=${this.name} this.remainMessageCount=${ this.remainMessageCount }`)
    YKLiblog.Log.debug(`this.item=${JSON.stringify(this.item)}`)
  }

  /**
   * スプレッドシートの行範囲に更新されたデータを書き込みます
   */
  update(){
    const rangeShape = YKLiba.Range.getRangeShape(this.rowRange)
    YKLiblog.Log.debug(`rangeShape=${ JSON.stringify(rangeShape) }`)
    YKLiblog.Log.debug(`this.item=${ JSON.stringify(this.item) }` )
    this.rowRange.setValues( [this.item] )
  }

  /**
   * ワークシートのURLを設定します
   * 
   * @param {string} url - ワークシートのURL
   */
  setWorksheetUrl(url){
    this.worksheetUrl = url
  }

  /**
   * ターゲットメールの名前を取得します
   * 
   * @returns {string} ターゲットメールの名前
   */
  getName(){
    return this.name
  }

  /**
   * nth値を取得します
   * 
   * @returns {number} nth値
   */
  getNth(){
    return this.nth
  }

  /**
   * nth値を設定します
   * 
   * @param {number} nth値
   */
  setNth(value){
    this.nth = value
  }

  /**
   * count値を設定します
   * 
   * @param {number} value - 設定するcount値
   */
  setCount(value){
    this.count = value
  }

  /**
   * 最後の日付を取得します
   * 
   * @returns {Date} 最後の日付オブジェクト
   */
  getLastDate(){
    return this.lastDate
  }

  /**
   * 検索条件を取得します
   * 
   * @returns {string} 検索条件
   */
  getCondition() {
    return this.condition;
  }
  /**
   * 最大検索可能回数を設定します
   * 
   * @param {number} value - 設定する最大検索可能回数
   */
  setMaxSearchesAvailable(value){
    this.maxSearchesAvailable = value
  }
  /**
   * 最大スレッド数を設定します
   * 
   * @param {number} value - 設定する最大スレッド数
   */
  setMaxThreads(value){
    this.maxThreads = value
  }
}
