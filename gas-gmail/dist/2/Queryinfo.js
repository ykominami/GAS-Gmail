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
  constructor(from, pairLabel, maxThreads, maxSearchesAvailable, lastDateTime, ways ){
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
  }
  
  /**
   * 指定された検索方法に対応するクエリ文字列を取得する
   * @param {string} way - 検索方法のキー
   * @returns {string} 対応するGmail検索クエリ文字列
   */
  getQueryString(way){
    const queryString = this.assocQuery[way]
    YKLiblog.Log.debug(`QueryInfo getQueryString way=${way} queryString=${queryString}`)
    return queryString
  }
}
