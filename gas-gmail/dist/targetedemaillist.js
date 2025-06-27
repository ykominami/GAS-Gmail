class TargetedEmailList {
  constructor(values){
    let item;
    let backupFolderInfo = null;
    let parentFolderInfo = null;
    let folderConf = null;

    this.backupFolderInfo = null;
    this.parentFolderInfo = null;
    this.folderConf = null;
    this.targetedEmailAssoc = {};

    YKLiblog.Log.debug(`TargetedEmailList constructor values=${ JSON.stringify(values) }`)
    YKLiblog.Log.debug(`TargetedEmailList constructor values.length=${values.length}`)
    for(let i=0; i<values.length; i++){
      item = values[i]
      YKLiblog.Log.debug(`TargetedEmailList constructor i=${i} item=${item}`)
      switch(item[0]){
        case "parent_folder":
        YKLiblog.Log.debug("TargetedEmailList constructor parent_folder")
          parentFolderInfo = new TargetedEmail(i, item, null, null);
          this.parentFolderInfo = parentFolderInfo;
          break;
        case "backup_folder":
          YKLiblog.Log.debug("TargetedEmailList constructor backup_folder")
          backupFolderInfo = new TargetedEmail(i, item, null, null);
          this.backupFolderInfo = backupFolderInfo;
          const date = new Date();
          const formattedDate = Utilities.formatDate(date, "JST", "yyyyMMdd");

          backupFolderInfo.extInfo = { formattedDate: formattedDate }
          break;
        case "folder_conf":
          YKLiblog.Log.debug("TargetedEmailList constructor folder_conf")
          folderConf = new FolderConf(i, item);
          this.folderConf = folderConf;
          break;
        case "folder":
          YKLiblog.Log.debug("TargetedEmailList constructor folder")
          // YKLiblog.Log.debug(`i=${i} item.name=${item[1]}`);
          if(item[1]){
            // YKLiblog.Log.debug(`TargetedEmailList i=${i} item[1]=${item[1]}`)
            let targetedEmail = new TargetedEmail(i, item, parentFolderInfo, backupFolderInfo);

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