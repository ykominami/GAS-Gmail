class FolderInfo {
  constructor(index, item){
    this.index = index
    this.name = item[1]
    this.index_name = 1
    this.condition = item[2]
    this.index_condition = 2
    this.id = item[3]
    this.index_id = 3
    this.url = item[4]
    this.index_url = 4
    this.last_date = item[5]
    this.index_last_date = 5
    if( !this.last_date ){
      this.last_date = new Date(1970, 0, 1).getTime();
    }
    this.nth = null
    this.index_nth = 6
    this.count = item[6]
    this.count = item[7]
    this.index_count = 7
    this.count2 = item[8]
    this.index_count2 = 8
    //
    this.maxSearchesAvailable = null
    this.maxThreads = null

    this.folder = null;
    this.old_id = this.id;
    this.old_url = this.url;

    this.old_last_date = this.last_date;
    this.old_nth = this.nth;
    this.old_count = this.coount;
    this.old_count2 = this.count2;
  }
  setMaxSearchesAvailable(value){
    this.maxSearchesAvailable = value
  }
  setMaxThreads(value){
    this.maxThreads = value
  }
  setCount(value){
    this.count = value
  }
  setCount2(value){
    this.count2 = value
  }
  getOrCreateFolderUnderDocsFolder(env){
    this.folder = YKLibb.getOrCreateFolderUnderDocsFolder(env, this.folder_id, this.name);
    Logger.log(`FolderInfo getOrCreateFolderUnderDocsFolder this.folder=${this.folder}`)
    return this.folder;
  }
  backup(){
    this.id = this.old_id;
    if( !this.id ){
      this.id = this.folder.getId();
    }
    this.url = this.old_url;
    if( !this.url ){
      this.url = this.folder.getUrl();
    }
    //if( !this.last_date !== this.old_last_date ){
    //  this.last_date = this.old_last_date;
    //}
  }
}
function xtestA(path_array){
  for(let i=0; i<path_array.length; i++){
    Logger.log(path_array[i]);   
  }
}
function xtest(){
  let path_array = "0>0-LOG>Docs".split('>');
  Logger.log(`${path_array.join('|')}`);
  xtestA( [...path_array, "A", "B"] );
  // xtestA(path_array);
  // YKLibb.getFolderByPath([ path_array, targetFolderName])
}