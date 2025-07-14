class TargetedEmail {
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

    this.index_messageCount = currentIndex++
    let messageCount = parseInt(this.index_messageCount, 10)
    if( isNaN(messageCount) ){
      messageCount = 0
    }

    this.index_lastDateTime = currentIndex++
    let lastDateTime = parseInt(this.index_lastDateTime, 10)
    if( isNaN(lastDateTime) ){
      lastDateTime = 0
    }
    this.lastDateTime = lastDateTime
    this.lastDate = new Date(lastDateTime)

    this.setValidLatestDateAndDateTime(this.lastDateTime)
    this.index_lastDateStr = currentIndex++

    this.index_nth = currentIndex++
    this.nth = parseInt(item[ this.index_nth ], 10)
    if( isNaN(this.nth) ){
      this.nth = 1
    }

    this.index_count = currentIndex++
    this.count = parseInt(item[ this.index_count ], 10)
    if( isNaN(this.count) ){
      this.count = 10
    }

    this.index_count2 = currentIndex++
    this.count2 = parseInt(item[ this.index_count2 ], 10)
    if( isNaN(this.count2) ){
      this.count2 = 10
    }

    this.searchConf = searchConf
    this.idSetSize = 0
  }
  setValidLatestDateAndDateTime(lastDateTime){
    const [validLastDate, validLastDateTime, validLastDateStr] = YKLibb.Util.getValidDateAndDateTime(lastDateTime)
    this.lastDate = validLastDate
    this.lastDateTime = validLastDateTime
    this.lastDateStr = validLastDateStr
  }
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
   * @param {object} parentFolder 親フォルダ
   * @param {string} folderName 検索または作成するフォルダ名
   * @returns {object} 見つかった、または新規作成されたフォルダ
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

  getOrCreateBackupFolderFromBackupRootFolder(backupRootFolderInfo){
    const parentFolder = backupRootFolderInfo.getFolder()
    return this.getOrCreateBackupFolder(this.backupFolderId, parentFolder, this.name )
  }
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
  // TargetedEmailの情報をもとに、PairLabel、QueryInfoを作成
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
    if( !this.lastDateTime){
      throw new Error("this.lastDateTime is null")
    }
    if( typeof(this.lastDateTime) === "undefined"){
      throw new Error("Can't get this.lastDateTime")
    }

    const queryInfo = new QueryInfo(this.condition, pairLabel, this.searchConf.maxThreads, this.searchConf.maxSearchesAvailable, this.lastDateTime)
    return [pairLabel, queryInfo]
  }

  saveData(messageDataList){
    this.backupFile.saveData(messageDataList)
  }
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

    this.item[this.index_messageCount] = this.messageCount;
    this.item[this.index_worksheetUrl] = this.worksheetUrl;

    // this.item[this.index_lastDate] = this.lastDate;
    this.item[this.index_lastDateStr] = this.lastDateStr;
    this.item[this.index_lastDateTime] = this.lastDateTime;
    const lastDateStr = YKLibb.Util.dateTimeToString(this.lastDate);
    this.item[this.index_lastDateStr] = lastDateStr;

    YKLiblog.Log.debug(`this.index=${this.index} this.index_lastDateStr=${this.index_lastDateStr} this.item[${this.index}][${this.index_lastDateStr}]=${this.item[this.index_lastDateStr]}`)
    this.item[this.index_nth] = this.nth;
    // this.item[this.index_count] = this.count;
    this.item[this.index_count2] = this.count2;
    this.item[this.index_count] = this.idSetSize
    YKLiblog.Log.unknown(`this.idSetSize=${ this.idSetSize }`)

    YKLiblog.Log.debug(`this.item=${JSON.stringify(this.item)}`)
  }
  update(){
    const rangeShape = YKLiba.Range.getRangeShape(this.rowRange)
    YKLiblog.Log.debug(`rangeShape=${ JSON.stringify(rangeShape) }`)
    YKLiblog.Log.debug(`this.item=${ JSON.stringify(this.item) }` )
    this.rowRange.setValues( [this.item] )
  }
  /*
  setIdSetSize(value){
    this.idSetSize = value
  }
  */
  setMessageCount(value){
    this.messageCount = value
  }
  setWorksheetUrl(url){
    this.worksheetUrl = url
  }
  getName(){
    return this.name
  }
  setNth(value){
    this.nth = value
  }
  getNth(){
    return this.nth
  }
  setCount(value){
    this.count = value
  }
  setCount2(value){
    this.count2 = value
  }
  asJson(){
    const assoc = {
      index: this.index,
      name: this.getName(),
      index_name: this.index_name,
      condition: this.condition,
      index_condition: this.index_condition,
      backupFolderId: this.backupFolderId,
      index_backupFolderId: this.index_backupFolderId,
      backupFolderUrl: this.backupFolderUrl,
      index_backupFolderUrl: this.index_backupFolderUrl,
      lastDateTime: this.lastDateTime,
      index_lastDateTime: this.index_lastDateTime,
      lastDate: this.lastDate,
      nth: this.nth,
      index_nth: this.index_nth,
      count: this.count,
      index_count: this.index_count,
      count2: this.count2,
      index_count2: this.index_count2,
      backupFolder: this.backupFolder,
    }
    return JSON.stringify(assoc);
  }
  getLastDate(){
    return this.lastDate
  }

  // Getter methods for key properties
  getName() {
    return this.name;
  }
  getUrl() {
    return this.backupFolderUrl;
  }
  getCondition() {
    return this.condition;
  }
  getOldNth() {
    return this.old_nth;
  }
  setMaxSearchesAvailable(value){
    this.maxSearchesAvailable = value
  }
  setMaxThreads(value){
    this.setMaxThreads = value
  }
}
