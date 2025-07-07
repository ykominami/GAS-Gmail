class Util {
  static isWhiteSpaceString(str){
    return (typeof(str) === "string" && str.trim() === '')
  }
  static isValidString(str){
    return (typeof(str) === "string" && str.trim() !== '')
  }
  static getDataSheetRange(spradsheet, sheetName){
    Util.safeLogDebug(`Util.getDataSheetRange sheetName=${sheetName}`)
    if (!spradsheet || typeof spradsheet.getSheetByName !== 'function') {
      Util.safeLogDebug('getDataSheetRange: spradsheet.getSheetByName is not available');
      return [null, null];
    }
    let sheet = spradsheet.getSheetByName(sheetName);
    if(sheet === null && typeof spradsheet.insertSheet === 'function'){
      sheet = spradsheet.insertSheet(sheetName)
      Util.safeLogDebug(`Util.getDataSheetRange insert sheetName=${sheetName}`)
    }
    if (!sheet) {
      Util.safeLogDebug('getDataSheetRange: sheet is not available');
      return [null, null];
    }
    if (typeof YKLibb === 'undefined' || !YKLibb.Gssx || typeof YKLibb.Gssx.getMinimalContentRange !== 'function') {
      Util.safeLogDebug('getDataSheetRange: YKLibb.Gssx.getMinimalContentRange is not available');
      return [sheet, null];
    }
    const range = YKLibb.Gssx.getMinimalContentRange(sheet)
    return [sheet, range]
  }
  static isBlankRow(value){
    return (value.length == 1 && value[0] === '')
  }
  static getHeaderRange(range){
    if (typeof YKLiba === 'undefined' || !YKLiba.Range || typeof YKLiba.Range.getRangeShape !== 'function') {
      Util.safeLogDebug('getHeaderRange: YKLiba.Range.getRangeShape is not available');
      return null;
    }
    const shape = YKLiba.Range.getRangeShape(range)
    if (!range || typeof range.offset !== 'function') {
      Util.safeLogDebug('getHeaderRange: range.offset is not available');
      return null;
    }
    return range.offset(0,0, 1, shape.w)
  }
  static geDataRowsRange(range){
    if (typeof YKLiba === 'undefined' || !YKLiba.Range || typeof YKLiba.Range.getRangeShape !== 'function') {
      Util.safeLogDebug('geDataRowsRange: YKLiba.Range.getRangeShape is not available');
      return null;
    }
    const shape = YKLiba.Range.getRangeShape(range)
    if (!range || typeof range.offset !== 'function') {
      Util.safeLogDebug('geDataRowsRange: range.offset is not available');
      return null;
    }
    return range.offset(1,0)
  }
  static makeAssocArray(headers, values){
    const array = []
    for(let h=0; h<values.length; h++){
      const value = values[h]
      const assoc = Util.makeAssoc(headers, value)
      array.push(assoc)
    }
    Util.safeLogDebug( array )
    return array
  }
  static makeAssoc(headers, value){
    const assoc = {}
    for(let i=0; i<headers.length; i++){
      const name = headers[i]
      assoc[name] = value[i]
    }
    return assoc
  }
  static hasValidDataHeaderAndDataRows(range){
    if (!range || typeof range.getValues !== 'function') {
      Util.safeLogDebug('hasValidDataHeaderAndDataRows: range.getValues is not available');
      return [false, false, false];
    }
    const values = range.getValues()
    const header = values.shift()
    const dataValues = values
    let invalidHeader;
    let invalidDataRows;

    invalidHeader = Util.hasInvalidHeader(header)
    if(invalidHeader){
      Util.safeLogDebug(`Util.hasValidDataHeaderAndDataRows invalidHeader`)
    }
    else{
      invalidDataRows = Util.hasInvalidDataRows(dataValues)
      if(invalidDataRows){
        Util.safeLogDebug(`Util.hasValidDataHeaderAndDataRows invalidDataRows`)
      }
    }
    const validHeader = !invalidHeader
    const validDataRows = !invalidDataRows
    return [ (validHeader && validDataRows), validHeader, validDataRows ]
  }
  /**
   * 2つの配列が要素の順序と要素の値がすべて一致するかを判定します。
   * プリミティブ値（文字列、数値、ブール値）の配列に最適です。
   * オブジェクトや他の配列がネストされている場合は、より複雑な比較ロジックが必要です。
   *
   * @param {Array<any>} arr1 比較対象の最初の配列。
   * @param {Array<any>} arr2 比較対象の2番目の配列。
   * @returns {boolean} 2つの配列が完全に一致する場合はtrue、そうでない場合はfalse。
   */
  static areArraysEqual(arr1, arr2) {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }
    return true;
  }
  static hasInvalidHeader(value){
    if (typeof CONFIG === 'undefined' || typeof CONFIG.getHeaders !== 'function') {
      Util.safeLogDebug('hasInvalidHeader: CONFIG.getHeaders is not available');
      return true;
    }
    let result = false
    if( Util.isBlankRow(value) && Util.areArraysEqual(value, CONFIG.getHeaders()) ){
      result = true
    }
    return result
  }
  static hasInvalidDataRows(values){
    if (typeof CONFIG === 'undefined' || typeof CONFIG.getHeaders !== 'function') {
      Util.safeLogDebug('hasInvalidDataRows: CONFIG.getHeaders is not available');
      return true;
    }
    const width = CONFIG.getHeaders().length
    const invalid = values.some( item => item.length !== width )
    return invalid
  }

  static getDataSheetRange0(spradsheet, sheetName){
    Util.safeLogDebug(`Util.getDataSheetRange sheetName=${sheetName}`)
    if (!spradsheet || typeof spradsheet.getSheetByName !== 'function') {
      Util.safeLogDebug('getDataSheetRange0: spradsheet.getSheetByName is not available');
      return [null, null];
    }
    let sheet = spradsheet.getSheetByName(sheetName);
    if(sheet === null && typeof spradsheet.insertSheet === 'function'){
      sheet = spradsheet.insertSheet(sheetName)
      Util.safeLogDebug(`Util.getDataSheetRange insert sheetName=${sheetName}`)
    }
    if (!sheet) {
      Util.safeLogDebug('getDataSheetRange0: sheet is not available');
      return [null, null];
    }
    if (typeof YKLibb === 'undefined' || !YKLibb.Gssx || typeof YKLibb.Gssx.getValuesFromSheet !== 'function') {
      Util.safeLogDebug('getDataSheetRange0: YKLibb.Gssx.getValuesFromSheet is not available');
      return [sheet, null];
    }
    const [values, dataRange] = YKLibb.Gssx.getValuesFromSheet(sheet);
    let range = dataRange;
    let row, col, height, width;
    if (typeof YKLiba === 'undefined' || !YKLiba.Range || typeof YKLiba.Range.getRangeShape !== 'function') {
      Util.safeLogDebug('getDataSheetRange0: YKLiba.Range.getRangeShape is not available');
      return [sheet, range];
    }
    const dataRangeShape = YKLiba.Range.getRangeShape(range)
    row = dataRangeShape.r
    col = dataRangeShape.c
    height = dataRangeShape.h
    width = dataRangeShape.w_p4wYx5U
    if( !height ){
      if( !width ){
        Util.safeLogDebug(`Util.getDataSheetRange 0 1`)
        if (typeof sheet.getRange === 'function') {
          range = sheet.getRange(row, col, 1, 1);
        } else {
          Util.safeLogDebug('getDataSheetRange0: sheet.getRange is not available');
        }
      }
      else{
        Util.safeLogDebug(`Util.getDataSheetRange 0 2`)
        if (typeof dataRange.offset === 'function') {
          range = dataRange.offset(row, col, 1, width);
        } else {
          Util.safeLogDebug('getDataSheetRange0: dataRange.offset is not available');
        }
      }
    }
    else{
      if( !width ){
        Util.safeLogDebug(`Util.getDataSheetRange 0 3`)
        if (typeof dataRange.offset === 'function') {
          range = dataRange.offset(row, col, height, 1);
        } else {
          Util.safeLogDebug('getDataSheetRange0: dataRange.offset is not available');
        }
      }
      else{
        Util.safeLogDebug(`Util.getDataSheetRange 0 4`)
      }
    }
    return [sheet, range]
  }
  /**
   * Setと配列の差分を取得する
   * @param {Set} setObj - 比較元のSet
   * @param {Array} arrayObj - 比較対象の配列
   * @returns {{setOnly: Array, arrayOnly: Array, symmetric: Array}} 3種類の差分を含むオブジェクト
   */
  static calculateSetAndArrayDifference(done, arrayObj) {
    const x2 = [...arrayObj]
    Util.safeLogDebug(`Util calculateSetAndArrayDifference x2=${x2}`)
    const arrayAsSet = new Set(arrayObj);
    const setOnly = [...done].filter(el => !arrayAsSet.has(el));
    const arrayOnly = [...arrayObj].filter(el => !done.has(el));
    const symmetric = [...setOnly, ...arrayOnly];
    return [setOnly, arrayOnly, symmetric,];
  }
  /**
   * 安全なログ出力メソッド
   * @param {string|any} message ログメッセージ
   */
  static safeLogDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[Util] ${message}`);
      }
    } catch (error) {
      console.log(`[Util] Log error: ${error.message}`);
    }
  }
}
