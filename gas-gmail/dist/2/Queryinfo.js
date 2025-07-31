/**
 * Gmail検索クエリ情報を管理するクラス
 * メール検索に必要なクエリ文字列と関連情報を保持する
 */
class QueryInfo {
  /**
   * QueryInfoクラスのコンストラクタ
   * @param {string} from - 送信者メールアドレス
   * @param {Object} pairLabel - ラベルペア情報（targetLabelName, endLabelNameを含む）
   * @param {number} maxThreads - 最大スレッド数（0より大きい値である必要がある）
   * @param {number} maxSearchesAvailable - 利用可能な最大検索数
   * @param {string|Date} lastDateTime - 最後の日時
   * @param {Array<string>} ways - 検索方法の配列
   * @throws {Error} maxThreadsが0以下の場合にエラーを投げる
   */
  constructor(from, pairLabel, maxThreads, maxSearchesAvailable, lastDateTime, ways){
    if( maxThreads <= 0 ){
      throw Error(`maxThreads=${maxThreads}`)
    }
    this.queryResultList = new QueryResultList()
    const today = new Date()
    this.year = today.getFullYear()
    
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

    this.assocQuery = {}
    ways.forEach( (key) => {
      if(key === EmailFetcherAndStorer.SearchWithTargetLabel() ){
        this.assocQuery[key] = `label:${targetLabelName2} -label:${endLabelName2}`
      }
      else if(key === EmailFetcherAndStorer.SearchWithFrom() ){
        this.assocQuery[key] = `from:${from2} -label:${targetLabelName2}`
      } 
      else if(key === EmailFetcherAndStorer.TargetLabel() ){
        this.assocQuery[key] = `label:${targetLabelName2}`
      } 
      else if(key === EmailFetcherAndStorer.EndTargetLabel() ){
        this.assocQuery[key] = `label:${endLabelName2}`
      } 
      else if(key === EmailFetcherAndStorer.From() ){
        this.assocQuery[key] = `from:${from2}`
      } 
    } )
    this.searchQueries = Object.values(this.assocQuery)

    const [validLastDate, validLastDateTime, validLastDateStr] = YKLibb.Util.getValidDateAndDateTime(lastDateTime)

    this.maxThreads = maxThreads
    this.maxSearchesAvailable = maxSearchesAvailable
    this.lastDateTime = validLastDateTime
    this.lastDateStr = validLastDateStr
    this.lastDate = validLastDate

    this.additonalQueryString = ""
  }

  /**
   * 追加のクエリ文字列を設定する
   * @param {string} additonalQueryString - 追加するクエリ文字列
   */
  setAdditonalQueryString(additonalQueryString){
    this.additonalQueryString = additonalQueryString
  }

  /**
   * 追加のクエリ文字列をクリアする
   */
  clearAdditionalQueryString(){
    this.setAdditonalQueryString("")
  }

  /**
   * 指定された年数前の1年間の日付範囲条件を取得する
   * @param {number} [yearsAgo=0] - 現在から何年前の日付範囲を取得するか（デフォルト: 0 = 今年）
   * @returns {Array} 日付範囲条件の配列 [afterYear, dateRangeString]
   */
  getDateRangeConditionForOneYear(yearsAgo = 0){
    let dateCondition
    if( yearsAgo === 0 ){
      dateCondition = this.makeDateRangeCondition(this.year)       
    }
    else{
      const afterYear = this.year - yearsAgo
      dateCondition = this.makeDateRangeCondition(afterYear, afterYear + 1)
    }
    return dateCondition
  }

  /**
   * 指定された年範囲からGmail検索用の日付範囲条件を生成する
   * @param {number} afterYear - 検索開始年
   * @param {number} [beforeYear=null] - 検索終了年（指定がない場合は無制限）
   * @returns {Array} 日付範囲条件の配列 [afterYear, dateRangeString]
   */
  makeDateRangeCondition(afterYear, beforeYear = null){
    let beforeString = ""

    const afterString = `after:${afterYear}/1/1`
    if( beforeYear !== null){
      beforeString = `before:${beforeYear}/1/1`
    }
    return [afterYear, `${afterString} ${beforeString}`]
  }

  /**
   * 指定された検索方法に対応するクエリ文字列オブジェクトを取得する
   * @param {string} way - 検索方法のキー
   * @returns {string} 対応するGmail検索クエリ文字列オブジェクト
   */
  getQuery(way){
    const mainQueryString = this.assocQuery[way]
    const additionalQueryString = this.additonalQueryString     
    const queryString = `${mainQueryString} ${additionalQueryString}`
    const queryResult = new QueryResult(way, queryString, mainQueryString, additionalQueryString)
    const index = this.queryResultList.add(way, queryResult)
    const queryStringObject = new QueryString(queryString, index)
    YKLiblog.Log.debug(`QueryInfo getQuery way=${way} queryStringObject.string=${queryStringObject.string} queryStringObject.index=${queryStringObject.index}`)

    return queryStringObject
  }
  /**
   * 指定された検索方法に対応するクエリ文字列を取得する
   * @param {string} way - 検索方法のキー
   * @returns {string} 対応するGmail検索クエリ文字列
   */
  getQueryString(way){
    const mainQueryString = this.assocQuery[way]
    const additionalQueryString = this.additonalQueryString 
    const queryString = `${mainQueryString} ${additionalQueryString}`

    return queryString
  }

  /**
   * 指定されたインデックスのクエリ結果を設定する
   * @param {number} index - クエリ結果のインデックス
   * @param {Object} value - 設定するクエリ結果オブジェクト
   */
  setQueryResultByIndex(index, value){
    this.queryResultList.setResultAsObjectByIndex(index, value)
  }
  /**
   * 指定されたインデックスのクエリ結果を取得する
   * @param {number} index - 取得するクエリ結果のインデックス
   * @returns {Object} クエリ結果オブジェクト
   */
  getQueryResultByIndex(index){
    return this.queryResultList.getResultAsObjectByIndex(index)
  }
}
