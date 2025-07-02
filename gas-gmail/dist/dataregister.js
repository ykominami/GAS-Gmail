class Dataregister {
  constructor(){
  }
  registerData(within, targetedEmail, op, limit, lastDate){
    YKLiblog.Log.debug(`Dataregister registerData `)
    // 引数withinは、クラスMessageArrayのインスタンス
    // 引数lastDateより、後ろの日時を持つメッセージを処理対象とする
    // within.arrayはクラスThreadAndMessagedataarrayのインスタンスの配列
    if( (typeof(within.array) === "undefined") || within.array.length <= 0 ){
      // YKLiblog.Log.debug(`gmailregster|registerDate| 0 return`)
      throw Error(`registerData`)
      // return
    }
    YKLiblog.Log.debug(`0 registerData lastDate=${lastDate}`)

    YKLiblog.Log.debug(`1-0 registerData within.array.length=${within.array.length}`)
    // 前回処理した日時(lastDate以)降のメッセージを取り出す
    const nestedArray =  within.array.map( item => item.collectMessagesdataAfterDate( lastDate ) )
    YKLiblog.Log.debug(`1 registerData nestedArray.length=${nestedArray.length}`)
    // ThreadAndMessagedataarray毎のメッセージの配列の配列を、フラットな配列に変換
    const filteredMessagearrayList = nestedArray.flat()
    YKLiblog.Log.debug(`2 registerData filteredMessagearrayList.length=${filteredMessagearrayList.length}`)
    // const messageDataList = truncateStringArray(filteredMessagearrayList, limit)
    // 未記録メッセージのみを取り出す
    const unrecordedList = filteredMessagearrayList.filter( item => {
        YKLiblog.Log.debug(`2.5 registerData item.msg.getId()=${item.msg.getId()} item.recorded=${item.recorded}`)
        return !item.recorded 
      }
    )
    YKLiblog.Log.debug(`3 registerData unrecordedList.length=${unrecordedList.length}`)
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
    YKLiblog.Log.debug(`4 registerData dataArray.length=${dataArray.length}`)
    // Google Spreadsheetsのワークシートに追記する
    this.registerDataArray( dataArray, targetedEmail, op )
    //記録したので、以降では記録済みメッセージのIDとして扱う。
    const recordedMessageIds = unrecordedMessageIds
    YKLiblog.Log.debug(`5 registerData recordedMessageIds.length=${recordedMessageIds.length}`)
    
    return [recordedMessageIds, messageDataList]
  }
  addHeaders(sheet){
    const r = 1
    const c = 1
    const h = 1
    const headers = CONFIG.getHeaders()
    const range = sheet.getRange(r, c, h, headers.length)
    range.setValues( headers )
    return range
  }

  registerDataArray(dataArray, targetedEmail, op){
    const sheetname = targetedEmail.getName()
    YKLiblog.Log.debug(`Dataregister registerDataArray sheetname=${sheetname} `)

    const [sheet, range] = Util.getDataSheetRange(targetedEmail.spradsheet, sheetname)
    const rangeShape = YKLiba.Range.getRangeShape(range)
    YKLiblog.Log.debug(`Dataregister registerDataArray rangeShape.r=${rangeShape.r} rangeShape.c=${rangeShape.c} rangeShape.h=${rangeShape.h} rangeShape.w=${rangeShape.w}`)

    let range2;
    let range3;
    let rangeShape2;
    let h;
    let c;
    if( op === YKLiba.Config.rewrite() ){
      range.deleteCells(SpreadsheetApp.Dimension.ROWS);
      range2 = this.addHeaders(sheet)
      rangeShape2 = YKLiba.Range.getRangeShape(range2)
      YKLiblog.Log.debug(`1`)
    }
    else{
      // YKLiba.Config.addUnderRow
      // 既存のrangeの最後のROWの直下から追加する
      if( Util.hasValidDataHeaderAndDataRows(range) ){
        range2 = range
        rangeShape2 = rangeShape
      }
      else{
        range.deleteCells(SpreadsheetApp.Dimension.ROWS);
        range2 = this.addHeaders(sheet)
        rangeShape2 = YKLiba.Range.getRangeShape(range2)
      }
      YKLiblog.Log.debug(`2 h=${h} c=${c}`)
    }
    range3 = sheet.getRange(rangeShape2.r + 1, rangeShape2.c, rangeShape2.r + 1 + dataArray.length, rangeShape2.w )
    YKLiblog.Log.debug(`rangeShape2=${JSON.stringify(rangeShape2)}` )
    range3.setValues( dataArray );
  }

  /**
   * オブジェクトの配列に対して、オブジェクトのプロパティを指定長で切り取る関数
   *
   * @param {object[]} messagedataList クラスMessagesgdataのインスタンスの配列
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
    if ( maxLength <= 0 && maxLength !== Config.nolimit()) {
      return [[]];
    }

    return messagedataList.map((item) => {
      item.isTruncated = false;

      const names = CONFIG.getHeaders()
      names.forEach( (name) => {
        str = item.original[name]
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

