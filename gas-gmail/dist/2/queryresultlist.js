/**
 * クエリ結果のリストを管理するクラス
 * 複数の検索方法（way）とそれに対応するクエリ結果を管理する
 */
class QueryResultList {
  /**
   * QueryResultListクラスのコンストラクタ
   * インデックス、値配列、検索方法のセットを初期化する
   */
  constructor(){
    this.index = 0
    this.yvalues = []
    this.ways = new Set()
    this.indexByWay = {}
  }
  /**
   * クエリ結果をリストに追加する
   * @param {string} way - 検索方法
   * @param {Object} queryResult - 追加するクエリ結果オブジェクト
   * @returns {number} 追加されたクエリ結果のインデックス
   */
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

  /**
   * 指定された検索方法の最新のクエリ結果をオブジェクト形式で取得する
   * @param {string} way - 検索方法
   * @returns {Object|null} クエリ結果のオブジェクト、見つからない場合はnull
   */
  getResultAsObject(way){
    let result = null
    if( this.ways.has(way) ){
      const indexArray = this.indexByWay[way]
      const index = indexArray[indexArray.length - 1]
      result = this.yvalues[index].getResultAsObject()
    }
    return result
  }
  /**
   * 最後に追加されたクエリ結果を取得する
   * @returns {Object} 最後に追加されたクエリ結果
   */
  getLastResult(){
    const lastIndex = this.yvalues.length - 1
    const result = this.yvalues[lastIndex]
    return result
  }

  /**
   * 指定されたインデックスのクエリ結果を設定する
   * @param {number} index - 設定するクエリ結果のインデックス
   * @param {Object} result - 設定するクエリ結果オブジェクト
   */
  setResultAsObjectByIndex(index, result){
    if( index < this.yvalues.lenth ){
      this.yvalues[index].setResultAsObject(result)
    }
  }

  /**
   * 指定されたインデックスのクエリ結果をオブジェクト形式で取得する
   * @param {number} index - 取得するクエリ結果のインデックス
   * @returns {Object|null} クエリ結果のオブジェクト、見つからない場合はnull
   */
  getResultAsObjectByIndex(index){
    let result = null
    if( index < this.yvalues.lenth ){
      result = this.yvalues[index].getResultAsObject()
    }
    return result
  }
}