class QueryInfo {
  constructor(from, pairLabel){
    this.from = from
    this.pairLabel = pairLabel

    let targetLabelName2 = pairLabel.targetLabelName
    if( targetLabelName2.includes(" ") ){
      targetLabelName2 = `"${targetLabelName2}"`
    }

    let endLabelName2 = pairLabel.endLabelName
    if( endLabelName2.includes(" ") ){
      endLabelName2 = `"${endLabelName2}"`
    }

    let from2 = from
    if( from.includes(" ") ){
      from2 = `"${from}"`
    }
    const query   = `label:${targetLabelName2} -label:${endLabelName2}`
    const query2 = `from: ${from2} -label:${targetLabelName2}`
    this.queries = [query, query2]

    this.start = 0
    this.max = 100
  }
  setQuery0(query){
    this.queries[0] = query
  }
  setQuery1(query){
    this.queries[1] = query
  }
  getQuery0(query){
    return this.queries[0]
  }
  getQuery1(query){
    return this.queries[1]
  }
  isValid(){
    let ret
    let result = true
    let count=0
    const messages = []
    const retPairLabel = YKLiba.isValidObject(this.pairLabel)
    YKLiba.Log.debug(`QueryInfo retPairLabel=${retPairLabel}`)
    ret = retPairLabel[0]
    if( ret ){
      const retPairLabelAndTargetLabel = YKLiba.isValidObject(this.pairLabel.targetLabel)
      if( !retPairLabelAndTargetLabel[0] ){
        const message = `QueryInfo  this.pairLabel.targetLabel ${retPairLabelAndTargetLabel[1]}`
        YKLiba.Log.debug(message)
        messages.push(message)
        count++
      }
      const retPairLabelAndEndLabel = YKLiba.isValidObject(this.pairLabel.endLabel)
      if( !retPairLabelAndEndLabel[0] ){
        message =`QueryInfo this.pairLabel.endtLabel ${retPairLabelAndEndLabel[1]}`
        messages.push(message)
        YKLiba.Log.debug(message)
        count++
      }
    }
    else{
      message = `QueryInfo this.pairLable1 ${retPairLabel[1]}`
      YKLiba.Log.debug(message)
        messages.push(message)
      count++
    }
    const retQueries = YKLiba.isValidObject(this.queries)
    const retQueries0 = YKLiba.isValidObject(this.queries[0])
    const retQueries1 = YKLiba.isValidObject(this.queries[1])
    YKLiba.Log.debug(`QueryInfo.isValid count=${count}`)
    if(count > 0){
      result = false
      throw Error('Invalid QueryInfo ${messages}')
    }
    return result
  }
}
