class BackupRootFolderInfo {
  static INDEX_PATH(){
    return 1;
  }
  static INDEX_ID(){
    return 3;
  }
  static INDEX_URL(){
    return 4;
  }

  constructor(index, item) {
    this.index = index;
    const index_path = BackupRootFolderInfo.INDEX_PATH() 
    this.path = item[index_path];
    const index_id = BackupRootFolderInfo.INDEX_ID()
    const folderId = item[index_id];
    this.folderId = folderId;
    YKLiblog.Log.debug(`index_id=${index_id} folderId=${folderId}`)
    const index_url = BackupRootFolderInfo.INDEX_URL()
    this.url = item[index_url];
    this.folder = null;

    YKLiblog.Log.debug(`BackupFolder constructor index=${index} this.path=${this.path} this.folderId=${this.folderId}`);

    if (this.folderId) {
      YKLiblog.Log.debug(`this.folderId=${this.folderId}`);
      try {
        this.folder = DriveApp.getFolderById(this.folderId);
      } catch (e) {
        YKLiblog.Log.unknown(e);
        this.folderId = null;
      }
    }
    if (!this.folderId) {
      this.folder = YKLibb.Gapps.getOrCreateFolderByPathString(this.path);
      if (this.folder !== null) {
        this.folderId = this.folder.getId();
      }
    }
  }

  getPath() {
    return this.path;
  }
  getFolderId() {
    return this.folderId;
  }
  getFolder() {
    return this.folder;
  }
  getUrl() {
    return this.url;
  }
  getFormattedDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }
}
