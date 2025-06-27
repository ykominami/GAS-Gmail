class Messagearray{
  constructor(){
    // ThreadAndMessagedataarrayの配列
    this.array = []
    this.msgCount = 0
    this.threadCount = 0
    this.lastDate = new Date(0)
    this.maxSearchesAvailable = 0
    this.maxThreads = 0
  }
  addValidMessagedataarray(tam){
    this.array.push(tam)
    this.msgCount += tam.messageDataArray.length
    this.threadCount += 1
    // Gmailスレッドの最後のメッセージの日付を正しく取得
    try {
      const messages = tam.thread.getMessages()
      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        const messageDate = lastMessage.getDate()
        if (messageDate && messageDate > this.lastDate) {
          this.lastDate = messageDate
        }
      }
    } catch (error) {
      console.error('Error getting message date:', error)
    }
    this.maxSearchesAvailable -= tam.messageDataArray.length 
    this.maxThreads -= 1
  }
  addInvalidMessagedataarray(tam){
    this.array.push(tam)
    this.msgCount += tam.messageDataArray.length
    this.threadCount += 1  // スレッドは1つなので1を加算
    // Gmailスレッドの最後のメッセージの日付を正しく取得
    try {
      const messages = tam.thread.getMessages()
      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1]
        const messageDate = lastMessage.getDate()
        if (messageDate && messageDate > this.lastDate) {
          this.lastDate = messageDate
        }
      }
    } catch (error) {
      console.error('Error getting message date:', error)
    }
  }
}
