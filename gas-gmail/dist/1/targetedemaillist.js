class TargetedEmailList {
  constructor(spreadsheet, values, config){
    this.config = config;
    this.backupRootFolderInfo = null;
    this.folderConf = null;
    this.keySet = new Set();
    this.targetedEmailByKey = {};
    this.spreadsheet = spreadsheet;

    YKLiblog.Log.debug(`TargetedEmailList constructor values=${ JSON.stringify(values) }`)
    YKLiblog.Log.debug(`TargetedEmailList constructor values.length=${values.length}`)
    for(let i=0; i<values.length; i++){
      const item = values[i];
      YKLiblog.Log.debug(`TargetedEmailList constructor i=${i} item=${item}`)
      switch(item[0]){
        case "backup_root_folder":
          YKLiblog.Log.debug("TargetedEmailList constructor backup_root_folder")
          this.backupRootFolderInfo = new BackupRootFolderInfo(i, item);
          break;
        case "folder_conf":
          YKLiblog.Log.debug("TargetedEmailList constructor folder_conf")
          this.folderConf = new FolderConf(i, item);
          break;
        case "folder":
          YKLiblog.Log.debug("TargetedEmailList constructor folder")
          const key = item[1];
          if(key && !this.keySet.has(key)){
            if (!this.backupRootFolderInfo) {
              YKLiblog.Log.warn("TargetedEmailList: backupRootFolderInfo is null when creating TargetedEmail");
            }
            if (!this.folderConf) {
              YKLiblog.Log.warn("TargetedEmailList: folderConf is null when creating TargetedEmail");
            }
            const targetedEmail = new TargetedEmail(i, item, this.backupRootFolderInfo, this.folderConf, spreadsheet, config);
            this.targetedEmailByKey[key] = targetedEmail;
            this.keySet.add(key);
          }
          break;
        default:
          YKLiblog.Log.debug("TargetedEmailList constructor default")
          break;
      }
    }
    YKLiblog.Log.debug( `TargetedEmailList this.folderConf=${this.folderConf}` )
  }
  getKeys(){
    return Object.keys(this.targetedEmailByKey);
  }
  getTargetedEmailByKey(key){
    return this.targetedEmailByKey[key];
  }
}