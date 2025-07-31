class ConfigSpreadsheet {
  /**
   * ConfigSpreadsheetクラスのコンストラクタ
   * @param {Object} spreadsheet - スプレッドシートオブジェクト
   * @param {Object} config - 設定オブジェクト
   */
  constructor(spreadsheet, config) {
    // this.spreadsheet = spreadsheet; // 必要なら保存
    // this.config = config;           // 必要なら保存
    this.configTable = null;
    if (spreadsheet && config) {
      const [worksheet, values, totalRange] = config.getConfigInfo(spreadsheet)
      const totalRangeShape = YKLiba.Range.getRangeShape(totalRange)
      this.configTable = new ConfigTable(values, totalRange);
    }
  }

  /**
   * ConfigTableインスタンスを取得する
   * @returns {ConfigTable} ConfigTableインスタンス
   * @throws {Error} ConfigTableが初期化されていない場合
   */
  getConfigTable() {
    if (!this.configTable) {
      throw new Error('ConfigTable is not initialized.');
    }
    return this.configTable;
  }

  /**
   * ターゲットメールリストのキーを取得する
   * @returns {Array} キーの配列
   */
  getKeys(){
    const targetedEmailList = this.getTargetedEmailList() 
    const keys = targetedEmailList.getKeys()
    return keys
  }

  /**
   * ターゲットメールリストを取得する
   * @returns {Object} ターゲットメールリストオブジェクト
   * @throws {Error} ConfigTableが初期化されていない場合
   */
  getTargetedEmailList() {
    if (!this.configTable) {
      throw new Error('ConfigTable is not initialized.');
    }
    return this.configTable.getTargetedEmailList();
  }

  /**
   * 指定されたキーに対応するターゲットメールを取得する
   * @param {string} key - 検索するキー
   * @returns {Object} ターゲットメールオブジェクト
   * @throws {Error} TargetedEmailListが利用できない場合
   */
  getTargetedEmailByKey(key) {
    const targetedEmailList = this.getTargetedEmailList();
    if (!targetedEmailList) {
      throw new Error('TargetedEmailList is not available.');
    }
    return targetedEmailList.getTargetedEmailByKey(key);
  }
}