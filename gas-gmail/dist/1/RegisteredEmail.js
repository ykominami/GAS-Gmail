class RegisteredEmail {
  constructor(targetedEmail, spreadsheet, sheetName, config, tableDef, yklibbConfig){
    YKLiblog.Log.debug(`RegisteredEmail sheetName=${sheetName}`)
    this.config = config
    this.tableDef = tableDef
    this.yklibbConfig = yklibbConfig

    this.targetedEmail = targetedEmail
    this.spreadsheet = spreadsheet
    this.sheetName = sheetName
    const worksheet = YKLibb.Gssx.getOrCreateWorksheet(spreadsheet,sheetName);

    const [header, values, headerRange, dataRowsRange, totalRange] = YKLibb.Gssx.getHeaderAndDataFromWorksheet(worksheet, yklibbConfig)

    this.worksheet = worksheet
    this.header = header
    this.values = values
    this.totalRange = totalRange
    this.headerRange = headerRange
    this.dataRowsRange = dataRowsRange

    YKLiblog.Log.debug(`tableDef.constructor=${ tableDef.constructor }`)
    this.indexOfHeaderId = tableDef.getIndexOfHeaderId()
    const [ids, idSet, selectedRows]  = this.distinctValues(values)

    const idSetSize = idSet.size
    const valuesLength = values.length 
    if( idSetSize !== valuesLength ){
      this.update(selectedRows)
    }

    this.ids = ids
    this.idSet = idSet
  }
  update(selectedRows){
    // const lineArray = []
    // selectedRows.forEach( (v, ind, ar) => lineArray.push( this.values[v] ) )
    if( selectedRows.length > 0){
      this.dataRowsRange.clear()
      const range = this.worksheet.getRange(1, 1, selectedRows.length, selectedRows[0].length)
      range.setValues(selectedRows)
      this.dataRowsRange = range
      this.values = selectedRows
      this.totalRange = this.worksheet.getRange(1, 1, this.headerRange.getNumRows() + this.dataRowsRange.getNumRows(), this.headerRange.getNumColumns())
    }
  }
  distinctValues(rows){
    YKLiblog.Log.debug(`this.indexOfHeaderId=${this.indexOfHeaderId}`)
    // const ids = rows.map( row => row[this.indexOfHeaderId] )
    const idSetInit = new Set()
    const [idSet, ids, selectedRows] = rows.reduce( (accumulator, currentValue) => {
      const id = currentValue[this.indexOfHeaderId]
      YKLiblog.Log.debug(`id=${id}`)
      if( !accumulator[0].has(id) ){
        accumulator[0].add(id)
        accumulator[1].push(id)
        accumulator[2].push(currentValue)
      }
      return accumulator
    }, [idSetInit, [], []])
    return [ids, idSet, selectedRows]
  }
  registerData(within, op, limit, lastDate){
    YKLiblog.Log.debug(`RegisteredEmail registerData `)
    // 引数withinは、クラスMessageArrayのインスタンス
    // 引数lastDateより、後ろの日時を持つメッセージを処理対象とする
    // within.arrayはクラスThreadAndMessagedataarrayのインスタンスの配列
    if( (typeof(within.array) === "undefined") || within.array.length <= 0 ){
      // YKLiblog.Log.debug(`gmailregster|registerDate| 0 return`)
      throw Error(`registerData`)
      // return
    }
    YKLiblog.Log.debug(`0 RegisteredEmail registerData lastDate=${lastDate}`)

    YKLiblog.Log.debug(`1-0 RegisteredEmail registerData within.array.length=${within.array.length}`)
    // 前回処理した日時(lastDate以降)のメッセージを取り出す
    const nestedArray =  within.array.map( item => item.collectMessagesdataAfterDate( lastDate ) )
    YKLiblog.Log.debug(`1 RegisteredEmail registerData nestedArray.length=${nestedArray.length}`)
    // ThreadAndMessagedataarray毎のメッセージの配列の配列を、フラットな配列に変換
    const filteredMessagearrayList = nestedArray.flat()
    YKLiblog.Log.debug(`2 RegisteredEmail registerData filteredMessagearrayList.length=${filteredMessagearrayList.length}`)
    // const messageDataList = this.truncateStringArray(filteredMessagearrayList, limit)
    // 未記録メッセージのみを取り出す
    const unrecordedList = filteredMessagearrayList.filter( item => {
        YKLiblog.Log.debug(`2.5 RegisteredEmail registerData item.msg.getId()=${item.msg.getId()} item.recorded=${item.recorded}`)
        return !item.recorded 
      }
    )
    YKLiblog.Log.debug(`3 RegisteredEmail registerData unrecordedList.length=${unrecordedList.length}`)
    if(unrecordedList.length === 0){
      return [[], []]
    }
    const unrecordedMessageIds = unrecordedList.map( item => item.getMessageId() )
    // 未記録メッセージに対し切り詰め処理を行う
    const messageDataList = unrecordedList.map( item => {
      item.truncateString(limit)
      return item
    } )
    // 未記録メッセージを、1メッセージを表す配列の配列として取り出す（ワークシートに記録するのに適した形式に変換）
    const dataArray = messageDataList.map( messageData => messageData.getDataAsArray() )
    YKLiblog.Log.debug(`4 RegisteredEmail registerData dataArray.length=${dataArray.length}`)
    // Google Spreadsheetsのワークシートに追記する
    this.registerDataArray( dataArray, op )
    //記録したので、以降では記録済みメッセージのIDとして扱う。
    const recordedMessageIds = unrecordedMessageIds
    YKLiblog.Log.debug(`5 RegisteredEmail registerData recordedMessageIds.length=${recordedMessageIds.length}`)
    
    return [recordedMessageIds, messageDataList]
  }
  addHeader(sheet){
    const r = 1
    const c = 1
    const h = 1
    const headers = this.tableDef.getHeader()
    const range = sheet.getRange(r, c, h, headers.length)
    range.setValues( [headers] )
    return range
  }

  registerDataArray(dataArray, op){
    YKLiblog.Log.debug(`RegisteredEmail  registerDataArray sheetName=${this.sheetName} `)

    const [sheet, range] = YKLibb.Gssx.getDataSheetRange(this.spreadsheet, this.sheetName)
    const rangeShape = YKLiba.Range.getRangeShape(range)
    YKLiblog.Log.debug(`RegisteredEmail  registerDataArray rangeShape.r=${rangeShape.r} rangeShape.c=${rangeShape.c} rangeShape.h=${rangeShape.h} rangeShape.w=${rangeShape.w}`)

    let range2;
    let range3;
    let rangeShape2;
    let rangeShape3;
    if( op === YKLiba.Config.rewrite() ){
      range.deleteCells(SpreadsheetApp.Dimension.ROWS);
      range2 = this.addHeader(sheet)
      rangeShape2 = YKLiba.Range.getRangeShape(range2)
      YKLiblog.Log.debug(`1`)
    }
    else{
      // YKLiba.Config.addUnderRow
      // 既存のrangeの最後のROWの直下から追加する
      if( Util.hasValidDataHeaderAndDataRows(range, this.yklibbConfig)[0] ){
        range2 = range
        rangeShape2 = rangeShape
      }
      else{
        range.deleteCells(SpreadsheetApp.Dimension.ROWS);
        range2 = this.addHeader(sheet)
        rangeShape2 = YKLiba.Range.getRangeShape(range2)
      }
      YKLiblog.Log.debug(`2 rangeShape2.h=${rangeShape2.h} rangeShape2.c=${rangeShape2.c}`)
    }
    range3 = sheet.getRange(rangeShape2.r, rangeShape2.c, dataArray.length, dataArray[0].length)
    rangeShape3 = YKLiba.Range.getRangeShape(range3)
    YKLiblog.Log.debug(`rangeShape2=${JSON.stringify(rangeShape2)}` )
    YKLiblog.Log.debug(`rangeShape3=${JSON.stringify(rangeShape3)}` )
    YKLiblog.Log.debug(`dataArray.length=${ dataArray.length }` )
    YKLiblog.Log.debug(`dataArray[0] .length=${ dataArray[0].length }` )
    YKLiblog.Log.debug(`########### RegisteredEmail registerDataArray this.sheetName=${this.sheetName}` )
    YKLiblog.Log.debug(`dataArray=${ JSON.stringify(dataArray) }` )
    range3.setValues( dataArray );
  }

  /**
   * オブジェクトの配列に対して、オブジェクトのプロパティを指定長で切り取る関数
   *
   * @param {object[]} messagedataList クラスMessagedataのインスタンスの配列
   * @param {number} maxLength 最大文字列長
   * @return {object[]} 切り取り後のプロパティと切り取り前のプロパティと、切り取りが発生したかどうかを示すプロパティをもつオブジェクトの配列
   */
  truncateStringArray(messagedataList, maxLength) {
    if (!Array.isArray(messagedataList)) {
      return [[]];
    }
    if (typeof maxLength !== 'number'){
      return [[]];
    } 
    if ( maxLength <= 0 && maxLength !== this.config.nolimit()) {
      return [[]];
    }

    return messagedataList.map((item) => {
      item.isTruncated = false;
      
      // Initialize truncated object if it doesn't exist
      if (!item.truncated) {
        item.truncated = {};
      }

      const names = this.tableDef.getHeader()
      names.forEach( (name) => {
        const str = item.original && item.original[name] ? item.original[name] : ''
        if (typeof str === 'string' && str.length > maxLength) {
          item.isTruncated = true;
          item.truncated[name] = str.substring(0, maxLength);
        }
        else{
          item.truncated[name] = str;
        }
      })
      return item
    } )
  }
}

