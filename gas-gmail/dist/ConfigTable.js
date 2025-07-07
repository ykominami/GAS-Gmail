class ConfigTable {
  constructor(values, totalRange){
    YKLiblog.Log.debug(`values=${values}`)
    this.values = values
    this.totalRange = totalRange
    const totalRangeShape = YKLiba.Range.getRangeShape(totalRange)
    this.totalRangeShape = totalRangeShape

    this.backupFolderInfo = null;
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
  getBackupRootFolderInfo(){
    return this.backupRootFolderInfo
  }
  processRows(values){
    for(let i=0; i<values.length; i++){
      const item = values[i];
      YKLiblog.Log.debug(`TargetedEmailList constructor i=${i} item=${item}`)
      switch(item[0]){
        case "backup_root_folder":
          YKLiblog.Log.debug("TargetedEmailList constructor backup_root_folder")
          this.backupRootFolderInfo = new BackupRootFolderInfo(i, item);
          this.targetedEmailList.setBackupRootFolderInfo(this.backupRootFolderInfo)
          break;
        case "search_conf":
          YKLiblog.Log.debug("TargetedEmailList constructor search_conf")
          this.searchConf = new SearchConf(i, item);
          this.targetedEmailList.setSearchConf(this.searchConf)
          break;
        case "search_status":
          YKLiblog.Log.debug("TargetedEmailList constructor search_status")
          this.searchStatus = new SearchStatus(i, item);
          this.targetedEmailList.setSearchStatus(this.searchStatus)
          break;
        case "folder":
          YKLiblog.Log.debug("TargetedEmailList constructor folder")
          this.targetedEmailList.addTargetedEmail(i, item)
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
  getBackupFolderInfo(){
    return this.backupFolderInfo
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
  rewriteSearchStatus(item){
    this.values[item.rowIndex][item.index_nth] = item.nth;
  }
  rewrite(item){
    // YKLiblog.Log.debug(`------------------rewrite`)
    YKLiblog.Log.debug(`rewrite item.index=${item.index}`)
    YKLiblog.Log.debug(`rewrite item.name=${item.name}`)
    YKLiblog.Log.debug(`rewrite this.values.length=${ this.values.length }`)
    YKLiblog.Log.debug(`rewrite this.values[${item.index}]=${ JSON.stringify( this.values[item.index] ) }`)
    this.values[item.index][item.index_name] = item.name;
    this.values[item.index][item.index_backupFolderId] = item.backupFolderId;

    this.values[item.index][item.index_backupFolderId] = item.backupFolderId;
    this.values[item.index][item.index_backupFolderUrl] = item.backupFolderUrl;
    this.values[item.index][item.index_lastDate] = item.lastDate;
    this.values[item.index][item.index_lastDateStr] = item.lastDateStr;
    this.values[item.index][item.index_lastDateTime] = item.lastDateTime;
    const lastDateStr = YKLibb.Util.dateTimeToString(item.lastDate);
    this.values[item.index][item.index_lastDateStr] = lastDateStr;

    Logger.log(`item.index=${item.index} item.index_lastDateStr=${item.index_lastDateStr} this.values[${item.index}][${item.index_lastDateStr}]=${this.values[item.index][item.index_lastDateStr]}`)
    this.values[item.index][item.index_nth] = item.nth;
    this.values[item.index][item.index_count] = item.count;
    this.values[item.index][item.index_count2] = item.count2;
    const width = this.totalRange.getWidth()
    const range = this.totalRange.offset(item.index, 0, 1, width)
    const array = this.values[item.index]
    Logger.log(`array=${JSON.stringify(array)}`)
    // this.update( array, range )
  }
  update(array, range = null){
    // YKLiblog.Log.debug(`Tabledata.update=${ [this.header, ...this.values] }`)
    // const array = [this.header, ...this.values]
    // const array = this.values
    YKLiblog.Log.debug(`Tabledata update array=${ JSON.stringify(array) }`)
    if( range === null ){
      const totalRangeShape = YKLiba.Range.getRangeShape(this.totalRange)
      YKLiblog.Log.debug(`Tabledata update totalRangeShape=${ JSON.stringify(totalRangeShape) }`)
      YKLiblog.Log.debug(`Tabledata update this.totalRangeShape=${ JSON.stringify(this.totalRangeShape) }`)
      this.totalRange.setValues( this.values );
    }
    else{
      range.setValues(array)
    }
  }
}
