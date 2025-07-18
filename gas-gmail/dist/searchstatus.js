class SearchStatus {
  /**
   * SearchStatusクラスのコンストラクタ
   * @param {number} rowIndex - 行のインデックス
   * @param {Array} item - 行のデータ配列
   * @param {Range} rowRange - スプレッドシートの行範囲オブジェクト
   */
  constructor(rowIndex, item, rowRange){
    this.item = item
    this.rowIndex = rowIndex
    this.rowRange = rowRange

    this.index_nth = 1
    this.nth = parseInt(item[ this.index_nth ])
    if( isNaN(this.nth) ){
      this.nth = 0
    }
  }
  
  /**
   * 現在のnth値をitem配列に書き戻す
   */
  rewrite(){
    this.item[this.index_nth] = this.nth
  }
  
  /**
   * スプレッドシートの行範囲にitem配列の値を更新する
   */
  update(){
    this.rowRange.setValues( [this.item] )
  }
  
  /**
   * 現在のnth値を取得する
   * @returns {number} 現在のnth値
   */
  getNth(){
    return this.nth
  }
  
  /**
   * nth値を1増加させる
   */
  incrementNth(){
    this.nth += 1
  }
}
