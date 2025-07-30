class QueryResultList {
  constructor(){
    this.index = 0
    this.yvalues = []
    this.ways = new Set()
    this.indexByWay = {}
  }
  add(way, queryResult){
    const index = this.index++
    if( this.ways.has(way) ){
      this.indexByWay[way].push(index)
    }
    else{
      this.ways.add(way)
      this.indexByWay[way] = [index]
    }
    this.yvalues[index] = queryResult

    return index
  }

  getResultAsObject(way){
    let result = null
    if( this.ways.has(way) ){
      const indexArray = this.indexByWay[way]
      const index = indexArray[indexArray.length - 1]
      result = this.yvalues[index].getResultAsObject()
    }
    return result
  }
  getLastResult(){
    const lastIndex = this.yvalues.length - 1
    const result = this.yvalues[lastIndex]
    return result
  }

  setResultAsObjectByIndex(index, result){
    if( index < this.yvalues.lenth ){
      this.yvalues[index].setResultAsObject(result)
    }
  }

  getResultAsObjectByIndex(index){
    let result = null
    if( index < this.yvalues.lenth ){
      result = this.yvalues[index].getResultAsObject()
    }
    return result
  }
}