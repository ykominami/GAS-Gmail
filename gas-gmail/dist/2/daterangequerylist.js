/**
 * 日付範囲クエリのリストを管理するクラス
 * 複数年にわたるメール検索クエリを効率的に管理する
 */
class DateRangeQueryList {
  /**
   * DateRangeQueryListクラスのコンストラクタ
   * @param {string} way - 検索方法
   * @param {number} maxYearsAgo - 検索対象の最大年数（現在から何年前まで検索するか）
   */
  constructor(way, maxYearsAgo){
    this.way = way
    this.maxYearsAgo = maxYearsAgo
    this.array = []
    this.assoc = {}
    this.years = []
  }
  /**
   * 複数年にわたるスレッドを収集する
   * @param {Object} gmailSearch - Gmail検索オブジェクト
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {number} maxThreads - 取得するスレッドの最大数
   */
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
  /**
   * 指定されたインデックスの日付範囲クエリを取得する
   * @param {number} index - 取得するクエリのインデックス
   * @returns {Object} 日付範囲クエリの結果オブジェクト
   */
  getDateRangeQueryByIndex(index){
    const year = this.years[index]
    return this.assoc[year]
  }
  /**
   * 検索対象の年数を取得する
   * @returns {number} 検索対象の年数
   */
  getYearsSize(){
    return this.years.length
  }

  /**
   * 指定された年数前のメールを検索する
   * @param {Object} gmailSearch - Gmail検索オブジェクト
   * @param {Object} queryInfo - クエリ情報オブジェクト
   * @param {string} way - 検索方法
   * @param {number} yearsAgo - 現在から何年前のメールを検索するか
   * @param {number} maxThreads - 取得するスレッドの最大数
   * @returns {Object} 検索結果を含む日付範囲クエリ結果オブジェクト
   */
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