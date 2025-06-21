class Tabledata {
  constructor(header, values, dataRange){
    this.header = header;
    this.values = values;
    this.dataRange = dataRange;
    this.folderInfolist = new FolderInfoList(this.values);
    this.parentFolderInfo = this.folderInfolist.parentFolderInfo;
    this.folderInfoAssoc = this.folderInfolist.folderInfoAssoc;
    this.folderConf = this.folderInfolist.folderConf;
  }
  keys(){
    const keyArray = Object.keys(this.folderInfoAssoc)
    return keyArray;
  }
  getFolderInfo(key){
    return this.folderInfoAssoc[key];
  }
  rewrite(item){
    // Logger.log(`------------------rewrite`)
    if( !item.old_id ){
      this.values[item.index][item.index_id] = item.id;
    }
    if( !item.old_url ){
      this.values[item.index][item.index_url] = item.url;
    }
    if( !item.oldLastDateTime ){
      this.values[item.index][item.indexLastDateTime] = item.lastDateTime;
      // Logger.log(`item.index=${item.index}|item.indexLastDateTime=${item.indexLastDateTime}|${this.values[item.index][item.indexLastDateTime]}`)
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
    // Logger.log(`Tabledata.update=${ [this.header, ...this.values] }`)
    this.dataRange.setValues( [this.header, ...this.values] );
  }
}