class Tabledata {
  constructor(header, values, dataRange){
    this.header = header;
    this.values = values;
    this.dataRange = dataRange;
    const targetedEmailList = new TargetedEmailList(this.values);
    this.parentFolderInfo = targetedEmailList.parentFolderInfo;
    this.targetedEmailAssoc = targetedEmailList.targetedEmailAssoc;
    this.folderConf = targetedEmailList.folderConf;
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
    // YKLiba.Log.debug(`------------------rewrite`)
    if( !item.old_id ){
      this.values[item.index][item.index_id] = item.id;
    }
    if( !item.old_url ){
      this.values[item.index][item.index_url] = item.url;
    }
    if( !item.oldLastDateTime ){
      this.values[item.index][item.indexLastDateTime] = item.lastDateTime;
      // YKLiba.Log.debug(`item.index=${item.index}|item.indexLastDateTime=${item.indexLastDateTime}|${this.values[item.index][item.indexLastDateTime]}`)
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
    // YKLiba.Log.debug(`Tabledata.update=${ [this.header, ...this.values] }`)
    this.dataRange.setValues( [this.header, ...this.values] );
  }
}