class TargetedEmailIdsList {
  constructor(rows){
    YKLiblog.Log.debug(`TargetedEmailIdsList.constructor(rows=${JSON.stringify(rows)})`)
    let item;
    let key;
    const targetedEmailIdsByKey = {};
    const targetedEmailIdsByIndex = {};

    this.targetedEmailIdsByKey = targetedEmailIdsByKey;
    this.targetedEmailIdsByIndex = targetedEmailIdsByIndex;
    for(let i=0; i<rows.length; i++){
      item = rows[i]
      key = item[0]
      if( Util.isWhiteSpaceString(key) ){
        continue
      }
      YKLiblog.Log.debug(`TargetedEmailIdsList constructor i=${i} key=${key}`)

      this.addTargetedIds(i, item)
    }
    YKLiblog.Log.debug(`TargetedEmailIdsList constructor this.targetedEmailIdsByKey=${this.targetedEmailIdsByKey}`)
  }
  addTargetedIds(i, item){
    YKLiblog.Log.debug(`TargetedEmailIdsList.addTargetedIds(i=${i}, item=${JSON.stringify(item)})`)
    const targetedEmailIds = new TargetedEmailIds(i, item);
    this.targetedEmailIdsByKey[targetedEmailIds.name] = targetedEmailIds
    this.targetedEmailIdsByIndex[targetedEmailIds.index] = targetedEmailIds
  }
  addToByKey(targetedEmailIds){
    YKLiblog.Log.debug(`TargetedEmailIdsList.addToByKey(targetedEmailIds=${JSON.stringify(targetedEmailIds)})`)
    // this.targetedEmailIdsAssoc[targetedEmailIds.name] = targetedEmailIds
    this.addToVyKeySub(this.targetedEmailIdsByKey, targetedEmailIds)
  }
  addToByKeySub(targetedEmailIdsByKey, targetedEmailIds){
    YKLiblog.Log.debug(`TargetedEmailIdsList.addToByKeySub(targetedEmailIdsByKey, targetedEmailIds=${JSON.stringify(targetedEmailIds)})`)
    targetedEmailIdsByKey[targetedEmailIds.name] = targetedEmailIds
  }
  addToByIndex(targetedEmailIds){
    YKLiblog.Log.debug(`TargetedEmailIdsList.addToByIndex(targetedEmailIds=${JSON.stringify(targetedEmailIds)})`)
    // this.targetedEmailIdsAssoc[targetedEmailIds.name] = targetedEmailIds
    this.addToByIndexSub(this.targetedEmailIdsByIndex, targetedEmailIds)
  }
  addToByIndexSub(targetedEmailIdsByIndex, targetedEmailIds){
    YKLiblog.Log.debug(`TargetedEmailIdsList.addToByIndexSub(targetedEmailIdsByIndex, targetedEmailIds=${JSON.stringify(targetedEmailIds)})`)
    targetedEmailIdsByIndex[targetedEmailIds.index] = targetedEmailIds
  }
  getTargetedEmailIdsByKey(key){
    YKLiblog.Log.debug(`TargetedEmailIdsList.getTargetedEmailIdsByKey(key=${key})`)
    return this.targetedEmailIdsByKey[key]
  }
  getTargetedEmailIdsByIndex(index){
    YKLiblog.Log.debug(`TargetedEmailIdsList.getTargetedEmailIdsByIndex(index=${index})`)
    return this.targetedEmailIdsByIndex[index]
  }
  keys(){
    YKLiblog.Log.debug(`TargetedEmailIdsList.keys()`)
    const keyArray = Object.keys(this.targetedEmailIdsByKey)
    return keyArray;
  }
  getAllTargetedEmailIds(){
    YKLiblog.Log.debug(`TargetedEmailIdsList.getAllTargetedEmailIds()`)
    // return Object.values(this.targetedEmailIdsByKey)
    return Object.values(this.targetedEmailIdsByIndex)
  }
  indexes(){
    YKLiblog.Log.debug(`TargetedEmailIdsList.indexes()`)
    const keyArray = Object.keys(this.targetedEmailIdsByIndex)
    return keyArray
  }
  getHeightAndWidth(){
    YKLiblog.Log.debug(`TargetedEmailIdsList.getHeightAndWidth()`)
    // TargetedEmailIdsListに対応するrowの集まり(空行を含む)を含む最小のRangeのheight, widthを返す
    const keys = this.keys()
    YKLiblog.Log.debug(`TargetedEmailIds getHeightAndWidthAndValues keys=${ JSON.stringify(keys) }`)
    const indexes = this.indexes()
    YKLiblog.Log.debug(`TargetedEmailIds getHeightAndWidthAndValues indexes=${ JSON.stringify(indexes) }`)

    const allTargetedEmailIds = this.getAllTargetedEmailIds()

    YKLiblog.Log.debug(`TargetedEmailIds getHeightAndWidthAndValues (size=)${allTargetedEmailIds.length}`)

    const indexAndDone = allTargetedEmailIds.reduce((accumrator, currentValue) => {
      accumrator[0] = accumrator[0].concat(currentValue.index)
      accumrator[1].push( currentValue.getDoneAsArray() )
      return accumrator
    }, [[], []])

    // TargetedEmailIdsのindexの最大値を求める
    if( indexAndDone[0].length === 0 ){
      return [0,0]
    }
    const [maxIndex, _minIndex] = YKLiba.Arrayx.getMaxAndMin(indexAndDone[0])
    YKLiblog.Log.debug(`TargetedEmailIds getHeightAndWidthAndValues maxIndex=${maxIndex}, _minIndex=${_minIndex}`)

    // 検索キー毎の記録済みメッセージIDの配列の要素数の最大値を求める
    const values = indexAndDone[1]
    YKLiblog.Log.debug(`TargetedEmailIds getHeightAndWidthAndValues values=${values}`)
    // 検索キー毎の記録済みメッセージID配列の要素数の最大値を求める
    const lengths = values.map( item => item.length )
    YKLiblog.Log.debug(`TargetedEmailIds getHeightAndWidthAndValues lengths=${lengths}`)
    const [maxLength, _minLength] = YKLiba.Arrayx.getMaxAndMin(lengths)
    YKLiblog.Log.debug(`TargetedEmailIds getHeightAndWidthAndValues maxLength=${maxLength}, _minLength=${_minLength}`)
    // TargetedEmailIdsの(0から始まる数値である)indexから、TargetedEmailIdsListに対応するrowの集まりの個数(行数)を求める
    const height = maxIndex + 1
    // 検索キーのカラムを含むrowのwidthを求める
    const width = maxLength + 1
    return [height, width]
  }
  getValueArray(index, size){
    YKLiblog.Log.debug(`TargetedEmailIdsList.getValueArray(index=${index}, size=${size})`)
    const targetedEmailIds = this.getTargetedEmailIdsByIndex(index)
    if( typeof(targetedEmailIds) === "undefined" ){
      YKLiblog.Log.debug(`TargetedEmailIds getValueArray index=${index} undefined`)
      return Array(size).fill('')
    }
    else{
      YKLiblog.Log.debug(`TargetedEmailIds getValueArray index=${index} Not undefined name=${targetedEmailIds.name}`)
      return targetedEmailIds.getDoneAsArray()
    }
  }
  getRowArray(index, size){
    YKLiblog.Log.debug(`TargetedEmailIdsList.getRowArray(index=${index}, size=${size})`)
    const targetedEmailIds = this.getTargetedEmailIdsByIndex(index)
    if( typeof(targetedEmailIds) === "undefined" ){
      YKLiblog.Log.debug(`TargetedEmailIds getRowArray index=${index} undefined`)
      return Array(size).fill('')
    }
    else{
      YKLiblog.Log.debug(`TargetedEmailIds getRowArray index=${index} Not undefined name=${targetedEmailIds.name}`)
      const values = targetedEmailIds.getDoneAsArray()
      return [targetedEmailIds.name , ...values]
    }
  }
}
this.TargetedEmailIdsList = TargetedEmailIdsList
