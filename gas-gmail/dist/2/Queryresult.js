/**
 * クエリの実行結果を管理するクラス
 * オブジェクト形式と文字列形式で結果を保持・取得する機能を提供する
 */
class QueryResult {
  /**
   * オブジェクト形式の結果を表すキーを返す
   * @returns {string} オブジェクト形式の結果を表すキー
   */
  static OBJECT(){
    return "OBJECT"
  }
  
  /**
   * 文字列形式の結果を表すキーを返す
   * @returns {string} 文字列形式の結果を表すキー
   */
  static STRING(){
    return "STRING"
  }
  
  /**
   * QueryResultクラスのコンストラクタ
   * @param {string} way - 検索方法
   * @param {string} queryString - クエリ文字列
   * @param {string} mainQueryString - メインのクエリ文字列
   * @param {string} additionalQueryString - 追加のクエリ文字列
   */
  constructor(way, queryString, mainQueryString, additionalQueryString){
    this.xresult = {}
    this.way = way
    this.queryString = queryString
    this.mainQueryString = mainQueryString
    this.additionalQueryString = additionalQueryString
  }
  
  /**
   * オブジェクト形式で結果を設定する
   * @param {Object} value - 設定するオブジェクト
   */
  setResultAsObject(value){
    const key = QueryResult.OBJECT()
    this.setResult(key, value)
  }
  
  /**
   * 文字列形式で結果を設定する
   * @param {string} value - 設定する文字列
   */
  setResultAsString(value){
    const key = QueryResult.STRING()
    this.setResult(key, value)
  }
  
  /**
   * 指定されたキーで結果を設定する
   * @param {string} key - 結果を格納するキー
   * @param {*} value - 設定する値
   */
  setResult(key, value){
    this.xresult[key] = value 
  }
  
  /**
   * オブジェクト形式の結果を取得する
   * @returns {Object} オブジェクト形式の結果
   */
  getResultAsObject(){
    const key = QueryResult.OBJECT()
    return this.getResult(key)
  }
  
  /**
   * 文字列形式の結果を取得する
   * @returns {string} 文字列形式の結果
   */
  getResultAsString(){
    const key = QueryResult.STRING()
    return this.getResult(key)
  }
  
  /**
   * 指定されたキーで結果を取得する
   * @param {string} key - 取得する結果のキー
   * @returns {*} キーに対応する値
   */
  getResult(key){
    return this.xresult[key] 
  }
}