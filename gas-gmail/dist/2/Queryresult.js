class QueryResult {
  static OBJECT(){
    return "OBJECT"
  }
  static STRING(){
    return "STRING"
  }
  constructor(way, queryString, mainQueryString, additionalQueryString){
    this.xresult = {}
    this.way = way
    this.queryString = queryString
    this.mainQueryString = mainQueryString
    this.additionalQueryString = additionalQueryString
  }
  setResultAsObject(value){
    const key = QueryResult.OBJECT()
    this.setResult(key, value)
  }
  setResultAsString(value){
    const key = QueryResult.STRING()
    this.setResult(key, value)
  }
  setResult(key, value){
    this.xresult[key] = value 
  }
  getResultAsObject(){
    const key = QueryResult.OBJECT()
    return this.getResult(key)
  }
  setResultAsString(value){
    const key = QueryResult.STRING()
    return this.getResult(key)
  }
  getResult(key){
    return this.xresult[key] 
  }
}