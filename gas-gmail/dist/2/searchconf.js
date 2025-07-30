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
   * - item[4]: メッセージ数閾値
   */
  constructor(rowIndex, item){
    this.rowIndex = rowIndex

    let currentIndex = 1
    this.index_maxSearchesAvailable = currentIndex++
    const x = item[ this.index_maxSearchesAvailable ]
    const maxSearchesAvailable = parseInt(x, 10)
    this.maxSearchesAvailable = maxSearchesAvailable
    if( isNaN(this.maxSearchesAvailable) ){
      this.maxThreads = 10
    }

    this.index_maxThreads = currentIndex++
    const maxThreads = parseInt(item[ this.index_maxThreads ], 10)
    this.maxThreads = maxThreads
    YKLiblog.Log.debug(`FolderConf item[3]=${item[3]}`)
    if( isNaN(this.maxThreads) ){
      this.maxThreads = 10
    }

    this.index_maxItems = currentIndex++
    const maxItems = parseInt(item[ this.index_maxItems ], 10)
    this.maxItems = maxItems
    if( isNaN(this.maxItems) ){
      this.maxItems = 10
    }

    this.index_threshold = currentIndex++
    const threshold = parseInt(item[ this.index_threshold ], 10)
    this.threshold = threshold
    if( isNaN(this.threshold) ){
      this.threshold = 49
    }

    this.index_naxYearsAgo = currentIndex++
    const maxYearsAgo = parseInt(item[ this.index_maxYearsAgo ], 10)
    this.maxYearsAgo = maxYearsAgo
    if( isNaN(this.maxYearsAgo) ){
      this.maxYearsAgo = 5
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
   * 指定された値がメッセージ数閾値を超えているかチェック
   * @param {number} value - チェックする値
   * @returns {boolean} メッセージ数閾値を超えている場合はtrue、そうでなければfalse
   */
  isBiggerThanThreshold(value){
    const threshold = this.threshold
    const ret = (threshold < value)
    return ret
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
  
  /**
   * メッセージ数閾値取得
   * @returns {number} メッセージ数閾値
   */
  getThreshold(){
    return this.threshold
  }
  
  /**
   * 最大過去年数を取得
   * @returns {number} 最大過去年数
   */
  getMaxYearsAgo(){
    return this.maxYearsAgo
  }
}