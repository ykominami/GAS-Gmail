class ThreadAndMessagedataarray {
  /**
   * ThreadAndMessagedataarrayクラスのコンストラクタ
   * @param {Object} thread - スレッドオブジェクト
   * @param {Array} messagedataArray - Messagedataオブジェクトの配列
   */
  constructor(thread, messagedataArray){
    this.thread = thread
    // 引数messagedataArrayはMessagedataの配列
    this.messagedataArray = messagedataArray
  }
  collectMessagesdataAfterDate(new_last_date){
    return this.messagedataArray.filter( (messagedata) => {
      YKLiblog.Log.debug(`ThreadAndMessagedataarray collectMessagesdataAfterDate typeof(messagedata)=${typeof(messagedata)} new_last_date=${new_last_date} messagedata.date=${messagedata.date}`)
      messagedata.isAfter = YKLiba.Utils.isAfterDate(new_last_date, messagedata.date)
      YKLiblog.Log.debug(`messagedata.isAfter=${messagedata.isAfter}`)
      return messagedata
    })
  }

  determineAfterDate(new_last_date){
    YKLiba.Utils.isAfterDate(new_last_date)
  }
  getMessagedataArray(){
    return this.messagedataArray
  }
  getSizeOfMessagdataArray(){
    return this.messagedataArray.length
  }
  
  /**
   * 指定されたインデックスのメッセージデータを取得する
   * @param {number} index - 取得するメッセージデータのインデックス
   * @returns {Object} 指定されたインデックスのMessagedataオブジェクト
   */
  getMessagedataByIndex(index){
    return this.messagedataArray[index]
  }
}
