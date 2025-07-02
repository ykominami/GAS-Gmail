class BackupRootFolderInfo {
  constructor(index, item){
    YKLiblog.Log.debug(`BackupFolder constructor index=${index} this.path=${this.path} this.folderId=${this.folderId}`)
    this.index = index
    this.path = item[1]
    this.index_path = 1
    this.folderId = item[3]
    this.index_id = 3
    this.url = item[4]
    this.index_url = 4

    this.folder = YKLibb.Googleapi.getOrCreateFolderByPath(this.folderId, this.path)

    const date = new Date();
    const formattedDate = Utilities.formatDate(date, "JST", "yyyyMMdd");
    this.formattedDate = formattedDate

  }
  getPath(){
    return this.path
  }
  getFolderId(){
    return this.folderId;
  }
  getFolder(){
    return this.folder;
  }
  getUrl(){
    return this.url;
  }
  geFormattedDate(){
    return this.formattedDate;
  }

}