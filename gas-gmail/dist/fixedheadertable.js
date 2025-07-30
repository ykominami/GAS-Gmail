/**
 * FixedHeaderTableクラス - スプレッドシートのテーブルデータを管理するクラス
 * スプレッドシートの特定のシートをテーブルとして扱い、ヘッダーとデータの追加・更新機能を提供する
 */
class FixedHeaderTable extends HeaderTable{
  /**
   * FixedHeaderTableクラスのコンストラクタ
   * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet - 対象のスプレッドシート
   * @param {String} sheetName - シート名
   * @param {Object} config - テーブル設定オブジェクト
   * @param {Object} tableDef - テーブル定義オブジェクト
   */
  constructor(spreadsheet, sheetName, config, tableDef, ultimate){
    if( typeof(ultimate) !== "boolean" ){
      throw new Error(`${ typeof(ultimate) } ultimate is not boolean`)
    }
    const sourceHeader = tableDef.getHeader()
    const yklibbConfig = new YKLibb.Config(sourceHeader.length, sourceHeader, YKLibb.Config.COMPLETE())
    super(spreadsheet, sheetName, config, tableDef, yklibbConfig, ultimate)
  }
}