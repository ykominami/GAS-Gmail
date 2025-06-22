class TargetedEmailList {
  constructor(values){
    let item;

    this.parentFolderInfo = null;
    this.folderConf = null;
    this.targetedEmailAssoc = {};

    for(let i=0; i<values.length; i++){
      item = values[i]
      switch(item[0]){
        case "parent_folder":
          this.parentFolderInfo = new TargetedEmail(i, item);
          break;
        case "folder_conf":
          this.folderConf = new FolderConf(i, item);
          if( !this.folderConf ){
            this.folderConf = 1
          }
          break;
        case "folder":
          // YKLiblog.Log.debug(`i=${i} item.name=${item[1]}`);
          if(item[1]){
            // YKLiblog.Log.debug(`TargetedEmailList i=${i} item[1]=${item[1]}`)
            let targetedEmail = new TargetedEmail(i, item);
            this.targetedEmailAssoc[item[1]] = targetedEmail;
          }
          break;
        default:
          break;
      }
    }
    // YKLiblog.Log.debug( `keys=${ Object.keys(this.targetedEmailAssoc) }` )
  }
}