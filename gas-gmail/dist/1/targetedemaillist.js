class TargetedEmailList {
  constructor(spreadsheet, values){
    this.backupFolderInfo = null;
    this.parentFolderInfo = null;
    this.folderConf = null;
    this.targetedEmailAssoc = {};
    this.spreadsheet = spreadsheet

    YKLiblog.Log.debug(`TargetedEmailList constructor values=${ JSON.stringify(values) }`)
    YKLiblog.Log.debug(`TargetedEmailList constructor values.length=${values.length}`)
    for(let i=0; i<values.length; i++){
      const item = values[i]
      YKLiblog.Log.debug(`TargetedEmailList constructor i=${i} item=${item}`)
      switch(item[0]){
        case "backup_root_folder":
          YKLiblog.Log.debug("TargetedEmailList constructor backup_root_folder")
          // backupRootFolderInfoは、backup用のフォルダ群の親フォルダの情報を持つ。
          this.backupRootFolderInfo = new BackupRootFolderInfo(i, item);
          break;
        case "folder_conf":
          YKLiblog.Log.debug("TargetedEmailList constructor folder_conf")
          this.folderConf = new FolderConf(i, item);
          break;
        case "folder":
          YKLiblog.Log.debug("TargetedEmailList constructor folder")
          if(item[1]){
            const targetedEmail = new TargetedEmail(i, item, this.backupRootFolderInfo, this.folderConf, spreadsheet);

            this.targetedEmailAssoc[item[1]] = targetedEmail;
          }
          break;
        default:
          YKLiblog.Log.debug("TargetedEmailList constructor default")
          break;
      }
    }
    YKLiblog.Log.debug( `TargetedEmailList this.folderConf=${this.folderConf}` )

  }
}