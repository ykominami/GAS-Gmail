class Messagearray{
  constructor(maxSearchesAvailable = 0){
    // ThreadAndMessagedataarrayの配列
    this.array = []
    this.msgCount = 0
    this.threadCount = 0
    this.lastDate = new Date(0)
    this.maxSearchesAvailable = maxSearchesAvailable
    this.maxThreads = 0
  }
  addValidMessagedataarray(tam){
    this.array.push(tam)
    this.msgCount += tam.messagedataArray.length
    this.threadCount += 1
    this.lastDate = tam.thread.getLastMessageDate()
    this.maxSearchesAvailable -= tam.messagedataArray.length 
    this.maxThreads -= 1
    YKLiblog.Log.debug(`Messagearray Valid this.msgCount=${this.msgCount}`)
  }
  addInvalidMessagedataarray(tam){
    this.array.push(tam)
    this.msgCount += tam.messagedataArray.length
    this.threadCount += tam.thread.length
    this.lastDate = tam.thread.getLastMessageDate()    
    YKLiblog.Log.debug(`Messagearray Invalid this.msgCount=${this.msgCount}`)
  }
  debug(){
    YKLiblog.Log.debug(`Messagearray S===`)
    YKLiblog.Log.debug(`this.array.length=${this.array.length}`)
    YKLiblog.Log.debug(`this.msgCount=${this.msgCount}`)
    YKLiblog.Log.debug(`this.threadCount=${this.threadCount}`)
    YKLiblog.Log.debug(`this.lastDate=${this.lastDate}`)
    YKLiblog.Log.debug(`this.maxSearchesAvailable=${this.maxSearchesAvailable}`)
    YKLiblog.Log.debug(`this.maxThreads=${this.maxThreads}`)
    YKLiblog.Log.debug(`Messagearray E===`)
  }
}
