class Messagearray{
  /**
   * Messagearrayクラスのコンストラクタ
   * メッセージデータの配列を管理するための初期化を行う
   * @param {number} maxSearchesAvailable - 利用可能な最大検索数（デフォルト: 0）
   */
  constructor(){
    // Messagedataの配列
    this.array = []
    this.msgCount = 0
    this.threadCount = 0
    this.lastDate = new Date(0)
    this.queryInfo = null
  }

  setQueryInfo(queryInfo){
    this.queryInfo = queryInfo
  }

  add(md){
    this.array.push(md)
    this.msgCount += 1
    if( YKLiba.Utils.isAfterDate( this.lastDate, md.lastDate ) ){
      this.lastDate = md.lastDate
    }
    this.maxSearchesAvailable -= 1 
  }

  /**
   * 有効なメッセージデータ配列を追加する
   * スレッドとメッセージの情報を配列に追加し、カウンターを更新する
   * @param {Object} md - Messagedataオブジェクト
   */
  addValidMessagedata(md){
    this.array.push(md)
    this.msgCount += 1
    // this.threadCount += 1
    if( YKLiba.Utils.isAfterDate( this.lastDate, tam.lastDate ) ){
      this.lastDate = tam.lastDate
    }
    this.maxSearchesAvailable -= tamSize 
    this.maxThreads -= 1
    YKLiblog.Log.debug(`Messagearray Valid this.msgCount=${this.msgCount} this.threadCount=${this.threadCount}`)
  }
  
  /**
   * 無効なメッセージデータ配列を追加する
   * スレッドとメッセージの情報を配列に追加し、カウンターを更新する（検索制限は減算しない）
   * @param {Object} tam - ThreadAndMessagedataarrayオブジェクト
   */
  addInvalidMessagedataarray(tam){
    this.array.push(tam)
    let messagedataArrayLength = parseInt(tam.messagedataArray.length, 10)
    if( isNaN(messagedataArrayLength) ){
      messagedataArrayLength = 0
    }

    this.msgCount += messagedataArrayLength
    let threadLength = parseInt(tam.thread.length, 10)
    if( isNaN(threadLength) ){
      threadLength = 0
    }

    // this.threadCount += threadLength
    this.lastDate = tam.thread.getLastMessageDate()    
    YKLiblog.Log.debug(`Messagearray Invalid this.msgCount=${this.msgCount} this.threadCount=${this.threadCount} threadLength=${threadLength}`)
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
