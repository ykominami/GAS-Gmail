class ConfigTable {
  constructor(values, totalRange){
    YKLiblog.Log.debug(`values=${values}`)
    this.values = values
    this.totalRange = totalRange
    const totalRangeShape = YKLiba.Range.getRangeShape(totalRange)
    this.totalRangeShape = totalRangeShape

    this.backupFolderConf = null;
    this.searchConf = null;
    this.searchStatus = null;

    const targetedEmailList = new TargetedEmailList()
    YKLiblog.Log.debug(`targetedEmailList.getKeys()=${targetedEmailList.getKeys()}`)
    this.targetedEmailList = targetedEmailList;
    this.processRows(values)
    if( !this.searchStatus ){
      throw new Error("Can't make searchStatus")
    }
    if( !this.searchConf ){
      throw new Error("Can't make searchConf")
    }
  }
  getValues(){
    return this.values
  }
  getBackupRootFolderConf(){
    return this.backupRootFolderConf
  }
  processRows(values){
    for(let i=0; i<values.length; i++){
      const item = values[i];
      const rowRange = this.totalRange.offset(i,0, 1)
      YKLiblog.Log.debug(`TargetedEmailList constructor i=${i} item=${item}`)
      switch(item[0]){
        case "backup_root_folder":
          YKLiblog.Log.debug("TargetedEmailList constructor backup_root_folder")
          this.backupRootFolderConf = new BackupRootFolderConf(i, item);
          this.targetedEmailList.setBackupRootFolderConf(this.backupRootFolderConf)
          break;
        case "search_conf":
          YKLiblog.Log.debug("TargetedEmailList constructor search_conf")
          this.searchConf = new SearchConf(i, item);
          this.targetedEmailList.setSearchConf(this.searchConf)
          break;
        case "search_status":
          YKLiblog.Log.debug("TargetedEmailList constructor search_status")
          this.searchStatus = new SearchStatus(i, item, rowRange);
          this.targetedEmailList.setSearchStatus(this.searchStatus)
          break;
        case "folder":
          YKLiblog.Log.debug("TargetedEmailList constructor folder")
          this.targetedEmailList.addTargetedEmail(i, item, rowRange)
          break;
        defualt:
          YKLiblog.Log.debug("TargetedEmailList constructor default")
          break;
      }
    }
  }
  getSearchConf(){
    return this.searchConf
  }
  getSearchStatus(){
    return this.searchStatus
  }
  getTargetedEmailList(){
    return this.targetedEmailList
  }
  getBackupFolderConf(){
    return this.backupFolderConf
  }
  getFolderConf(){
    return this.folderConf
  }

  getKkeys(){
    return this.targetedEmailList.getKeys()
  }
  getTargetedEmail(key){
    return this.targetedEmailList.getTargetedEmailByKey(key);
  }
}
