class Tabledata {
  constructor(header, values, dataRange){
    this.header = header;
    this.values = values;
    this.dataRange = dataRange;
    this.folderInfolist = new FolderInfoList(this.values);
    this.parentFolderInfo = this.folderInfolist.parentFolderInfo;
    this.folderInfoAssoc = this.folderInfolist.folderInfoAssoc;
  }
  keys(){
    return Object.keys(this.folderInfoAssoc);
  }
  getInfo(key){
    return this.folderInfoAssoc[key];
  }
  rewrite(item){
    if( !item.old_id ){
      this.values[item.index][item.index_id] = item.id;
    }
    if( !item.old_url ){
      this.values[item.index][item.index_url] = item.url;
    }
    if( !item.old_last_date ){
      this.values[item.index][item.index_last_date] = item.last_date;
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
    // Logger.log(`Tabledata.update`)
    this.dataRange.setValues( [this.header, ...this.values]);
  }
}