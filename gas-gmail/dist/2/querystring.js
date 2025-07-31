/**
 * クエリ文字列を管理するクラス
 * 検索クエリの文字列とそのインデックスを保持する
 */
class QueryString {
  /**
   * QueryStringクラスのコンストラクタ
   * @param {string} string - クエリ文字列
   * @param {number} index - クエリのインデックス
   */
  constructor(string, index){
    this.string = string
    this.index = index
  }
}