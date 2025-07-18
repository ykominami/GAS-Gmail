/**
 * BTableクラス - スプレッドシートのテーブルデータを管理するクラス
 * スプレッドシートの特定のシートをテーブルとして扱い、ヘッダーとデータの追加・更新機能を提供する
 */
class BTable{
  /**
   * BTableクラスのコンストラクタ
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet - 対象のスプレッドシート
   * @param {Object} config - テーブル設定オブジェクト
   */
  constructor(spreadsheet, config){
    this.config = config
    this.spreadsheet = spreadsheet
    this.tabledata = null
    const tableDef = config.getBTableDef()
    this.tableDef = tableDef
    this.sourceHeader = tableDef.getHeader()
    this.yklibbConfig = new YKLibb.Config(this.sourceHeader.length, this.sourceHeader, YKLibb.Config.COMPLETE())

    if (spreadsheet && config) {
      // const [worksheet, values, totalRange] = config.getBInfo(spreadsheet)
      // const totalRangeShape = YKLiba.Range.getRangeShape(totalRange)
      // this.configTable = new ConfigTable(values, totalRange);
      const sheetName = config.getBSheetName()
      this.setup(spreadsheet, sheetName, config, tableDef, this.yklibbConfig)
    }
  }
  /**
   * テーブルの初期設定を行う
   * スプレッドシートの指定されたシートを取得または作成し、ヘッダーとデータ範囲を設定する
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet - 対象のスプレッドシート
   * @param {string} sheetName - シート名
   * @param {Object} config - テーブル設定オブジェクト
   * @param {Object} tableDef - テーブル定義オブジェクト
   * @param {Object} yklibbConfig - YKLibb設定オブジェクト
   */
  setup(spreadsheet, sheetName, config, tableDef, yklibbConfig){
    YKLiblog.Log.debug(`RegisteredEmail constructor sheetName=${sheetName}`)
    this.config = config
    this.tableDef = tableDef
    this.yklibbConfig = yklibbConfig

    this.spreadsheet = spreadsheet
    const spreadsheetUrl = spreadsheet.getUrl();

    this.sheetName = sheetName
    const worksheet = YKLibb.Gssx.getOrCreateWorksheet(spreadsheet,sheetName);

    const sheetId = worksheet.getSheetId();
    const sheetUrl = `${spreadsheetUrl}#gid=${sheetId}`;
    this.sheetUrl = sheetUrl

    // ヘッダーが存在しなければ、headerはnull
    const [header, values, headerRange, dataRowsRange, totalRange] = YKLibb.Gssx.setupSpreadsheetAndHeaderAndData(worksheet, yklibbConfig)

    this.worksheet = worksheet
    this.header = header
    this.values = values
    this.totalRange = totalRange
    if( headerRange === null){
      this.headerRange = this.totalRange.offset(0,0, 1, this.tableDef.getHeader().length)
      this.addHeaderAndUpdate()
    }
    else{
      this.headerRange = headerRange
    }

    const width = this.tableDef.getHeader().length
    if( dataRowsRange === null){
      this.dataRowsRange = this.totalRange.offset(1, 0, 1, width)
      YKLiblog.Log.debug(`BTable NULL dataRowsRange=null`)
    }
    else{
      this.dataRowsRange = this.totalRange.offset(this.totalRange.getHeight(),  0, 1, width)
      YKLiblog.Log.debug(`BTable NOT NULL dataRowsRange != null`)
    }
    this.rowIndex = 0
  }
  /**
   * ヘッダーを追加して更新する
   * テーブル定義のヘッダー情報をスプレッドシートのヘッダー範囲に設定する
   */
  addHeaderAndUpdate(){
    this.headerRange.setValues( [this.tableDef.getHeader()] )
  }
  /**
   * データ行を追加して更新する
   * 指定された値の配列をデータ行として追加し、データ範囲を次の行に移動する
   * @param {Array} values - 追加するデータ行の値の配列
   */
  addDataRowAndUpdate(values){
    const rangeShape = YKLiba.Range.getRangeShape(this.dataRowsRange)
    YKLiblog.Log.debug(`BTable addDataRowAndUpdate rangeShape=${ JSON.stringify(rangeShape) }`)
    values.push(rangeShape.r)
    values.push(rangeShape.c)
    values.push(rangeShape.h)
    values.push(rangeShape.w)

    this.dataRowsRange.setValues([values])
    this.dataRowsRange = this.dataRowsRange.offset(1,0) 
    const rangeShape2 = YKLiba.Range.getRangeShape(this.dataRowsRange)
    YKLiblog.Log.debug(`BTable addDataRowAndUpdate rangeShape2=${ JSON.stringify(rangeShape2) }`)
  }
}