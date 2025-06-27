class TargetedEmailIdsList {
  constructor(values){
    let item;
    let key;
    const targetedEmailIdsByKey = {};
    const targetedEmailIdsByIndex = {};

    this.targetedEmailIdsByKey = targetedEmailIdsByKey;
    this.targetedEmailIdsByIndex = targetedEmailIdsByIndex;
    for(let i=0; i<values.length; i++){
      item = values[i]
      key = item[0]
      if( Util.isWhiteSpaceString(key) ){
        continue
      }
      YKLiblog.Log.debug(`TargetedEmailIdsList constructor i=${i} key=${key}`)

      this.addTargetedIds(i, item)
      // const targetedEmailIds = new TargetedEmailIds(i, item);
      // YKLiblog.Log.debug(`targetedEmailIds index=${targetedEmailIds.index} name=${targetedEmailIds.name}`)
      // this.addToByKeySub(targetedEmailIdsByKey, targetedEmailIds)
      // this.addToByIndexSub(targetedEmailIdsByIndex, targetedEmailIds)
    }
    YKLiblog.Log.debug(`TargetedEmailIdsList constructor this.targetedEmailIdsByKey=${this.targetedEmailIdsByKey}`)
  }
  addTargetedIds(i, item){
    const targetedEmailIds = new TargetedEmailIds(i, item);
    this.targetedEmailIdsByKey[targetedEmailIds.name] = targetedEmailIds
    // this.addToByKeySub(this.targetedEmailIdsByKey, targetedEmailIds)
    this.addToByIndexSub(this.targetedEmailIdsByIndex, targetedEmailIds)
  }
  addToByKey(targetedEmailIds){
    // this.targetedEmailIdsAssoc[targetedEmailIds.name] = targetedEmailIds
    this.addToByKeySub(this.targetedEmailIdsByKey, targetedEmailIds)
  }
  addToByKeySub(targetedEmailIdsByKey, targetedEmailIds){
    targetedEmailIdsByKey[targetedEmailIds.name] = targetedEmailIds
  }
  addToByIndex(targetedEmailIds){
    // this.targetedEmailIdsAssoc[targetedEmailIds.name] = targetedEmailIds
    this.addToByIndexSub(this.targetedEmailIdsByIndex, targetedEmailIds)
  }
  addToByIndexSub(targetedEmailIdsByIndex, targetedEmailIds){
    targetedEmailIdsByIndex[targetedEmailIds.index] = targetedEmailIds
  }
  getTargetedEmailIdsByKey(key){
    return this.targetedEmailIdsByKey[key]
  }
  getTargetedEmailIdsByIndex(index){
    return this.targetedEmailIdsByIndex[index]
  }
  keys(){
    const keyArray = Object.keys(this.targetedEmailIdsByKey)
    return keyArray;
  }
  getHeightAndWidth(){
    const keys = this.keys()
    YKLiblog.Log.debug(`IdTabledata update keys=${keys}`)
    const values = keys.map( key => this.getTargetedEmailIdsByKey(key).getDoneAsArray() )
    const height = values.length
    const lengths = values.map( item => item.length)
    const [max, min] = YKLiba.Arrayx.getMaxAndMin(lengths)
    return [height, max]
  }
  getValueArray(index, size){
    const targetedEmailIds = this.getTargetedEmailIdsByIndex(index)
    if( typeof(targetedEmailIds) === "undefined" ){
      YKLiblog.Log.debug(`index=${index} undefined`)
      return Array(size).fill('')
    }
    else{
      YKLiblog.Log.debug(`index=${index} Not undefined`)
      return targetedEmailIds.getDoneAsArray()
    }
  }
}
this.TargetedEmailIdsList = TargetedEmailIdsList
