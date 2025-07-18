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
  constructor(targetedEmail, spreadsheet, sheetName, config, tableDef, yklibbConfig, clearFlag = false){
    YKLiblog.Log.debug(`RegisteredEmail constructor sheetName=${sheetName}`)
    this.config = config
    this.clearFlag = clearFlag
    this.tableDef = tableDef
    this.yklibbConfig = yklibbConfig

    this.targetedEmail = targetedEmail
    this.spreadsheet = spreadsheet
    const spreadsheetUrl = spreadsheet.getUrl();

    this.sheetName = sheetName
    const worksheet = YKLibb.Gssx.getOrCreateWorksheet(spreadsheet,sheetName);
    this.worksheet = worksheet

    const sheetId = worksheet.getSheetId();
    const sheetUrl = `${spreadsheetUrl}#gid=${sheetId}`;
    this.sheetUrl = sheetUrl

    this.targetedEmail.setWorksheetUrl(this.sheetUrl)

    this.indexOfHeaderId = tableDef.getIndexOfId()
    this.ids = []
    this.idSet = new Set()

    // ヘッダーが存在しなければ、headerとheaderRangeはnull
    this.getRangeForHeaderAndData(this.worksheet, this.yklibbConfig)
    if(this.clearFlag){
      this.totalRange.clear()
    }

    this.adjustTable()

    const idSet = this.getIdSet()
    const ids = this.getIds()
    const idsSize = this.getIdsSize()
    const lastId = this.getLastId()
    YKLiblog.Log.debug(`RegisteredEmail constructor this.totalValues.length=${this.totalValues.length} ids=${ids} idsSize=${idsSize} lastId=${lastId}`)
  }
  
  /**
   * テーブル構造を調整する
   * ヘッダーの存在確認、データ行の調整、範囲の更新を行う
   */
  adjustTable(){
    let dataRowsRange
    if( this.headerRange === null ){
      // this.totalRange.clear()
      if( this.dataRowsRange !== null ){
        // this.adjustRowsAndAddHeader()
        this.adjustRows()
        this.dataRowsRange = this.dataRowsRange.offset(1,0)
        this.dataRowsRange.setValues( this.dataRowsValues )

        // ワークシートのheaderを更新
        this.addHeader(this.worksheet)
        this.totalRange = this.headerRange.offset(0, 0, 1 + this.dataRowsRange.getHeight() )
      }
      else{
        // ワークシートのheaderを更新
        this.addHeader(this.worksheet)

        dataRowsRange = this.headerRange.offset(1,0)
        this.dataRowsRange = dataRowsRange
        this.dataRowsValues = this.dataRowsRange.getValues()
        this.totalRange = this.headerRange.offset(0,0, 2, this.headerRange.getWidth() )
      }      
      const totalValues = this.totalRange.getValues()
      this.totalValues = totalValues
    }
    else{
      // headerが存在する場合
      if( this.dataRowsRange !== null ){
        this.adjustRows()
        this.totalRange = this.totalRange.offset(0, 0, 1 + this.dataRowsRange.getHeight() )
        this.totalValues = this.totalRange.getValues()
      }
    }
  }

  /**
   * データ行を調整する
   * 重複チェック、行の削除・追加、ワークシートの更新を行う
   */
  adjustRows(){
    const reformRequire = this.adjustCol1()
    if( reformRequire ){
      const [idSet, selectedRows] = this.distinctValues(this.dataRowsValues)
      const range = this.dataRowsRange.offset(0, 0, selectedRows.length)
      range.setValues(selectedRows)
      this.dataRowsRange = range
      this.dataRowsValues = selectedRows
    }
    else{
      const dataRowsRange = this.dataRowsRange.offset(1, 0)
      // ワークシートのdataRowsを更新
      const dataRowsValues = this.dataRowsValues
      dataRowsRange.setValues( dataRowsValues )
      this.dataRowsRange = dataRowsRange
    }
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
   * ヘッダーとデータの範囲を取得・設定する
   * @param {Worksheet} worksheet - 対象ワークシート
   * @param {Object} yklibbConfig - YKLibb設定
   * @return {Array} 全データの値
   */
  getRangeForHeaderAndData(worksheet, yklibbConfig){
    let dataRowsValues = []
    const [header, totalValues, headerRange, dataRowsRange, totalRange] = YKLibb.Gssx.setupSpreadsheetAndHeaderAndData(this.worksheet, this.yklibbConfig)
    this.header = header
    if( !totalValues ){
      this.totalValues = []
    }
    else{
      this.totalValues = totalValues
    }
    this.headerRange = headerRange
    this.dataRowsRange = dataRowsRange
    if( dataRowsRange !== null ){
      dataRowsValues = dataRowsRange.getValues()
    }
    this.dataRowsValues = dataRowsValues
    this.totalRange = totalRange
    return totalValues
  }
  
  /**
   * 1列目の値を調整する
   * 重複チェックを行い、必要に応じてデータを整理する
   * @return {boolean} 再構築が必要かどうか
   */
  adjustCol1(){
    let reformRequire = false

    const valuesCol1 = this.getValuesFromCol1()
    const [idSet, selectedRows] = this.distinctValues(valuesCol1)
    this.addToIdSet([...idSet])

    if( valuesCol1.length !== idSet.size ){
      reformRequire = true
    }
    return reformRequire
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
    return this.ids[ this.ids.length - 1]
  }
  
  /**
   * 1列目から値を取得する
   * @return {Array} 1列目の値の配列
   */
  getValuesFromCol1(){
    return this.getCol1(this.worksheet, this.yklibbConfig)
  }
  
  /**
   * 指定されたワークシートの1列目のデータを取得・設定する
   * @param {Worksheet} worksheet - 対象ワークシート
   * @param {Object} yklibbConfig - YKLibb設定
   * @return {Array} 1列目のデータ行の値
   */
  getCol1(worksheet, yklibbConfig){
    const [headerCol1, valuesCol1, headerRangeCol1, dataRowsRangeCol1, totalRangeCol1] = YKLibb.Gssx.setupSpreadsheetAndHeaderAndDataOfCol1(worksheet, yklibbConfig)
    YKLiblog.Log.debug(`############# values=${ JSON.stringify(valuesCol1)} `)
    this.headerCol1 = headerCol1
    this.valuesCol1 = valuesCol1
    this.totalRangeCol1 = totalRangeCol1
    this.headerRangeCol1 = headerRangeCol1
    this.dataRowsRangeCol1 = dataRowsRangeCol1
    this.dataRowsValuesCol1 = this.dataRowsRangeCol1.getValues()    
    this.totalRangeCol1 = totalRangeCol1
    return this.dataRowsValuesCol1
  }

  /**
   * 行データから重複を除去した値と選択された行を取得する
   * @param {Array} rows - 行データの配列
   * @return {Array} [IDセット, 選択された行の配列]
   */
  distinctValues(rows){
    YKLiblog.Log.debug(`this.indexOfHeaderId=${this.indexOfHeaderId}`)
    // const ids = rows.map( row => row[this.indexOfHeaderId] )
    const idSetInit = new Set()
    const [idSet, selectedRows] = rows.reduce( (accumulator, currentValue) => {
      const id = currentValue[this.indexOfHeaderId]
      YKLiblog.Log.debug(`id=${id}`)
      if( id !== null && typeof(id) !== "undefined" ){
        if( !accumulator[0].has(id) ){
          accumulator[0].add(id)
          accumulator[1].push(currentValue)
        }
      }
      return accumulator
    }, [idSetInit, []])
    return [idSet, selectedRows]
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
    if( (typeof(within.array) === "undefined") || within.array.length <= 0 ){
      // YKLiblog.Log.debug(`gmailregster|registerDate| 0 return`)
      throw Error(`registerData`)
      // return
    }
    // YKLiblog.Log.debug(`0 RegisteredEmail registerData lastDate=${lastDate}`)

    // YKLiblog.Log.debug(`1-0 RegisteredEmail registerData within.array.length=${within.array.length}`)
    // 前回処理した日時(lastDate以降)のメッセージを取り出す
    const nestedArray =  within.array.map( item => item.collectMessagesdataAfterDate( lastDate ) )
    // YKLiblog.Log.debug(`1 RegisteredEmail registerData nestedArray.length=${nestedArray.length}`)
    // ThreadAndMessagedataarray毎のメッセージの配列の配列を、フラットな配列に変換
    const filteredMessagearrayList = nestedArray.flat()
    // YKLiblog.Log.debug(`2 RegisteredEmail registerData filteredMessagearrayList.length=${filteredMessagearrayList.length}`)
    // 未記録メッセージのみを取り出す
    const unrecordedList = filteredMessagearrayList.filter( item => {
        YKLiblog.Log.debug(`2.5 RegisteredEmail registerData item.msg.getId()=${item.msg.getId()} item.recorded=${item.recorded}`)
        return !item.recorded 
      }
    )
    // YKLiblog.Log.debug(`3 RegisteredEmail registerData unrecordedList.length=${unrecordedList.length}`)
    if(unrecordedList.length === 0){
      return [[], []]
    }
    // 未記録メッセージに対し切り詰め処理を行う
    const messageDataList = unrecordedList.map( item => {
      item.truncateString(limit)
      return item
    } )
    // 未記録メッセージを、1メッセージを表す配列の配列として取り出す（ワークシートに記録するのに適した形式に変換）
    const dataArray = messageDataList.map( messageData => messageData.getDataAsArray() )
    YKLiblog.Log.debug(`4 RegisteredEmail registerData dataArray.length=${dataArray.length}`)
    // YKLiblog.Log.debug(`4-X RegisteredEmail registerData dataArray=${ JSON.stringify( dataArray ) }`)
    // Google Spreadsheetsのワークシートに追記する
    this.registerDataArray( dataArray, op )
    //記録したので、以降では記録済みメッセージのIDとして扱う。
    // const recordedMessageIds = unrecordedMessageIds
    // YKLiblog.Log.debug(`5 RegisteredEmail registerData recordedMessageIds.length=${recordedMessageIds.length}`)
    
    return [messageDataList]
  }
  
  /**
   * ワークシートにヘッダーを追加する
   * @param {Worksheet} sheet - 対象ワークシート
   */
  addHeader(sheet){
    const r = 1
    const c = 1
    const h = 1
    const headers = this.tableDef.getHeader()
    const range = sheet.getRange(r, c, h, headers.length)
    range.setValues( [headers] )
    this.header = headers
    this.headerRange = range
  }

  /**
   * データ配列をスプレッドシートに登録する
   * @param {Array} dataArray - 登録するデータの配列
   * @param {string} op - 操作タイプ（REWRITE または addUnderRow）
   */
  registerDataArray(dataArray, op){
    this.getRangeForHeaderAndData(this.worksheet, this.yklibbConfig)
    const totalRangeShape = YKLiba.Range.getRangeShape(this.totalRange)
    YKLiblog.Log.debug(`RegisteredEmail  registerDataArray totalRangeShape.r=${totalRangeShape.r} totalRangeShape.c=${totalRangeShape.c} totalRangeShape.h=${totalRangeShape.h} totalRangeShape.w=${totalRangeShape.w}`)
    let range2;
    let range3;
    let rangeShape2;
    let rangeShape3;
    if( op === YKLiba.Config.REWRITE() ){
      this.totalRange.deleteCells(SpreadsheetApp.Dimension.ROWS);
      this.addHeader(this.worksheet)
      range2 = this.headerRange.offset(1,0) 
      rangeShape2 = YKLiba.Range.getRangeShape(range2)
      YKLiblog.Log.debug(`1`)
    }
    else{
      // YKLiba.Config.addUnderRow
      // 既存のrangeの最後のROWの直下から追加する
      if( YKLibb.Util.hasValidDataHeaderAndDataRows(this.totalRange, this.yklibbConfig)[0] ){
        range2 = this.totalRange
        rangeShape2 = totalRangeShape
      }
      else{
        this.totalRange.deleteCells(SpreadsheetApp.Dimension.ROWS);
        this.addHeader(this.worksheet)
        range2 = this.headerRange.offset(1,0) 
        rangeShape2 = YKLiba.Range.getRangeShape(range2)
      }
      YKLiblog.Log.debug(`2 rangeShape2.h=${rangeShape2.h} rangeShape2.c=${rangeShape2.c}`)
    }
    range3 = this.worksheet.getRange(rangeShape2.r, rangeShape2.c, dataArray.length, dataArray[0].length)
    rangeShape3 = YKLiba.Range.getRangeShape(range3)
    // YKLiblog.Log.debug(`rangeShape2=${JSON.stringify(rangeShape2)}` )
    // YKLiblog.Log.debug(`rangeShape3=${JSON.stringify(rangeShape3)}` )
    // YKLiblog.Log.debug(`dataArray.length=${ dataArray.length }` )
    // YKLiblog.Log.debug(`dataArray[0] .length=${ dataArray[0].length }` )
    // YKLiblog.Log.debug(`########### RegisteredEmail registerDataArray this.sheetName=${this.sheetName}` )
    // YKLiblog.Log.debug(`dataArray=${ JSON.stringify(dataArray) }` )
    range3.setValues( dataArray );
    this.addToIdSet( dataArray )
    // this.idSet = new Set( [...this.idSet, ...dataArray] )
    // this.ids = [...this.idSet]
    this.totalRange = this.worksheet.getRange(1, 1, rangeShape2.h + rangeShape3.h, rangeShape2.c)
    this.totalValues = this.totalRange.getValues()

    this.dataRowsRange = this.totalRange.offset(1, 0, this.totalRange.getHeight() - 1)
  }
}

