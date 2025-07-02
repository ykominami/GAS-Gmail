class IdTabledata {
  constructor(spradsheet, worksheet, header, values, dataRange){
    YKLiblog.Log.debug(`IdTabledata constructor header=${header} values=${values}`)
    this.spradsheet = spradsheet
    this.worksheet =  worksheet 
    // worksheetの四辺から連続した空白行、空白列を取り除いた長方形領域の最初の行に含まれるセルの値の配列
    this.header = header;
    // worksheetの四辺から連続した空白行、空白列を取り除いた長方形領域の第2行以降の行に含まれるセルの値の2次元配列
    this.values = values;
    this.dataRange = dataRange;
    this.dataRangeShape = YKLiba.Range.getRangeShape(this.dataRange)

    const targetedEmailIdsList = new TargetedEmailIdsList(values);
    this.targetedEmailIdsList = targetedEmailIdsList;
    YKLiblog.Log.debug(`============================== IdTabledata constructor this.targetedEmailIdsList=${this.targetedEmailIdsList}`)
  }
  dump(){
    YKLiblog.Log.debug(`IdTabledata dump header=${ this.header }`)
    YKLiblog.Log.debug(`IdTabledata dump values=${ this.values }`)
    YKLiblog.Log.debug(`IdTabledata dump values[0]=${ this.values[0] }`)
    YKLiblog.Log.debug(`IdTabledata dump values[1]=${ this.values[1] }`)
  }
  getKeys(){
    return this.targetedEmailIdsList.keys()
  }
  getTargetedEmailIdsByKey(key){
    return this.targetedEmailIdsList.getTargetedEmailIdsByKey(key);
  }
  getTargetedEmailIdsByIndex(index){
    return this.targetedEmailIdsList.getTargetedEmailIdsByIndex(index);
  }
  adjust(additionalKeys){
    YKLiblog.Log.debug(`IdTabledata adjust S`)
    const existingKeys = this.targetedEmailIdsList.keys()
    const existingKeySet = new Set(existingKeys)
    const nonExistingKeys = additionalKeys.filter(el => !existingKeySet.has(el));
    YKLiblog.Log.debug(`IdTabledata adjust 1 nonExistingKeys=${nonExistingKeys}`)
    const [height, width] = this.targetedEmailIdsList.getHeightAndWidth()

    if( nonExistingKeys.length > 0 ){
      YKLiblog.Log.debug(`IdTabledata adjust 2`)
      for( let i=0; i < nonExistingKeys.length; i++){
        const key = nonExistingKeys[i]
        const index = (height + 1) + i
        YKLiblog.Log.debug(`IdTabledata adjust 4 index=${index} key=${key}`)
        this.targetedEmailIdsList.addTargetedIds(index, [key])
      }
      this.update()
    }
    YKLiblog.Log.debug(`IdTabledata adjust E`)
  }

  rewrite(targetedEmailIds){
    const item = targetedEmailIds
    this.values[item.index] = [item.name].concat(item.getDoneAsArray())
  }
  update(){
    // 
    const [height, width] = this.targetedEmailIdsList.getHeightAndWidth()
    YKLiblog.Log.debug( `IdTabledata update height=${height} width=${width}` )
    const dataRangeShape = YKLiba.Range.getRangeShape(this.dataRange)

    // 左端の列セルを除いた領域(書き替え前、書換え後のうち、大きい方の高さ、幅をもつ)をクリア
    if(width > 0){
      const idsRange = this.worksheet.getRange(dataRangeShape.r + 1, dataRangeShape.c + 1, height, width)
      idsRange.clear()
    }
 
    const rowsRange = this.worksheet.getRange(dataRangeShape.r + 1, dataRangeShape.c, height + 1, width + 1)
    const rowsRangeShape = YKLiba.Range.getRangeShape(rowsRange)
    
    YKLiblog.Log.debug( `IdTabledata update rowsRangeShape=${ JSON.stringify(rowsRangeShape) }` )
    const rows = rowsRange.getValues()
    const w = rows[0].length
    for(let h = 0; h < rowsRangeShape.h; h++){
      // 検索結果を記録したrowの場合は、そのデータのみを含む配列を返す
      // 検索結果を記録したrowでない場合は、そのrowの幅分の空白の配列を返す
      const srcValues = this.targetedEmailIdsList.getRowArray(h, width)
      // const srcValues = this.targetedEmailIdsList.getValueArray(h, width)
      const srcWidth = srcValues.length
      const[_maxW, minW] = YKLiba.Arrayx.getMaxAndMin([w, srcWidth])

      for(let i = 0; i < minW; i++){
        rows[h][i] = srcValues[i]
      }
      YKLiblog.Log.debug( `IdTabledata update rows[${h}]=${rows[h]} }` )
    }
    YKLiblog.Log.debug( `IdTabledata update rows=${ JSON.stringify(rows) } }` )
    rowsRange.setValues(  rows )
  }
  updateRow(targetedEmailIds){
    // 
    const srcValues = targetedEmailIds.getDoneAsArray()
    const width = srcValues.length
    if( width === 0 ){
      return
    }
    YKLiblog.Log.debug(`IdTabledata updateRow width=${width}`)
    const dataRangeShape = YKLiba.Range.getRangeShape(this.dataRange)
    const [maxWidth, minWidth] = YKLiba.Arrayx.getMaxAndMin([dataRangeShape.w, width])
    // 左端の列セルを除いたtargetedEmailIdsの領域(書き込み前、書き込み後で、幅が長い方を指定する)をクリア
    const targetRange = this.worksheet.getRange(dataRangeShape.r + 1 + targetedEmailIds.index, dataRangeShape.c + 1, 1, maxWidth)
    targetRange.clear()

    const targetRangeShape = YKLiba.getRangeShape(targetRange)
    YKLiblog.Log.debug( `IdTabledata update targetRangeShape=${ JSON.stringify(targetRangeShape)} }` )
    YKLiblog.Log.debug( `IdTabledata update width=${ width } }` )

    // const targetValues = targetRange.getValues()
    const targetValues = Array(targetRangeShape.w - 1).fill('')
    YKLiblog.Log.debug( `IdTabledata update INIT targetValues.length=${targetValues.length}` )

    YKLiblog.Log.debug( `IdTabledata update BEFORE targetValues.length=${targetValues.length}` )
    for(let i = 0; i < width; i++){
      targetValues[i] = srcValues[i]
      // targetValuesx[i] = srcValues[i]
      YKLiblog.Log.debug( `IdTabledata update i=${i} targetValues.length=${targetValues.length}` )
    }
    YKLiblog.Log.debug( `IdTabledata update targetValues.length=${targetValues.length}` )
    const name = targetedEmailIds.getName()
    targetValues[0] = name
    const values = targetValues
    // const values = [name, ...targetValues]
    // targetValuesx[0] = name
    YKLiblog.Log.debug( `IdTabledata update values.length=${values.length}` )
    YKLiblog.Log.debug( `IdTabledata update JSON.stringify(values.length)=${  JSON.stringify(values) }` )
    // YKLiblog.Log.debug( `IdTabledata update JSON.stringify(valuesx.length)=${  JSON.stringify(valuesx) }` )

    targetRange.setValues(  [values] )
  }
}