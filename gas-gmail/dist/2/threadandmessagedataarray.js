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
   * 指定された日付より新しいメッセージデータをフィルタリングして返す
   * @param {Date} new_last_date - 比較対象の日付
   * @returns {Array} フィルタリングされたMessagedataオブジェクトの配列
   */
  collectMessagesdataAfterDate(new_last_date){
    return this.messagedataArray.filter( (messagedata) => {
      YKLiblog.Log.debug(`ThreadAndMessagedataarray collectMessagesdataAfterDate typeof(messagedata)=${typeof(messagedata)} new_last_date=${new_last_date} messagedata.date=${messagedata.date}`)
      messagedata.isAfter = YKLiba.Utils.isAfterDate(new_last_date, messagedata.date)
      YKLiblog.Log.debug(`messagedata.isAfter=${messagedata.isAfter}`)
      return messagedata
    })
  }

  /**
   * 指定された日付が新しいかどうかを判定する
   * @param {Date} new_last_date - 比較対象の日付
   * @returns {boolean} 指定された日付が新しい場合はtrue、そうでない場合はfalse
   */
  determineAfterDate(new_last_date){
    YKLiba.Utils.isAfterDate(new_last_date)
  }
  /**
   * メッセージデータの配列を取得する
   * @returns {Array} Messagedataオブジェクトの配列
   */
  getMessagedataArray(){
    return this.messagedataArray
  }
  /**
   * メッセージデータの配列のサイズを取得する
   * @returns {number} メッセージデータの配列の要素数
   */
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
