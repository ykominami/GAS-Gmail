class TargetedEmail {
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
    this.lastDateTime = new Date( item[5] ).getTime()
    this.indexLastDateTime = 5
    if( !this.lastDateTime ){
      this.lastDateTime = new Date(0).getTime();
    }
    this.lastDate = new Date( this.lastDateTime )
    // YKLiblog.Log.debug(`TargetedEmail|index=${index} name=${this.name} lastDate=${this.lastDate}`)
    this.nth = item[6]
    this.index_nth = 6
    this.count = item[7]
    this.index_count = 7
    this.count2 = item[8]
    this.index_count2 = 8
    //
    this.maxSearchesAvailable = null
    this.maxThreads = 0

    this.folder = null;
    this.old_id = this.id;
    this.old_url = this.url;

    this.oldLastDateTime = this.lastDateTime;
    this.old_nth = this.nth;
    this.old_count = this.count;
    this.old_count2 = this.count2;
  }
  overWriteLastData(other){
    this.lastDateTime = other.lastDateTime
    this.lastDate = other.lastDate
    this.oldLastDateTime = other.oldLastDateTime
  }
  setMaxSearchesAvailable(value){
    this.maxSearchesAvailable = value
  }
  setMaxThreads(value){
    this.maxThreads = value
  }
  setNth(value){
    this.nth = value
  }
  setCount(value){
    this.count = value
  }
  setCount2(value){
    this.count2 = value
  }
  getOrCreateFolderUnderDocsFolder(parentFolderInfo){
    let folderId = parentFolderInfo.getFolderId()
    YKLiblog.Log.debug(`GAS-Gmail|TargetedEmail getOrCreateFolderUnderDocsFolder folderId=${folderId} this.name=${this.name}`)
    this.folder = YKLiba.Folder.getOrCreateFolderById(folderId, this.name)
    // YKLiblog.Log.debug(`GAS-Gmail|TargetedEmail getOrCreateFolderUnderDocsFolder this.folder=${this.folder}`)
    return this.folder
  }
  backup(){
    this.id = this.old_id;
    if( !this.id ){
      this.id = this.folder.getId();
    }// 
    // YKLiblog.Log.debug(`TargetedEmail.backup this.id=${this.id}`)
    this.url = this.old_url;
    if( !this.url ){
      this.url = this.folder.getUrl();
    }
    // YKLiblog.Log.debug(`TargetedEmail.backup this.url=${this.url}`)
    const date = new Date();
    const formattedDate = Utilities.formatDate(date, "JST", "yyyyMMdd");
    const filename = `${this.name}_${formattedDate}.json`
    const path_array = ["log", "GAS-Gmail", filename]
    for(let i in path_array){
      YKLiblog.Log.debug(path_array[i]);
    }
    const path = path_array.join( YKLiba.File.separator() );
    // YKLiblog.Log.debug(`${path_array.join('|')}`);
    // const path = YKLiba.File.join(["log", "GAS-Gmail", filename])
    YKLiba.File.save(path, text)
  }
}
function xtestA(path_array){
  for(let i=0; i<path_array.length; i++){
    YKLiblog.Log.debug(path_array[i]);   
  }
}
function xtest(){
  let path_array = "0>0-LOG>Docs".split('>');
  YKLiblog.Log.debug(`${path_array.join('|')}`);
  xtestA( [...path_array, "A", "B"] );
  // xtestA(path_array);
  // YKLibb.getFolderByPath([ path_array, targetFolderName])
}
