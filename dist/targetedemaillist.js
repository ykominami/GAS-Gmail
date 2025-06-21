class TargetedEmailList {
  constructor(values){
    let item;

    this.parentFolderInfo = null;
    this.folderConf = null;
    this.TargetedEmailAssoc = {};

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
          Logger.log(`i=${i} item.name=${item[1]}`);
          this.TargetedEmailAssoc[item[1]] = new TargetedEmail(i, item);
          break;
        default:
          break;
      }
    }
    Logger.log( Object.keys(this.TargetedEmailAssoc) )
  }
}