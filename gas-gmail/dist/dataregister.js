class Dataregister {
  constructor(){
    // this.unrecordedMessageIds = []
  }
  registerData(within, name, op, limit, lastDate){
    YKLiblog.Log.debug(`Dataregister registerData `)
    // 引数withinは、クラスMessageArrayのインスタンス
    // 引数lastDateより、後ろの日時を持つメッセージを処理対象とする
    // within.arrayはクラスThreadAndMessagedataarrayのインスタンスの配列
    if( (typeof(within.array) === "undefined") || within.array.length <= 0 ){
      // YKLiblog.Log.debug(`gmailregster|registerDate| 0 return`)
      throw Error(`registerData`)
      // return
    }
    // 前回処理した日時(lastDate以)降のメッセージを取り出す
    const nestedArray =  within.array.map( item => item.collectMessagesdataAfterDate( lastDate ) )
    // ThreadAndMessagedataarray毎のメッセージの配列の配列を、フラットな配列に変換
    const filteredMessagearrayList =  Array.prototype.flat(nestedArray)
    // const messageDataList = truncateStringArray(filteredMessagearrayList, limit)
    // 未記録メッセージのみを取り出す
    const unrecordedList = filteredMessagearrayList.filter( item => !item.recorded )
    const unrecordedMessageIds = unrecordedList.map( itme => item.getMessageId() )
    // 未記録メッセージに対し切り詰め処理を行う
    const messageDataList = unrecordedList.map( item => item.truncateString(limit) )
    // 未記録メッセージを、1メッセージを表す配列の配列を取り出す
    const dataArray = messageDataList.map( messageData => messageData.getDataAsArray() )
    // Google Spreadsheetsのワークシートに追記する
    this.registerDataArray( dataArray, name, op )
    //記録したので、以降では記録済みメッセージのIDとして扱う。
    const recordedMessageIds = unrecordedMessageIds
    
    return [recordedMessageIds, messageDataList]
  }

  registerDataArray(dataArray, sheetname, op){
    YKLiblog.Log.debug(`Dataregister registerDataArray sheetname=${sheetname} `)

    const range = this.getDataSheetRange(sheetname)

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

