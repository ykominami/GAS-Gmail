class RecordSpreadsheet {
  /**
   * RecordSpreadsheetクラスのコンストラクタ
   * 記録スプレッドシートを初期化し、関連するコンポーネントを設定する
   * @param {Spreadsheet} spreadsheet - 記録用のスプレッドシートオブジェクト
   * @param {Object} config - 設定オブジェクト
   */
  constructor(spreadsheet, config){
    this.configSpreadsheet = null

    this.config = config
  
    this.spreadsheet = spreadsheet
    this.registeredEmailList = new RegisteredEmailList(spreadsheet, config)
    //
    const ultimate = true

    const way = YKLibb.Config.COMPLETE()
    const aTableDef = config.getATableDef()
    this.aTable = this.makeHeaderTable(spreadsheet, config.getASheetName(), config, aTableDef, way, ultimate)

    const bTableDef = config.getBTableDef()
    this.bTable = this.makeHeaderTable(spreadsheet, config.getBSheetName(), config, bTableDef, way, ultimate)
  }
  /**
   * ヘッダーテーブルを作成する
   * @param {Spreadsheet} spreadsheet - スプレッドシートオブジェクト
   * @param {string} sheetName - シート名
   * @param {Object} config - 設定オブジェクト
   * @param {Object} tableDef - テーブル定義オブジェクト
   * @param {string} way - テーブルの配置方法
   * @param {boolean} ultimate - 最終的なテーブルかどうか
   * @returns {HeaderTable} 作成されたヘッダーテーブルオブジェクト
   */
  makeHeaderTable(spreadsheet, sheetName, config, tableDef, way, ultimate){
    const sourceHeader = tableDef.getHeader()
    const yklibbConfig = new YKLibb.Config(sourceHeader.length, sourceHeader, way)
    const table = new HeaderTable(spreadsheet, sheetName, config, tableDef, yklibbConfig, ultimate )
    return table
  }

  /**
   * ATableオブジェクトを取得する
   * @returns {ATable} ATableオブジェクト
   */
  getATable(){
    return this.aTable
  }
  
  /**
   * BTableオブジェクトを取得する
   * @returns {BTable} BTableオブジェクト
   */
  getBTable(){
    return this.bTable
  }
  
  /**
   * RegisteredEmailListオブジェクトを取得する
   * @returns {RegisteredEmailList} RegisteredEmailListオブジェクト
   */
  getRegisteredEmailList(){
    return this.registeredEmailList
  }
  
  /**
   * 設定スプレッドシートを追加し、関連する設定を適用する
   * @param {ConfigSpreadsheet} configSpreadsheet - 設定スプレッドシートオブジェクト
   */
  addConfigSpreadsheet(configSpreadsheet){
    this.configSpreadsheet = configSpreadsheet
    this.targetedEmailList = configSpreadsheet.getTargetedEmailList()
    this.registeredEmailList.addTargetedEmailList(this.targetedEmailList)
    this.registeredEmailList.addRegisteredEmailFromTargetedEmailList()
  }
    // 1個の検索対象は、1個のキー(文字列)と対応する
    // クラスTargetedEmailは1個の検索対象を表し、その設定情報は、設定情報ワークシートに設定される（対応するキーを持つ行)
    // クラスTargetedEmailListは全ての検索対象を表し、設定情報ワークシートに対応する。
    // クラスConfigSpreadsheetは、設定情報ワークシートの属するスプレッドシートを表す。
    // クラスConfigTableは、設定情報ワークシートを表す。
    // 検索対象を検索した結果を記録ワークシートに保存する（メッセージIDが重複しないように記録する）
    // クラスRegisteredEmailは、記録ワークシートを表す(ワークシート名は、対応する検索対象のキーと同一)
    // クラスRegisteredEmailListは、すべての記録ワークシートを表す
    // クラスRecordSpreadsheetは、すべての記録ワークシートの属する記録スプレッドシートを表す。
    // 同一のキーを持つ設定情報と検索対象、検索結果記録は対応する

}