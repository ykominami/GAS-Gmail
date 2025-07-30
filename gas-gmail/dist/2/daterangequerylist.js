class DateRangeQueryList {
  constructor(way, maxYearsAgo){
    this.way = way
    this.maxYearsAgo = maxYearsAgo
    this.array = []
    this.assoc = {}
    this.years = []
  }
  collectThreads(gmailSearch, queryInfo, maxThreads){
    // let dateRangeQueryResult
    let year = -1
    let size = -1
    for(let yearsAgo=(this.maxYearsAgo - 1); yearsAgo >= 0; yearsAgo--){
      const dateRangeQueryResult = this.searchEmailsFromYearsAgo(gmailSearch, queryInfo, this.way, yearsAgo, maxThreads)
      size = dateRangeQueryResult.size
      if( dateRangeQueryResult.size > 0 ){
        year = dateRangeQueryResult.year
        this.assoc[year] = dateRangeQueryResult
        this.years.push(year)
        this.array.push(dateRangeQueryResult)
      }
    }
    const array = this.array
    const years = this.years
    this.yearsIndex = 0
  }
  getDataRangeQueryByYear(year){
    return this.assoc[year]
  }
  getDataRangeQueryByIndex(index){
    const year = this.years[index]
    return this.assoc[year]
  }
  getYearsSize(){
    return this.years.length
  }

  searchEmailsFromYearsAgo(gmailSearch, queryInfo, way, yearsAgo, maxThreads){
    const [year, dateRangeCondition] = queryInfo.getDateRangeConditionForOneYear(yearsAgo)
    YKLiblog.Log.debug(`DateRangeQueryList searchEmailsFromYearsAgo Before yearsAgo=${yearsAgo} year=${year} dateRangeCondition=${dateRangeCondition}`)
    queryInfo.setAdditonalQueryString(dateRangeCondition)
    const query = queryInfo.getQuery(way)
    YKLiblog.Log.unknown(`DateRangeQueryList searchEmailsFromYearsAgo Before yearsAgo=${yearsAgo} year=${year} query.string=${query.string}`)
    const threads = gmailSearch.getThreadsWithQuery(query.string, maxThreads)
    queryInfo.setQueryResultByIndex(query.index, threads)

    let length = -1
    if( threads !== null ){
      length = threads.length
    }
    YKLiblog.Log.unknown(`DateRangeQueryList searchEmailsFromYearsAgo length=${length} query.string=${query.string}`)
    YKLiblog.Log.unknown(`DateRangeQueryList searchEmailsFromYearsAgo After year=${year} length=${length}`)
    queryInfo.clearAdditionalQueryString()
    const dateRangeQueryResult = new DateRangeQueryResult(year, query, threads)
    return dateRangeQueryResult
  }
}