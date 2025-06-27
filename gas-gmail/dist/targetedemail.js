class TargetedEmail {
  constructor(index, item, parentFolderInfo, backupFolderInfo){
    YKLiblog.Log.debug(`parentFolderInfo=${parentFolderInfo}`)
    this.index = index
    const name = item[1]
    this.name = name
    this.index_name = 1
    this.condition = item[2]
    this.index_condition = 2
    const id = item[3]
    this.id = id
    this.index_id = 3
    this.url = item[4]
    this.index_url = 4
    this.lastDateTime = new Date( item[5] ).getTime()
    this.indexLastDateTime = 5
    if( !this.lastDateTime ){
      this.lastDateTime = new Date(0).getTime();
    }
    this.lastDate = new Date( this.lastDateTime )
    // YKLiblog.Log.debug(`TargetedEmail|index=${index} name=${this.name} lastDate=${this.lastDate}`)
    this.nth = item[6]
    this.index_nth = 6
    this.count = item[7]
    this.index_count = 7
    this.count2 = item[8]
    this.index_count2 = 8
    //
    this.maxSearchesAvailable = null
    this.maxThreads = 0

    this.old_id = this.id;
    this.old_url = this.url;

    this.oldLastDateTime = this.lastDateTime;
    this.old_nth = this.nth;
    this.old_count = this.count;
    this.old_count2 = this.count2;

    this.parentFolderInfo = parentFolderInfo;
    this.folder = null;
    if( parentFolderInfo !== null ){
     this.folder = this.getOrCreateFolderUnderDocsFolder(parentFolderInfo, id, name)
    }
 
    this.backupFileId = null;
    this.extInfo = null;
    this.backupFolderInfo = backupFolderInfo;
  }
  getOrCreateBackupfile(backupFolderInfo){
    const formattedDate = backupFolderInfo.extInfo.formattedDate
    const filename = `${this.name}_${formattedDate}.json`
    const doc = YKLibb.Googleapi.getOrCreateGoogleDocsUnderFolder(backupFolderInfo.id, filename)
    return doc;
  }
  getOrCreateFolderUnderDocsFolder(parentFolderInfo, xid, xname){
    YKLiblog.Log.debug(`GAS-Gmail|TargetedEmail getOrCreateFolderUnderDocsFolder parentFolderInfo.id=${parentFolderInfo.id} parentFolderInfo.name=${parentFolderInfo.name}`)
    const yklibbFolderInfo = new YKLibb.FolderInfo(parentFolderInfo.name, parentFolderInfo.id)
    const folder = YKLibb.Googleapi.getOrCreateFolderUnderDocsFolder(yklibbFolderInfo, xid, xname)
    // YKLiblog.Log.debug(`GAS-Gmail|TargetedEmail getOrCreateFolderUnderDocsFolder this.folder=${this.folder}`)
    return folder
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
  asJson(){
    const assoc = {
      index: this.index,
      name: this.name,
      index_name: this.index_name,
      condition: this.condition,
      index_condition: this.index_condition,
      id: this.id,
      index_id: this.index_id,
      url: this.url,
      index_url: this.index_url,
      lastDateTime: this.lastDateTime,
      indexLastDateTime: this.indexLastDateTime,
      lastDateTime: this.lastDateTime,
      lastDate: this.lastDate,
      nth: this.nth,
      index_nth: this.index_nth,
      count: this.count,
      index_count: this.index_count,
      count2: this.count2,
      index_count2: this.index_count2,
      maxSearchesAvailable: this.maxSearchesAvailable,
      maxThreads: this.maxThreads,
      folder: this.folder,
      backupFile: this.backupFile,
      extInfo: this.extInfo
    }
    return JSON.stringify(assoc);
  }
  backup(){
    this.id = this.old_id;
    if( !this.id ){
      this.id = this.folder.getId();
    }// 
    // YKLiblog.Log.debug(`TargetedEmail.backup this.id=${this.id}`)
    this.url = this.old_url;
    if( !this.url ){
      this.url = this.folder.getUrl();
    }
    // YKLiblog.Log.debug(`TargetedEmail.backup this.url=${this.url}`)
    const text = this.asJson();
    if(this.backupFolderInfo !== null){
      this.backupFileId = this.getOrCreateBackupfile(this.backupFolderInfo).getId();
      YKLibb.Googleapi.writeToGoogleDocs(this.backupFileId, text);
    }
  }
}
