class Util {
  static isWhiteSpaceString(str){
    return (typeof(str) === "string" && str.trim() === '')
  }
  static isValidString(str){
    return (typeof(str) === "string" && str.trim() !== '')
  }
  static getDataSheetRange(spradsheet, sheetName){
    YKLiblog.Log.debug(`Util.getDataSheetRange sheetName=${sheetName}`)
    let sheet = spradsheet.getSheetByName(sheetName);
    if(sheet === null){
      sheet = spradsheet.insertSheet(sheetName)
      YKLiblog.Log.debug(`Util.getDataSheetRange insert sheetName=${sheetName}`)
    }
    // const [values, dataRange] = YKLibb.Gssx.getValuesFromSheet(sheet);
    const range = YKLibb.Gssx.getMinimalContentRange(sheet)
    return [sheet, range]
  }
  static isBlankRow(value){
    return (value.length == 1 && value[0] === '')
  }
  static getHeaderRange(range){
    const shape = YKLiba.Range.getRangeShape(range)
    return range.offset(0,0, 1, shape.w)
  }
  static geDataRowsRange(range){
    const shape = YKLiba.Range.getRangeShape(range)
    return range.offset(1,0)
  }
  static makeAssocArray(headers, values){
    const array = []
    for(let h=0; h<values.length; h++){
      const value = values[h]
      const assoc = Util.makeAssoc(headers, value)
      array.push(assoc)
    }
    YKLiblog.Log.debug( array )
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
    const values = range.getValues()
    const header = values.shift()
    const dataValues = values
    let invalidHeader;
    let invalidDataRows;

    invalidHeader = Util.hasInvalidHeader(header)
    if(invalidHeader){
      YKLiblog.Log.debug(`Util.hasValidDataHeaderAndDataRows invalidHeader`)
    }
    else{
      invalidDataRows = Util.hasInvalidDataRows(dataValues)
      if(invalidDataRows){
        YKLiblog.Log.debug(`Util.hasValidDataHeaderAndDataRows invalidDataRows`)
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
    // 1. まず、配列の長さが異なる場合は一致しない
    if (arr1.length !== arr2.length) {
      return false;
    }

    // 2. 次に、各要素を順番に比較する
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        // 1つでも異なる要素があれば一致しない
        return false;
      }
    }

    // すべてのチェックを通過すれば一致する
    return true;
  }
  static hasInvalidHeader(value){
    let result = false
    if( Util.isBlankRow(value) && Util.areArraysEqual(value, CONFIG.getHeaders()) ){
      result = true
    }
    return result
  }
  static hasInvalidDataRows(values){
    const width = CONFIG.getHeaders().length
    const invalid = values.some( item => item.length !== width )
    return invalid
  }

  static getDataSheetRange0(spradsheet, sheetName){
    YKLiblog.Log.debug(`Util.getDataSheetRange sheetName=${sheetName}`)
    let sheet = spradsheet.getSheetByName(sheetName);
    if(sheet === null){
      sheet = spradsheet.insertSheet(sheetName)
      YKLiblog.Log.debug(`Util.getDataSheetRange insert sheetName=${sheetName}`)
    }
    const [values, dataRange] = YKLibb.Gssx.getValuesFromSheet(sheet);
    let range = dataRange;
    let row, col, height, width
    // [row, col, height, width] = Tableop.getRangeShape(range)
    const dataRangeShape = YKLiba.Range.getRangeShape(range)
    row = dataRangeShape.r
    col = dataRangeShape.c,
    height = dataRangeShape.h
    width = dataRangeShape.w_p4wYx5U

    if( !height ){
      if( !width ){
        YKLiblog.Log.debug(`Util.getDataSheetRange 0 1`)
        range = sheet.getRange(row, col, 1, 1);
      }
      else{
        YKLiblog.Log.debug(`Util.getDataSheetRange 0 2`)
        range = dataRange.offset(row, col, 1, width);
      }
    }
    else{
      if( !width ){
        YKLiblog.Log.debug(`Util.getDataSheetRange 0 3`)
        range = dataRange.offset(row, col, height, 1);
      }
      else{
        YKLiblog.Log.debug(`Util.getDataSheetRange 0 4`)
      }
    }
    // [row, col, height, width] = Tableop.getRangeShape(range)
    // [row, col, height, width] = YKLiba.Range.getRangeShape(range)

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
    YKLiblog.Log.debug(`Util calculateSetAndArrayDifference x2=${x2}`)

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
