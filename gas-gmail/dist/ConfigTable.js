class ConfigTable {
  /**
   * ConfigTableクラスのコンストラクタ
   * 設定テーブルの値を解析し、各種設定オブジェクトを初期化する
   * @param {Array} values - 設定テーブルの行データの配列
   * @param {Range} totalRange - 設定テーブルの全体範囲
   * @throws {Error} searchStatusまたはsearchConfが作成できない場合
   */
  constructor(values, totalRange){
    YKLiblog.Log.debug(`values=${values}`)
    this.values = values
    this.totalRange = totalRange
    const totalRangeShape = YKLiba.Range.getRangeShape(totalRange)
    this.totalRangeShape = totalRangeShape

    this.backupFolderConf = null;
    this.searchConf = null;
    this.searchStatus = null;

    const targetedEmailList = new TargetedEmailList()
    YKLiblog.Log.debug(`targetedEmailList.getKeys()=${targetedEmailList.getKeys()}`)
    this.targetedEmailList = targetedEmailList;
    this.processRows(values)
    if( !this.searchStatus ){
      throw new Error("Can't make searchStatus")
    }
    if( !this.searchConf ){
      throw new Error("Can't make searchConf")
    }
  }
  /**
   * 設定テーブルの値を取得する
   * @returns {Array} 設定テーブルの行データの配列
   */
  getValues(){
    return this.values
  }
  /**
   * バックアップルートフォルダの設定を取得する
   * @returns {BackupRootFolderConf|null} バックアップルートフォルダの設定オブジェクト
   */
  getBackupRootFolderConf(){
    return this.backupRootFolderConf
  }
  /**
   * 設定テーブルの行データを処理し、各種設定オブジェクトを作成する
   * @param {Array} values - 処理する行データの配列
   */
  processRows(values){
    for(let i=0; i<values.length; i++){
      const item = values[i];
      const rowRange = this.totalRange.offset(i,0, 1)
      // YKLiblog.Log.debug(`ConfigTable processRows i=${i} item=${item}`)
      switch(item[0]){
        case "backup_root_folder":
          YKLiblog.Log.debug(`ConfigTable processRows i=${i} backup_root_folder`)
          this.backupRootFolderConf = new BackupRootFolderConf(i, item);
          this.targetedEmailList.setBackupRootFolderConf(this.backupRootFolderConf)
          break;
        case "search_conf":
          YKLiblog.Log.debug(`ConfigTable processRows i=${i} search_conf`)
          this.searchConf = new SearchConf(i, item);
          this.targetedEmailList.setSearchConf(this.searchConf)
          break;
        case "search_status":
          YKLiblog.Log.debug(`ConfigTable processRows i=${i} search_status`)
          this.searchStatus = new SearchStatus(i, item, rowRange);
          this.targetedEmailList.setSearchStatus(this.searchStatus)
          break;
        case "folder":
          YKLiblog.Log.debug(`ConfigTable processRows i=${i} folder`)
          this.targetedEmailList.addTargetedEmail(i, item, rowRange)
          break;
        defualt:
          YKLiblog.Log.debug(`ConfigTable processRows i=${i} default`)
          break;
      }
    }
  }
  /**
   * 検索設定を取得する
   * @returns {SearchConf|null} 検索設定オブジェクト
   */
  getSearchConf(){
    return this.searchConf
  }
  /**
   * 検索ステータスを取得する
   * @returns {SearchStatus|null} 検索ステータスオブジェクト
   */
  getSearchStatus(){
    return this.searchStatus
  }
  /**
   * 対象メールリストを取得する
   * @returns {TargetedEmailList} 対象メールリストオブジェクト
   */
  getTargetedEmailList(){
    return this.targetedEmailList
  }
  /**
   * バックアップフォルダの設定を取得する
   * @returns {BackupRootFolderConf|null} バックアップフォルダの設定オブジェクト
   */
  getBackupFolderConf(){
    return this.backupFolderConf
  }
  /**
   * 指定されたキーに対応する対象メールを取得する
   * @param {string} key - 対象メールを識別するキー
   * @returns {TargetedEmail|null} 対象メールオブジェクト
   */
  getTargetedEmail(key){
    return this.targetedEmailList.getTargetedEmailByKey(key);
  }
}
