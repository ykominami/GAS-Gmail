/**
 * 日付範囲クエリの結果を管理するクラス
 * 特定の年におけるメール検索結果を保持する
 */
class DateRangeQueryResult {
  /**
   * DateRangeQueryResultクラスのコンストラクタ
   * @param {number} year - 検索対象の年
   * @param {Object} query - 検索クエリオブジェクト
   * @param {Array|null} value - 検索結果の値（スレッドの配列またはnull）
   */
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