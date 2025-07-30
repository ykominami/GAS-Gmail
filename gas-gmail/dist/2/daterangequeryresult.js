class DateRangeQueryResult{
  constructor(year, query, value){
    this.year = year
    this.query = query
    if( value === null ){
      this.value = []
      this.size = 0
    }
    else{
      this.value = { value: value }
      this.size = value.length
    }
  }
}