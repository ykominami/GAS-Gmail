class TargetedEmail {
  constructor(index, item, backupRootFolderInfo, folderConf, spreadsheet){
    YKLiblog.Log.debug(`TargetedEmail constructor index=${index} backupRootFolderInfo=${backupRootFolderInfo}`)
    this.spreadsheet = spreadsheet

    this.index = index
    const name = item[1]
    this.name = name
    this.index_name = 1
    this.condition = item[2]
    this.index_condition = 2
    const backupFolderId = item[3]
    this.backupFolderId = backupFolderId
    this.index_backupFolderId = 3
    this.backupFolderUrl = item[4]
    this.index_backupFolderUrl = 4
    this.lastDateTime = new Date( item[5] ).getTime()
    this.indexLastDateTime = 5
    if( !this.lastDateTime ){
      this.lastDateTime = new Date(0).getTime();
    }
    this.lastDate = new Date( this.lastDateTime )
    // YKLiblog.Log.debug(`TargetedEmail|index=${index} name=${this.getName()} lastDate=${this.lastDate}`)
    this.nth = parseInt(item[6])
    this.index_nth = 6
    this.count = parseInt(item[7])
    this.index_count = 7
    this.count2 = parseInt(item[8])
    this.index_count2 = 8
 
    YKLiblog.Log.debug(`TargetedEmail constructor backupRootFolderInfo=${backupRootFolderInfo}`)
    this.backupRootFolderInfo = backupRootFolderInfo
    if( this.backupFolderId ){
      YKLiblog.Log.debug(`this.backupFolderId=${this.backupFolderId}`)
      try{
        this.backupFolder = DriveApp.getFolderById(this.backupFolderId)
      }
      catch(e){
        YKLiblog.Log.unknown(e)
        this.backupFolderId = null
      }
    }
    if( !this.backupFolderId ){
      const yklibbFolderInfo = new YKLibb.FolderInfo(backupRootFolderInfo.getPath(), backupRootFolderInfo.getFolderId() )
      this.backupFolder = YKLibb.Googleapi.getOrCreateFolderUnderSpecifiedFolder(yklibbFolderInfo, this.getFolderId(), this.getName())
      if( this.backupFolder !== null ){
        this.backupFolderId = this.backupFolder.getId()
      }
    }
    YKLiblog.Log.debug(`TargetedEmail constructor this.backupFolder=${this.backupFolder}`)

    this.folderConf = folderConf
    this.maxSearchesAvailable = folderConf.maxSearchesAvailable
    YKLiblog.Log.debug(`TargetedEmail constructor typeof(this.maxSearchesAvailable) =${ typeof(this.maxSearchesAvailable) }`)
    this.maxThreads = folderConf.maxThreads
    this.maxItem = folderConf.maxItem

    this.old_backupFolderId = this.backupFolderId;
    this.old_backupFolderUrl = this.backupFolderUrl;

    this.old_LastDateTime = this.lastDateTime;
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
    Logger.log(`this.backupRootFolderInfo.constructor.name=${this.backupRootFolderInfo.constructor.name}`)
    const formattedDate = this.backupRootFolderInfo.geFormattedDate()
    const filename = `${this.getName()}_${formattedDate}.json`
    const doc = YKLibb.Googleapi.getOrCreateGoogleDocsUnderFolder(this.backupRootFolderInfo.getFolderId(), filename)
    return doc;
  }
  overWriteLastData(other){
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
      backupFolder: this.backupFolder,
    }
    return JSON.stringify(assoc);
  }
  backup(){
    this.backupFolderId = this.old_backupFolderId;
    if( !this.backupFolderId ){
      this.backupFolderId = this.backupFolder.getId();
    }// 
    // YKLiblog.Log.debug(`TargetedEmail.backup this.folderId=${this.folderId}`)
    this.backupFolderUrl = this.old_backupFolderUrl;
    if( !this.backupFolderUrl ){
      this.backupFolderUrl = this.backupFolder.getUrl();
    }
    // YKLiblog.Log.debug(`TargetedEmail.backup this.url=${this.url}`)
    const text = this.asJson();
    if(this.backupRootFolderInfo !== null){
      this.backupFileId = this.getOrCreateBackupfile().getId();
      YKLibb.Googleapi.writeToGoogleDocs(this.backupFileId, text);
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
}
