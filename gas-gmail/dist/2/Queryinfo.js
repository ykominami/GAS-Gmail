class QueryInfo {
  constructor(from, pairLabel, maxThreads, maxSearchesAvailable, lastDateTime ){
    if( maxThreads <= 0 ){
      throw Error(`maxThreads=${maxThreads}`)
    }
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
    const searchQuery   = `label:${targetLabelName2} -label:${endLabelName2}`
    const searchQuery2 = `from: ${from2} -label:${targetLabelName2}`
    this.searchQueries = [searchQuery, searchQuery2]

    const [validLastDate, validLastDateTime, validLastDateStr] = YKLibb.Util.getValidDateAndDateTime(lastDateTime)

    this.maxThreads = maxThreads
    this.maxSearchesAvailable = maxSearchesAvailable
    this.lastDateTime = validLastDateTime
    this.lastDateStr = validLastDateStr
    this.lastDate = validLastDate
  }
  setQuery0(query){
    this.searchQueries[0] = query
  }
  setQuery1(query){
    this.searchQueries[1] = query
  }
  getQuery0(query){
    return this.searchQueries[0]
  }
  getQuery1(query){
    return this.searchQueries[1]
  }
  setCount(value){
    this.count = value
  }
  getCount(){
    return this.count
  }
  setCount2(value){
    this.count2 = value
  }
  getCount2(){
    return this.count2    
  }
  getStart(){
    this.start
  }
  setStart(value){
    this.start = value
  }
  isValid(){
    let ret
    let result = true
    let count=0
    const messages = []
    const retPairLabel = YKLiba.isValidObject(this.pairLabel)
    YKLiblog.Log.debug(`QueryInfo retPairLabel=${retPairLabel}`)
    ret = retPairLabel[0]
    if( ret ){
      const retPairLabelAndTargetLabel = YKLiba.isValidObject(this.pairLabel.targetLabel)
      if( !retPairLabelAndTargetLabel[0] ){
        const message = `QueryInfo  this.pairLabel.targetLabel ${retPairLabelAndTargetLabel[1]}`
        YKLiblog.Log.debug(message)
        messages.push(message)
        count++
      }
      const retPairLabelAndEndLabel = YKLiba.isValidObject(this.pairLabel.endLabel)
      if( !retPairLabelAndEndLabel[0] ){
        message =`QueryInfo this.pairLabel.endtLabel ${retPairLabelAndEndLabel[1]}`
        messages.push(message)
        YKLiblog.Log.debug(message)
        count++
      }
    }
    else{
      message = `QueryInfo this.pairLable1 ${retPairLabel[1]}`
      YKLiblog.Log.debug(message)
        messages.push(message)
      count++
    }
    const retQueries = YKLiba.isValidObject(this.searchQueries)
    const retQueries0 = YKLiba.isValidObject(this.searchQueries[0])
    const retQueries1 = YKLiba.isValidObject(this.searchQueries[1])
    YKLiblog.Log.debug(`QueryInfo.isValid count=${count}`)
    if(count > 0){
      result = false
      throw Error('Invalid QueryInfo ${messages}')
    }
    return result
  }
}
