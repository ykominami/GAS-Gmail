class TargetedEmail {
  constructor(index, item, backupRootFolderInfo, folderConf, spreadsheet, config){
    this.config = config
    YKLiblog.Log.debug(`TargetedEmail constructor index=${index} backupRootFolderInfo=${backupRootFolderInfo}`)
    this.spreadsheet = spreadsheet

    this.index = index
    this.name = item[1]
    this.index_name = 1
    this.condition = item[2]
    this.index_condition = 2
    this.backupFolderId = item[3]
    const old_backupFolderId = this.backupFolderId
    this.index_backupFolderId = 3
    this.backupFolderUrl = item[4]
    this.index_backupFolderUrl = 4
    this.lastDateTime = new Date(item[5]).getTime()
    this.indexLastDateTime = 5
    if( !this.lastDateTime ){
      this.lastDateTime = new Date(0).getTime();
    }
    this.lastDate = new Date( this.lastDateTime )
    // YKLiblog.Log.debug(`TargetedEmail|index=${index} name=${this.getName()} lastDate=${this.lastDate}`)
    this.nth = parseInt(item[6], 10)
    if( isNaN(this.nth) ){
      this.nth = 1
    }
    this.index_nth = 6
    this.count = parseInt(item[7], 10)
    if( isNaN(this.count) ){
      this.count = 10
    }
    this.index_count = 7
    this.count2 = parseInt(item[8], 10)
    if( isNaN(this.count2) ){
      this.count2 = 10
    }
    this.index_count2 = 8

    this.backup()

    YKLiblog.Log.debug(`TargetedEmail constructor backupRootFolderInfo=${backupRootFolderInfo}`)
    this.backupRootFolderInfo = backupRootFolderInfo
    YKLiblog.Log.debug(`TargetedEmail constructor this.backupFolder=${this.backupFolder}`)

    this.folderConf = folderConf
    this.maxSearchesAvailable = folderConf.maxSearchesAvailable
    YKLiblog.Log.debug(`TargetedEmail constructor typeof(this.maxSearchesAvailable) =${ typeof(this.maxSearchesAvailable) }`)
    this.maxThreads = folderConf.maxThreads
    this.maxItems = folderConf.maxItems

    const parentFolder = this.backupRootFolderInfo.getFolder()
  }
  // name
  getOrCreateBackupFolderId(backupFolderId, parentFolder, folderName){
    let backupFolder = null
    if( backupFolderId ){
      YKLiblog.Log.debug(`backupFolderId=${backupFolderId}`)
      try{
        backupFolder = DriveApp.getFolderById(backupFolderId)
      }
      catch(e){
        YKLiblog.Log.unknown(e)
        backupFolderId = null
        backupFolder = null
      }
    }
    if( !backupFolderId ){
      try {
        backupFolderId = YKLibb.Gapps.getOrCreateFolderId(parentFolder, folderName )
      } catch(e) {
        YKLiblog.Log.unknown(e)
        backupFolder = null
        backupFolderId = null
      }
    }
    return backupFolder
  }
  backup(){
    // Store old values for backup functionality
    this.old_backupFolderId = this.backupFolderId;
    this.old_backupFolderUrl = this.backupFolderUrl;
    this.oldLastDateTime = this.lastDateTime;
    this.old_nth = this.nth;
    this.old_count = this.count;
    this.old_count2 = this.count2;
  }
  getBackupFolder(){
    return this.backupFolder
  }
  getFolderId(){
    return this.backupFolderId;
  }
  getOrCreateBackupfile(){
    if (!this.backupRootFolderInfo) {
      YKLiblog.Log.error('backupRootFolderInfo is null')
      return null
    }
    
    try {
      Logger.log(`this.backupRootFolderInfo.constructor.name=${this.backupRootFolderInfo.constructor.name}`)
      const formattedDate = this.backupRootFolderInfo.getFormattedDate()
      const filename = `${this.getName()}_${formattedDate}.json`
      const doc = YKLibb.Gapps.getOrCreateGoogleDocsUnderFolder(this.backupRootFolderInfo.getFolderId(), filename)
      return doc;
    } catch(e) {
      YKLiblog.Log.unknown(e)
      return null
    }
  }
  overWriteLastData(other){
    if (!other) {
      YKLiblog.Log.error('other parameter is null in overWriteLastData')
      return
    }
    
    this.lastDateTime = other.lastDateTime
    this.lastDate = other.lastDate
    this.oldLastDateTime = other.oldLastDateTime
  }
  setMaxSearchesAvailable(value){
    this.maxSearchesAvailable = value
  }
  setMaxThreads(value){
    this.maxThreads = value
  }
  setNth(value){
    this.nth = value
  }
  setCount(value){
    this.count = value
  }
  setCount2(value){
    this.count2 = value
  }
  setLastDateTime(value) {
    this.lastDateTime = value;
    this.lastDate = new Date(value);
  }
  getLastDateTime() {
    return this.lastDateTime
  }
  getLastDate() {
    return this.lastDate
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
      indexLastDateTime: this.indexLastDateTime,
      lastDate: this.lastDate,
      nth: this.nth,
      index_nth: this.index_nth,
      count: this.count,
      index_count: this.index_count,
      count2: this.count2,
      index_count2: this.index_count2,
      maxSearchesAvailable: this.maxSearchesAvailable,
      maxThreads: this.maxThreads,
      maxItems: this.maxItems,
      backupFolder: this.backupFolder,
    }
    return JSON.stringify(assoc);
  }
  backup(){
    this.backupFolderId = this.old_backupFolderId;
    if( !this.backupFolderId && this.backupFolder ){
      try {
        this.backupFolderId = this.backupFolder.getId();
      } catch(e) {
        YKLiblog.Log.unknown(e)
        this.backupFolderId = null
      }
    }
    
    this.backupFolderUrl = this.old_backupFolderUrl;
    if( !this.backupFolderUrl && this.backupFolder ){
      try {
        this.backupFolderUrl = this.backupFolder.getUrl();
      } catch(e) {
        YKLiblog.Log.unknown(e)
        this.backupFolderUrl = null
      }
    }
    
    const text = this.asJson();
    if(this.backupRootFolderInfo !== null){
      try {
        const backupFile = this.getOrCreateBackupfile();
        if (backupFile) {
          this.backupFileId = backupFile.getId();
          YKLibb.Gapps.writeToGoogleDocs(this.backupFileId, text);
        }
      } catch(e) {
        YKLiblog.Log.unknown(e)
      }
    }
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
  getLastDate() {
    return this.lastDate;
  }
  getOldNth() {
    return this.old_nth;
  }
  getMaxThreads() {
    return this.maxThreads;
  }
  getMaxSearchesAvailable() {
    return this.maxSearchesAvailable;
  }
  getMaxItems() {
    return this.maxItems;
  }
}
