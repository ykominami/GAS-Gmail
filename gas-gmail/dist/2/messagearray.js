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
  addValidMessagedataarray(threadAndMessagedataarray){
    // threadAndMessagedataarrayとそのプロパティの存在チェック
    if (!threadAndMessagedataarray) {
      this.logDebug("Messagearray addValidMessagedataarray: threadAndMessagedataarray is null or undefined");
      return;
    }
    
    // messagedataArrayの存在チェック
    if (!threadAndMessagedataarray.messagedataArray || !Array.isArray(threadAndMessagedataarray.messagedataArray)) {
      this.logDebug("Messagearray addValidMessagedataarray: messagedataArray is not available or not an array");
      return;
    }
    
    // threadの存在チェック
    if (!threadAndMessagedataarray.thread) {
      this.logDebug("Messagearray addValidMessagedataarray: thread is not available");
      return;
    }
    
    // this.array.push()の存在チェック
    if (!this.array || typeof this.array.push !== 'function') {
      this.logDebug("Messagearray addValidMessagedataarray: this.array.push is not available");
      return;
    }
    
    this.array.push(threadAndMessagedataarray)
    this.msgCount += threadAndMessagedataarray.messagedataArray.length
    this.threadCount += 1
    
    // thread.getLastMessageDate()の存在チェック
    if (threadAndMessagedataarray.thread && typeof threadAndMessagedataarray.thread.getLastMessageDate === 'function') {
      try {
        const lastMessageDate = threadAndMessagedataarray.thread.getLastMessageDate()
        if (lastMessageDate && lastMessageDate instanceof Date) {
          this.lastDate = lastMessageDate
        } else {
          this.logDebug("Messagearray addValidMessagedataarray: getLastMessageDate returned invalid date");
        }
      } catch (error) {
        this.logDebug(`Messagearray addValidMessagedataarray: getLastMessageDate error - ${error.message}`);
      }
    } else {
      this.logDebug("Messagearray addValidMessagedataarray: thread.getLastMessageDate is not available");
    }
    
    this.maxSearchesAvailable -= threadAndMessagedataarray.messagedataArray.length 
    this.maxThreads -= 1
    this.logDebug(`Messagearray Valid this.msgCount=${this.msgCount}`)
  }
  addInvalidMessagedataarray(threadAndMessagedataarray){
    // threadAndMessagedataarrayとそのプロパティの存在チェック
    if (!threadAndMessagedataarray) {
      this.logDebug("Messagearray addInvalidMessagedataarray: threadAndMessagedataarray is null or undefined");
      return;
    }
    
    // messagedataArrayの存在チェック
    if (!threadAndMessagedataarray.messagedataArray || !Array.isArray(threadAndMessagedataarray.messagedataArray)) {
      this.logDebug("Messagearray addInvalidMessagedataarray: messagedataArray is not available or not an array");
      return;
    }
    
    // threadの存在チェック
    if (!threadAndMessagedataarray.thread) {
      this.logDebug("Messagearray addInvalidMessagedataarray: thread is not available");
      return;
    }
    
    // this.array.push()の存在チェック
    if (!this.array || typeof this.array.push !== 'function') {
      this.logDebug("Messagearray addInvalidMessagedataarray: this.array.push is not available");
      return;
    }
    
    this.array.push(threadAndMessagedataarray)
    this.msgCount += threadAndMessagedataarray.messagedataArray.length
    this.threadCount += 1  // thread.lengthではなく1を加算（スレッドは1つずつ追加）
    
    // thread.getLastMessageDate()の存在チェック
    if (threadAndMessagedataarray.thread && typeof threadAndMessagedataarray.thread.getLastMessageDate === 'function') {
      try {
        const lastMessageDate = threadAndMessagedataarray.thread.getLastMessageDate()
        if (lastMessageDate && lastMessageDate instanceof Date) {
          this.lastDate = lastMessageDate
        } else {
          this.logDebug("Messagearray addInvalidMessagedataarray: getLastMessageDate returned invalid date");
        }
      } catch (error) {
        this.logDebug(`Messagearray addInvalidMessagedataarray: getLastMessageDate error - ${error.message}`);
      }
    } else {
      this.logDebug("Messagearray addInvalidMessagedataarray: thread.getLastMessageDate is not available");
    }
    
    this.logDebug(`Messagearray Invalid this.msgCount=${this.msgCount}`)
  }
  debug(){
    this.logDebug(`Messagearray S===`)
    this.logDebug(`this.array.length=${this.array.length}`)
    this.logDebug(`this.msgCount=${this.msgCount}`)
    this.logDebug(`this.threadCount=${this.threadCount}`)
    this.logDebug(`this.lastDate=${this.lastDate}`)
    this.logDebug(`this.maxSearchesAvailable=${this.maxSearchesAvailable}`)
    this.logDebug(`this.maxThreads=${this.maxThreads}`)
    this.logDebug(`Messagearray E===`)
  }
  
  /**
   * 安全なログ出力メソッド
   * @param {string} message ログメッセージ
   */
  logDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[Messagearray] ${message}`);
      }
    } catch (error) {
      console.log(`[Messagearray] Log error: ${error.message}`);
    }
  }
}
