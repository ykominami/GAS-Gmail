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
    const x_maxSearchesAvailable = item[ this.index_maxSearchesAvailable ]
    const maxSearchesAvailable = parseInt(x_maxSearchesAvailable, 10)
    this._maxSearchesAvailable = maxSearchesAvailable
    if( isNaN(this._maxSearchesAvailable) ){
      this._maxSearchesAvailable = 10
    }

    this.index_maxThreads = currentIndex++
    const x_maxThreads = item[ this.index_maxThreads ]
    const maxThreads = parseInt(x_maxThreads , 10)
    this.maxThreads = maxThreads
    if( isNaN(this.maxThreads) ){
      this.maxThreads = 10
    }

    this.index_maxItems = currentIndex++
    const x_maxItems = item[ this.index_maxItems ]
    const maxItems = parseInt(x_maxItems, 10)
    this.x_maxItems = maxItems
    if( isNaN(this.x_maxItems) ){
      this.x_maxItems = 10
    }

    this.index_threshold = currentIndex++
    const x_threshold = item[ this.index_threshold ]
    const threshold = parseInt(x_threshold, 10)
    this.x_threshold = threshold
    if( isNaN(this.x_threshold) ){
      this.x_threshold = 49
    }

    this.index_naxYearsAgo = currentIndex++
    const x_maxYearsAgo = item[ this.index_naxYearsAgo ]
    const maxYearsAgo = parseInt(x_maxYearsAgo, 10)
    this.x_maxYearsAgo = maxYearsAgo
    if( isNaN(this.x_maxYearsAgo) ){
      this.x_maxYearsAgo = 5
    }
  }
  
  /**
   * 指定された値が最大アイテム数を超えているかチェック
   * @param {number} value - チェックする値
   * @returns {boolean} 最大アイテム数を超えている場合はtrue、そうでなければfalse
   */
  isBiggerThanMaxItems(value){
    const maxItems = this.getMaxItems()
    const ret = (maxItems < value)
    return ret
  }
  
  /**
   * 指定された値がメッセージ数閾値を超えているかチェック
   * @param {number} value - チェックする値
   * @returns {boolean} メッセージ数閾値を超えている場合はtrue、そうでなければfalse
   */
  isBiggerThanThreshold(value){
    const threshold = this.getThreshold()
    const ret = (threshold < value)
    return ret
  }
  
  /**
   * 最大検索可能回数を取得
   * @returns {number} 最大検索可能回数
   */
  getMaxSearchesAvailable(){
    return this.x_maxSearchesAvailable
  }
  
  /**
   * 最大スレッド数を取得
   * @returns {number} 最大スレッド数
   */
  getMaxThreads(){
    return this.x_maxThreads
  }
  
  /**
   * 最大アイテム数を取得
   * @returns {number} 最大アイテム数
   */
  getMaxItems(){
    return this.x_maxItems
  }
  
  /**
   * メッセージ数閾値取得
   * @returns {number} メッセージ数閾値
   */
  getThreshold(){
    return this.x_threshold
  }
  
  /**
   * 最大過去年数を取得
   * @returns {number} 最大過去年数
   */
  getMaxYearsAgo(){
    return this.x_maxYearsAgo
  }
}