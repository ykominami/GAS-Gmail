class FolderConf {
  /**
   * FolderConfクラスのコンストラクタ
   * フォルダ設定を初期化し、検索可能数、スレッド数、アイテム数の制限値を設定する
   * @param {number} index - フォルダのインデックス番号
   * @param {Array} item - 設定項目の配列 [nth, maxSearchesAvailable, maxThreads, maxItems]
   */
  constructor(index, item){
    this.index = index
    this.nth = parseInt(item[1])
    this.index_nth = 1
    this.maxSearchesAvailable = parseInt(item[2], 10)
    this.index_maxSearchesAvailable = 2
    this.maxThreads = parseInt(item[3], 10)
    YKLiblog.Log.debug(`FolderConf item[3]=${item[3]}`)
    if( isNaN(this.maxThreads) ){
      this.maxThreads = 10
    }
    this.index_maxThreads = 3
    this.maxItems = parseInt(item[4], 10)
    if( isNaN(this.maxItems) ){
      this.maxItems = 10
    }
    this.index_maxItems = 4
  }
}