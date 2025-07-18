class BackupRootFolderConf {
  /**
   * パスのインデックスを取得する
   * @returns {number} パスのインデックス値
   */
  static INDEX_PATH(){
    return 1;
  }
  
  /**
   * フォルダIDのインデックスを取得する
   * @returns {number} フォルダIDのインデックス値
   */
  static INDEX_ID(){
    return 3;
  }
  
  /**
   * URLのインデックスを取得する
   * @returns {number} URLのインデックス値
   */
  static INDEX_URL(){
    return 4;
  }

  /**
   * BackupRootFolderConfクラスのコンストラクタ
   * バックアップルートフォルダの設定を初期化する
   * @param {number} index - アイテムのインデックス
   * @param {Array} item - フォルダ情報を含む配列
   */
  constructor(index, item) {
    this.index = index;
    this.item = item

    const index_path = BackupRootFolderConf.INDEX_PATH() 
    this.path = item[index_path];
    const index_id = BackupRootFolderConf.INDEX_ID()
    const folderId = item[index_id];
    this.folderId = folderId;
    YKLiblog.Log.debug(`index_id=${index_id} folderId=${folderId}`)
    const index_url = BackupRootFolderConf.INDEX_URL()
    this.url = item[index_url];
    this.folder = null;

    YKLiblog.Log.debug(`BackupFolder constructor index=${index} this.path=${this.path} this.folderId=${this.folderId}`);

    if (this.folderId) {
      YKLiblog.Log.debug(`this.folderId=${this.folderId}`);
      try {
        this.folder = DriveApp.getFolderById(this.folderId);
      } catch (e) {
        YKLiblog.Log.unknown(e);
        this.folderId = null;
      }
    }
    if (!this.folderId) {
      this.folder = YKLibb.Gapps.getOrCreateFolderByPathString(this.path);
      if (this.folder !== null) {
        this.folderId = this.folder.getId();
      }
    }
  }
  
  /**
   * フォルダオブジェクトを取得する
   * @returns {GoogleAppsScript.Drive.DriveFolder|null} フォルダオブジェクト、存在しない場合はnull
   */
  getFolder() {
    return this.folder;
  }
}
