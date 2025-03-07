class FolderInfoList {
  constructor(values){
    let item;

    this.parentFolderInfo = null;
    this.folderConf = null;
    this.folderInfoAssoc = {};

    for(let i=0; i<values.length; i++){
      item = values[i]
      switch(item[0]){
        case "parent_folder":
          this.parentFolderInfo = new FolderInfo(i, item);
          break;
        case "folder_conf":
          this.folderConf = new FolderConf(i, item);
          if( !this.folderConf ){
            this.folderConf = 1
          }
          break;
        case "folder":
          Logger.log(`i=${i} item.name=${item[1]}`);
          this.folderInfoAssoc[item[1]] = new FolderInfo(i, item);
          break;
        default:
          break;
      }
    }
  }
}