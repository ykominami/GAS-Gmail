class Tabledata {
  constructor(spradsheet, worksheet, header, values, dataRange){
    this.spradsheet = spradsheet; 
    this.worksheet = worksheet; 
    this.header = header;
    this.values = values;
    this.dataRange = dataRange;
    const targetedEmailList = new TargetedEmailList(this.values);
    this.parentFolderInfo = targetedEmailList.parentFolderInfo;
    this.backupFolderInfo = targetedEmailList.backupFolderInfo;
    this.targetedEmailAssoc = targetedEmailList.targetedEmailAssoc;
    YKLiblog.Log.debug(`Tabledata constructor targetedEmailList.folderConf=${targetedEmailList.folderConf}`)
    this.folderConf = targetedEmailList.folderConf;
    YKLiblog.Log.debug(`Tabledata constructor this.folderConf=${this.folderConf}`)
    this.targetedEmailList = targetedEmailList;
  }
  keys(){
    const keyArray = Object.keys(this.targetedEmailAssoc)
    return keyArray;
  }
  getTargetedEmail(key){
    return this.targetedEmailAssoc[key];
  }
  rewrite(targetedEmail){
    const item = targetedEmail
    // Log.debug(`------------------rewrite`)
    if( !item.old_id ){
      this.values[item.index][item.index_id] = item.id;
    }
    if( !item.old_url ){
      this.values[item.index][item.index_url] = item.url;
    }
    if( !item.oldLastDateTime ){
      this.values[item.index][item.indexLastDateTime] = item.lastDateTime;
      // Log.debug(`item.index=${item.index}|item.indexLastDateTime=${item.indexLastDateTime}|${this.values[item.index][item.indexLastDateTime]}`)
    }
    if( item.old_nth != item.nth){
      this.values[item.index][item.index_nth] = item.nth;
    }
    if( item.old_count != item.count){
      this.values[item.index][item.index_count] = item.count;
    }
    if( item.old_count2 != item.count2 ){
      this.values[item.index][item.index_count2] = item.count2;
    }
  }
  update(){
    // Log.debug(`Tabledata.update=${ [this.header, ...this.values] }`)
    this.dataRange.setValues( [this.header, ...this.values] );
  }
}