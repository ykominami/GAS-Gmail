class Messagearray{
  /**
   * Messagearrayクラスのコンストラクタ
   * メッセージとスレッドの配列を管理するための初期化を行う
   * @param {number} maxSearchesAvailable - 利用可能な最大検索数（デフォルト: 0）
   */
  constructor(maxSearchesAvailable = 0){
    // ThreadAndMessagedataarrayの配列
    this.array = []
    this.msgCount = 0
    this.threadCount = 0
    this.lastDate = new Date(0)
    this.maxSearchesAvailable = maxSearchesAvailable
    this.maxThreads = 0
  }
  
  /**
   * 有効なメッセージデータ配列を追加する
   * スレッドとメッセージの情報を配列に追加し、カウンターを更新する
   * @param {Object} tam - ThreadAndMessagedataarrayオブジェクト
   */
  addValidMessagedataarray(tam){
    this.array.push(tam)
    this.msgCount += tam.messagedataArray.length
    this.threadCount += 1
    this.lastDate = tam.thread.getLastMessageDate()
    this.maxSearchesAvailable -= tam.messagedataArray.length 
    this.maxThreads -= 1
    YKLiblog.Log.debug(`Messagearray Valid this.msgCount=${this.msgCount}`)
  }
  
  /**
   * 無効なメッセージデータ配列を追加する
   * スレッドとメッセージの情報を配列に追加し、カウンターを更新する（検索制限は減算しない）
   * @param {Object} tam - ThreadAndMessagedataarrayオブジェクト
   */
  addInvalidMessagedataarray(tam){
    this.array.push(tam)
    this.msgCount += tam.messagedataArray.length
    this.threadCount += tam.thread.length
    this.lastDate = tam.thread.getLastMessageDate()    
    YKLiblog.Log.debug(`Messagearray Invalid this.msgCount=${this.msgCount}`)
  }
  
  /**
   * メッセージ数を取得する
   * @returns {number} 現在のメッセージ総数
   */
  getMsgCount(){
    return this.msgCount
  }
  
  /**
   * 指定されたインデックスのThreadAndMessagedataarrayを取得する
   * @param {number} index - 取得したい配列のインデックス
   * @returns {Object|null} ThreadAndMessagedataarrayオブジェクト、インデックスが範囲外の場合はnull
   */
  getThreadAndMessagedataarrayByIndex(index){
    if( this.array.length > index ){
      const tamda = this.array[index]
      return tamda
    }
    else{
      return null
    }
  }
}
