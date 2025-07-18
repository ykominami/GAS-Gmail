/**
 * 検索設定を管理するクラス
 * スプレッドシートの行データから検索に関する設定値を取得・管理する
 */
class SearchConf {
  /**
   * 検索設定クラスのコンストラクタ
   * @param {number} rowIndex - スプレッドシートの行インデックス
   * @param {Array} item - スプレッドシートの行データ配列
   * 配列の要素:
   * - item[1]: 最大検索可能回数
   * - item[2]: 最大スレッド数
   * - item[3]: 最大アイテム数
   */
  constructor(rowIndex, item){
    this.rowIndex = rowIndex

    this.index_maxSearchesAvailable = 1
    this.maxSearchesAvailable = parseInt(item[ this.index_maxSearchesAvailable ], 10)
    if( isNaN(this.maxSearchesAvailable) ){
      this.maxThreads = 10
    }

    this.index_maxThreads = 2
    this.maxThreads = parseInt(item[ this.index_maxThreads ], 10)
    YKLiblog.Log.debug(`FolderConf item[3]=${item[3]}`)
    if( isNaN(this.maxThreads) ){
      this.maxThreads = 10
    }

    this.index_maxItems = 3
    this.maxItems = parseInt(item[ this.index_maxItems ], 10)
    if( isNaN(this.maxItems) ){
      this.maxItems = 10
    }
  }
  
  /**
   * 指定された値が最大アイテム数を超えているかチェック
   * @param {number} value - チェックする値
   * @returns {boolean} 最大アイテム数を超えている場合はtrue、そうでなければfalse
   */
  isBiggerThanMaxItems(value){
    return (this.maxItems < value)
  }
  
  /**
   * 最大検索可能回数を取得
   * @returns {number} 最大検索可能回数
   */
  getMaxSearchesAvailable(){
    return this.maxSearchesAvailable
  }
  
  /**
   * 最大スレッド数を取得
   * @returns {number} 最大スレッド数
   */
  getMaxThreads(){
    return this.maxThreads
  }
  
  /**
   * 最大アイテム数を取得
   * @returns {number} 最大アイテム数
   */
  getMaxItems(){
    return this.maxItems
  }
}