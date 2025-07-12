class SearchConf {
  constructor(rowIndex, item){
    this.rowIndex = rowIndex

    this.index_maxSearchesAvailable = 1
    this.maxSearchesAvailable = parseInt(item[ this.index_maxSearchesAvailable ], 10)
    if( isNaN(this.maxSearchesAvailable) ){
      this.maxThreads = 10
    }

    this.index_maxThreads = 2
    this.maxThreads = parseInt(item[ this.index_maxThreads ], 10)
    YKLiblog.Log.debug(`FolderConf item[3]=${item[3]}`)
    if( isNaN(this.maxThreads) ){
      this.maxThreads = 10
    }

    this.index_maxItems = 3
    this.maxItems = parseInt(item[ this.index_maxItems ], 10)
    if( isNaN(this.maxItems) ){
      this.maxItems = 10
    }
  }
  isBiggerThanMaxItems(value){
    return (this.maxItemx < value)
  }
  getMaxSearchesAvailable(){
    return this.maxSearchesAvailable
  }
  getMaxThreads(){
    return this.maxThreads
  }
  getMaxItems(){
    return this.maxItems
  }
}