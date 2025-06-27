class Util {
  static makeTabledata2(){
    const [spradsheet, worksheet, header, values, dataRange] = CONFIG.getConfigInfo2()
    Log.debug(`Util makeTabledata2 values=${values}`)
    const tabledata = new Tabledata(spradsheet, worksheet, header, values, dataRange);
    return tabledata
  }
  static makeTabledata(){
    const [spradsheet, worksheet, header, values, dataRange] = CONFIG.getConfig()
    Log.debug(`Util makeTabledata values=${values}`)
    const tabledata = new Tabledata(spradsheet, worksheet, header, values, dataRange);
    return tabledata
  }
  static makeIdTabledata(){
    const [spradsheet, worksheet, header, values, dataRange] = CONFIG.getConfigIds()
    Log.debug(`Util makeIdTabledata values=${values}`)
    const idtabledata = new IdTabledata(spradsheet, worksheet, header, values, dataRange);
    return idtabledata
  }
  static isWhiteSpaceString(str){
    return (typeof(str) === "string" && str.trim() === '')
  }
  static isValidString(str){
    return (typeof(str) === "string" && str.trim() !== '')
  }

  static getDataSheetRange(sheetname){
    const ss_id = CONFIG.configSpreadsheetId
    // const ss_id = YKLiblog.Base.getSsId()
    Log.debug(`Dataregister getDataSheetRange ss_id=${ss_id}`)
    let [ss, sheet] = YKLiba.Base.getSpreadsheet(ss_id, sheetname)
    if(sheet === null){
      sheet = ss.insertSheet(sheetname)
    }
    const [values, dataRange] = YKLibb.Gssx.getValuesFromSheet(sheet);
    let range = dataRange;
    let row, col, height, width
    [row, col, height, width] = YKLiba.Range.getRangeShape(range)
    if( !height ){
      if( !width ){
        // Log.debug(`getDataSheetRange 0 1`)
        range = sheet.getRange(row, col, 1, 1);
      }
      else{
        // Log.debug(`getDataSheetRange 0 2`)
        range = dataRange.offset(row, col, 1, width);
      }
    }
    else{
      if( !width ){
        // Log.debug(`getDataSheetRange 0 3`)
        range = dataRange.offset(row, col, height, 1);

      }
      else{
        // Log.debug(`getDataSheetRange 0 4`)
      }
      // else{
      //   range = dataRange.offset(0, 0, height, width);
      // }
    }
    // [row, col, height, width] = YKLiba.Range.getRangeShape(range)
    return range
  }
  /**
   * Setと配列の差分を取得する
   * @param {Set} setObj - 比較元のSet
   * @param {Array} arrayObj - 比較対象の配列
   * @returns {{setOnly: Array, arrayOnly: Array, symmetric: Array}} 3種類の差分を含むオブジェクト
   */
  static calculateSetAndArrayDifference(done, arrayObj) {
    const x2 = [...arrayObj]
    Log.debug(`x2=${x2}`)

    const arrayAsSet = new Set(arrayObj);

    // this.doneにのみ存在する要素
    const setOnly = [...done].filter(el => !arrayAsSet.has(el));
    
    // 配列にのみ存在する要素
    const arrayOnly = [...arrayObj].filter(el => !done.has(el));
    
    // 対称差
    const symmetric = [...setOnly, ...arrayOnly];
    
    return [setOnly, arrayOnly, symmetric,];
  }
}

function test_util(){
  let key
  const idtabledata = Util.makeIdTabledata()
  const keys = idtabledata.keys()
  Log.debug(`keys=${ keys }`)
  key = keys[0]
  test_util_b(idtabledata, key)
  
  key = "xyz"
  test_util_b(idtabledata, key)
  
}
function test_util_b(idtabledata, key){
  Log.debug(key)
  const targetedEmailIds = idtabledata.getTargetedEmailIdsByKey(key)
  const ret = typeof(targetedEmailIds)
  if( ret !== "undefined" ){
    Log.debug(`done=${ [...targetedEmailIds.done] }`)
  }
}
function test_util_c(idtabledata, key){
  Log.debug(key)
  const targetedEmailIds = idtabledata.getTargetedEmailIdsByKey(key)
  Log.debug(`done=${ [...targetedEmailIds.done] }`)
}