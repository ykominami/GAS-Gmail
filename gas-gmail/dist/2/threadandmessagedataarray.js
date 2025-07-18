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
  
  /**
   * 指定された日付以降のメッセージデータをフィルタリングして返す
   * @param {Date} new_last_date - 基準となる日付
   * @returns {Array} 指定された日付以降のMessagedataオブジェクトの配列
   */
  collectMessagesdataAfterDate(new_last_date){
    return this.messagedataArray.filter( (messagedata) => {
      YKLiblog.Log.debug(`ThreadAndMessagedataarray collectMessagesdataAfterDate ThreadAndMessagedataarray typeof(messagedata)=${typeof(messagedata)} new_last_date=${new_last_date} messagedata.msg.getDate()=${messagedata.msg.getDate()}`)
      messagedata.isAfter = YKLiba.Utils.isAfterDate(new_last_date, messagedata.msg.getDate())
      YKLiblog.Log.debug(`messagedata.isAfter=${messagedata.isAfter}`)
      return messagedata
    }
    )
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
