class FolderConf {
  constructor(index, item){
    this.index = index
    this.nth = parseInt(item[1])
    this.index_nth = 1
    this.maxSearchesAvailable = parseInt(item[2])
    this.index_maxSearchesAvailable = 2
    this.maxThreads = parseInt(item[3])
    this.index_maxThreads = 3
    this.maxItems = parseInt(item[4])
    this.index_maxItems = 4
  }
}