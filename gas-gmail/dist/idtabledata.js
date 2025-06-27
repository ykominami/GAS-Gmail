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
    this.dataRangeShape = Tableop.getRangeShape(this.dataRange)

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
  keys(){
    return this.targetedEmailIdsList.keys()
  }
  getTargetedEmailIdsByKey(key){
    return this.targetedEmailIdsList.getTargetedEmailIdsByKey(key);
  }
  getTargetedEmailIdsByIndex(index){
    return this.targetedEmailIdsList.getTargetedEmailIdsByIndex(index);
  }
  adjust(additionalKeys){
    const existingKeys = this.targetedEmailIdsList.keys()
    const existingKeySet = new Set(existingKeys)
    const nonExistingKeys = additionalKeys.filter(el => !existingKeySet.has(el));
    if( nonExistingKeys.length > 0 ){
      for( let i=0; i < nonExistingKeys.length; i++){
        const index = (this.dataRangeShape[2] - 1) + i
        const key = nonExistingKeys[index]
        this.targetedEmailIdsList.addTargetedIds(index, [key])
      }
      this.update()
    }
    YKLiblog.Log.debug(`IdTabledata adjust`)
  }

  rewrite(targetedEmailIds){
    const item = targetedEmailIds
    this.values[item.index] = [item.name].concat(item.getDoneAsArray())
  }
  update(){
    // 
    const [targetHeight, targetWidth] = this.targetedEmailIdsList.getHeightAndWidth()
    YKLiblog.Log.debug(`IdTabledata update targetHeight=${targetHeight} targetWidth=${targetWidth}`)
    const dataRangeShape = Tableop.getRangeShape(this.dataRange)

    const[maxHeight, minHeight] = YKLiba.Arrayx.getMaxAndMin([dataRangeShape[2], targetHeight])
    const[maxWidth, minWidth] = YKLiba.Arrayx.getMaxAndMin([dataRangeShape[3], targetWidth])

    // 左端の列セルを除いた領域(書き替え前、書換え後のうち、大きい方の高さ、幅をもつ)をクリア
    const valuesRange = this.worksheet.getRange(dataRangeShape[0] + 1, dataRangeShape[1] + 1, maxHeight, maxWidth)
    valuesRange.clear()
    const valuesRangeShape = Tableop.getRangeShape(valuesRange)
    
    YKLiblog.Log.debug( `IdTabledata update valuesRangeShape=${ JSON.stringify(valuesRangeShape) }` )
    const values = valuesRange.getValues()
    for(let h = 0; h < maxHeight; h++){
      const w = values[h].length
      const srcValues = this.targetedEmailIdsList.getValueArray(h, maxWidth)
      const srcWidth = srcValues.length
      const[maxW, minW] = YKLiba.Arrayx.getMaxAndMin([w, srcWidth])

      for(let i = 0; i < minW; i++){
        values[h][i] = srcValues[i]
      }
      YKLiblog.Log.debug( `IdTabledata update values[${h}]=${values[h]} }` )
    }
    YKLiblog.Log.debug( `IdTabledata update values=${values} }` )
    valuesRange.setValues(  values )
  }
  updateRow(targetedEmailIds){
    // 
    const srcValues = targetedEmailIds.getDoneAsArray()
    const width = srcValues.length
    YKLiblog.Log.debug(`IdTabledata updateRow width=${width}`)
    const dataRangeShape = Tableop.getRangeShape(this.dataRange)
    const [maxWidth, minWidth] = YKLiba.Arrayx.getMaxAndMin([dataRangeShape[3], width])
    // 左端の列セルを除いたtargetedEmailIdsの領域(書き込み前、書き込み後で、幅が長い方を指定する)をクリア
    const targetRange = this.worksheet.getRange(dataRangeShape[0] + 1 + targetedEmailIds.index, dataRangeShape[1] + 1, 1, maxWidth)
    targetRange.clear()

    const targetValues = targetRange.getValues()
    for(let i = 0; i < width; i++){
      targetValues[0][i] = srcValues[i]
    }
    YKLiblog.Log.debug( `IdTabledata update targetValues=${targetValues} }` )
    targetRange.setValues(  targetValues )
  }
}