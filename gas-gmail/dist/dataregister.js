class Dataregister {
  static registerData(within, name, op, limit, lastDate){
    if( (typeof(within.array) === "undefined") || within.array.length <= 0 ){
      // YKLiblog.Log.debug(`gmailregster|registerDate| 0 return`)
      // throw Error(`registerData`)
      return
    }

    const filteredMessagearrayList = GmailSearch.collectMessagesdataAfterDate( within.array, lastDate )
    // const messageDataList = truncateStringArray(filteredMessagearrayList, limit)
    const messageDataList = filteredMessagearrayList.map( item => {
      item.truncateString(limit) 
      return item
    } )

    const dataArray = messageDataList.map( messageData => messageData.getDataAsArray() )

    Dataregister.registerDataArray( dataArray, name, op )

    return messageDataList
  }

  static getDataSheetRange(sheetname){
    const ss_id = CONFIG.configSpreadsheetId
    // const ss_id = YKLiblog.Base.getSsId()
    YKLiblog.Log.debug(`Dataregister.getDataSheetRange ss_id=${ss_id}`)
    let [ss, sheet] = YKLiba.Base.getSpreadsheet(ss_id, sheetname)
    if(sheet === null){
      sheet = ss.insertSheet(sheetname)
    }
    const [values, dataRange] = YKLibb.Gssx.getValuesFromSheet(sheet);
    let range = dataRange;
    let row, col, height, width
    [row, col, height, width] = Tableop.getRangeShape(range)
    if( !height ){
      if( !width ){
        // YKLiblog.Log.debug(`getDataSheetRange 0 1`)
        range = sheet.getRange(row, col, 1, 1);
      }
      else{
        // YKLiblog.Log.debug(`getDataSheetRange 0 2`)
        range = dataRange.offset(row, col, 1, width);
      }
    }
    else{
      if( !width ){
        // YKLiblog.Log.debug(`getDataSheetRange 0 3`)
        range = dataRange.offset(row, col, height, 1);

      }
      else{
        // YKLiblog.Log.debug(`getDataSheetRange 0 4`)
      }
      // else{
      //   range = dataRange.offset(0, 0, height, width);
      // }
    }
    // [row, col, height, width] = Tableop.getRangeShape(range)
    return range
  }

  static registerDataArray(dataArray, sheetname, op){
    const range = Dataregister.getDataSheetRange(sheetname)

    let range2;
    let rangeShape;
    if( op === YKLiba.Config.rewrite() ){
      range2 = range;
      range2.deleteCells(SpreadsheetApp.Dimension.ROWS);
      rangeShape = YKLiba.Range.getRangeShape(range)
      YKLiblog.Log.debug(`1`)
    }
    else{
      // YKLiba.Config.addUnderRow
      // 既存のrangeの最後のROWの直下から追加する
      rangeShape = YKLiba.Range.getRangeShape(range)
      range2 = range.offset(rangeShape.h, 0, rangeShape.h + rangeShape.h, rangeShape.w)
      YKLiblog.Log.debug(`2`)
    }
    YKLiblog.Log.debug(`rangeShape=${JSON.stringify(rangeShape)}` )

    let height2 = dataArray.length
    if( !height2 ){
      height2 = 0
    }
    let width2;
    if (!dataArray[0]){
      width2 = 0
    }
    else{
      width2 = dataArray[0].length
    }

    // YKLiblog.Log.debug(`register_data height2=${height2} width2=${width2}`)

    if(height2 > 0 && width2 > 0){
      const range3 = YKLiba.Code.transformRange2(range2, height2, width2)
      [row, col, height, width] = Tableop.getRangeShape(range3)
      YKLiblog.Log.debug(`range3 row=${row} col=${col} height=${height} width=${width}`)
      YKLiblog.Log.debug(`dataArray.length=${dataArray.length}`)
      YKLiblog.Log.debug(`dataArray[0].length=${dataArray[0].length}`)
      try{
        range3.setValues( dataArray );
      }
      catch(e){
        // エラーが発生した場合、このブロックのコードが実行されます。
        // 'e' は発生したエラーオブジェクトです。
        YKLiblog.Log.debug("エラーが発生しました: " + e.message); // エラーメッセージを出力
        // または、エラーの詳細をログに出力
        YKLiblog.Log.debug("エラー名: " + e.name);
        YKLiblog.Log.debug("スタックトレース: " + e.stack);
      } finally {
        // try ブロックが正常に完了したか、catch ブロックが実行されたかに関わらず、
        // 常にこのブロックのコードが実行されます。（オプション）
        YKLiblog.Log.debug("処理が完了しました。");
      }
    }
  }

  /**
   * オブジェクトの配列に対して、オブジェクトのプロパティを指定長で切り取る関数
   *
   * @param {object[]} messagedataList クラスMessagesgdataのインスタンスの配列
   * @param {number} maxLength 最大文字列長
   * @return {object[]} 切り取り後のプロパティと切り取り前のプロパティと、切り取りが発生したかどうかを示すプロパティをもつオブジェクトの配列
   */
  static truncateStringArray(messagedataList, maxLength) {
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

      const names = ["id", "from", "subject", "dateStr", "plainBody"]
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
function testbSub(sheetname){
  let range = Dataregister.getDataSheetRange(sheetname)
  Tableop.showRangeShape(range)
  YKLiblog.Log.debug(`range=${JSON.stringify(range)}`)
  YKLiblog.Log.debug(`range=${range}`)

}
function testb(){
  let sheetname = CONFIG.idsSheetName
  testbSub(sheetname)  

  sheetname = "Hotwire Weekly"
  testbSub(sheetname)  
}

