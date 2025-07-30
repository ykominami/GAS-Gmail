/**
 * Gmailメッセージの登録管理を行うクラス
 * スプレッドシートにメールデータを記録し、重複チェックやID管理を行う
 */
class RegisteredEmail {
  /**
   * RegisteredEmailクラスのコンストラクタ
   * @param {Object} targetedEmail - 対象メールアドレス情報
   * @param {Spreadsheet} spreadsheet - 対象スプレッドシート
   * @param {string} sheetName - ワークシート名
   * @param {Object} config - 設定情報
   * @param {Object} tableDef - テーブル定義
   * @param {Object} yklibbConfig - YKLibb設定
   * @param {boolean} clearFlag - クリアフラグ（デフォルト: false）
   */
  constructor(targetedEmail, spreadsheet, sheetName, config, tableDef, yklibbConfig, ultimate, clearFlag = false){
    YKLiblog.Log.debug(`RegisteredEmail constructor sheetName=${sheetName}`)
    if( typeof(ultimate) !== "boolean" ){
      throw new Error(`${ typeof(ultimate) } ultimate is not boolean`)
    }

    this.spreadsheet = spreadsheet
    this.sheetName = sheetName
    this.worksheet = null
    this.config = config
    this.tableDef = tableDef
    this.yklibbConfig = yklibbConfig
    this.table = new FixedHeaderTable(spreadsheet, sheetName, config, tableDef, ultimate)

    this.clearFlag = clearFlag

    if(this.clearFlag){
      this.table.clearTotalRange()
    }

    this.targetedEmail = targetedEmail
    this.sheetUrl = this.table.getSheetUrl()
    this.targetedEmail.setWorksheetUrl(this.sheetUrl)

    this.ids = []
    this.idSet = new Set()

    // ヘッダーが存在しなければ、headerとheaderRangeはnull
    // const ultimate = true
    // const [header, totalValues, headerRange, dataRowsRange, totalRange] = this.table.getRangeForHeaderAndData(this.worksheet, this.yklibbConfig, ultimate)

    this.table.adjustTable()

    const idSet = this.getIdSet()
    const ids = this.getIds()
    const idsSize = this.getIdsSize()
    const lastId = this.getLastId()
  }
  
  getSheetUrl(){
    return this.sheetUrl
  }


  /**
   * IDセットに追加のIDを追加する
   * @param {Array} additional - 追加するIDの配列
   */
  addToIdSet(additional){
    const additionalSize = additional.length
    let idSet = this.idSet
    let ids
    if( idSet.size > 0 ){
      if( additionalSize > 0 ){
        idSet = new Set([...idSet, ...additional])
      }
    }
    else{
      if( additionalSize > 0 ){
        idSet = new Set([...additional])
      }
    }
    this.idSet = idSet
    if( idSet.size > 0 ){
      ids = [...idSet]
    }
    else{
      ids = []
    }
    this.ids = ids
  }
  
  /**
   * スプレッドシートの全範囲をクリアする
   */
  clear(){
    this.totalRange.clear()
  }
  
  /**
   * IDセットを取得する
   * @return {Set} IDのセット
   */
  getIdSet(){
    return this.idSet
  }
  
  /**
   * IDの配列を取得する
   * @return {Array} IDの配列
   */
  getIds(){
    return this.ids
  }
  /**
   * IDが存在するか判定する
   * @return {number} IDの数
   */
  hasId(value){
    return this.idSet.has(value)
  }
  /**
   * IDの数を取得する
   * @return {number} IDの数
   */
  getIdsSize(){
    return this.ids.length
  }
  
  /**
   * 最後のIDを取得する
   * @return {*} 最後のID
   */
  getLastId(){
    let value = null
    const ret = this.ids[ this.ids.length - 1]
    if( typeof(ret) !== "undefined" ){
      value = ret
    }
    return value
  }
  
  /**
   * メッセージデータを登録する
   * @param {Object} within - MessageArrayクラスのインスタンス
   * @param {string} op - 操作タイプ（REWRITE または addUnderRow）
   * @param {number} limit - 文字列の制限
   * @param {Date} lastDate - 前回処理した日時
   * @return {Array} [メッセージデータリスト]
   */
  registerData(within, op, limit, lastDate){
    // YKLiblog.Log.debug(`RegisteredEmail registerData `)
    // 引数withinは、クラスMessageArrayのインスタンス
    // 引数lastDateより、後ろの日時を持つメッセージを処理対象とする
    // within.arrayはクラスThreadAndMessagedataarrayのインスタンスの配列
    if( (typeof(within.array) === "undefined") ){
      throw Error(`registerData`)
    }
    YKLiblog.Log.debug(`0 RegisteredEmail registerData`)

    // 前回処理した日時(lastDate以降)のメッセージを取り出す
    const nestedArray =  within.array.map( threadAndMessagedataarray => {
      threadAndMessagedataarray.collectMessagesdataAfterDate( lastDate )
      return threadAndMessagedataarray
    } 
      )

    const filteredMessagearrayList = nestedArray.flat()
    // 未記録メッセージのみを取り出す
    const unrecordedList = filteredMessagearrayList.filter( item => {
        return !item.recorded 
      }
    )
    if(unrecordedList.length === 0){
      YKLiblog.Log.debug(`1 RegisteredEmail registerData`)
      return null
    }
    // 未記録メッセージに対し切り詰め処理を行う
    const messageDataList = unrecordedList.map(  threadAndMessagedataarray => {
      const messagedataArray = threadAndMessagedataarray.messagedataArray.map( messagedata => {
        messagedata.truncateString(limit)
        return messagedata
     } )
      return messagedataArray
    } )
    
    // 未記録メッセージを、1メッセージを表す配列の配列として取り出す（ワークシートに記録するのに適した形式に変換）
    const dataArray0 = messageDataList.map( array => {
      return array.map( messageData => {
        return messageData.getDataAsArray() 
      }
      )
    } )
    const dataArray = dataArray0.flat(1)
    YKLiblog.Log.debug(`4 RegisteredEmail registerData dataArray.length=${dataArray.length}`)
    this.table.registerDataArray( dataArray, op )
    //記録したので、以降では記録済みメッセージのIDとして扱う。
    this.addToIdSet( dataArray )
    YKLiblog.Log.debug(`2 RegisteredEmail registerData`)
    return messageDataList
  }
}

