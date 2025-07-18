/**
 * 設定情報を管理するクラス
 * Google Apps Scriptのプロパティサービスから設定値を取得し、
 * スプレッドシートやテーブル定義の管理を行う
 */
class Config {
  /**
   * 設定情報タイプ: CONFIG_INFOX
   * @returns {string} 設定情報タイプの識別子
   */
  static CONFIG_INFOX() {
    return "CONFIG_INFOX"
  }
  /**
   * 設定情報タイプ: CONFIG_INFO2
   * @returns {string} 設定情報タイプの識別子
   */
  static CONFIG_INFO2() {
    return "CONFIG_INFO2"
  }
  /**
   * 設定情報タイプ: CONFIG_INFO
   * @returns {string} 設定情報タイプの識別子
   */
  static CONFIG_INFO() {
    return "CONFIG_INFO"
  }
  /**
   * Configクラスのコンストラクタ
   * スクリプトプロパティから設定値を読み込み、テーブル定義を初期化する
   * @param {string|null} option - オプション設定（"noop"の場合、noopモードを有効にする）
   */
  constructor(option = null){
    this.limit = 2
    this.configSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_SPREADSHEET_ID');
    this.idsSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_IDS_SHEETNAME');

    this.configInfoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SPREADSHEET_ID');
    this.configInfoxSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFOX_SHEETNAME');
    this.configInfo2SheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO2_SHEETNAME');
    this.configInfoSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SHEETNAME');
    this.bSheetName = '_B';
    this.docParentFolderId = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_ID');
    this.docParentFolderPath = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_PATH');
    this.infoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('INFO_SPREADSHEET_ID');
    this.infoWorksheetName = PropertiesService.getScriptProperties().getProperty('INFO_WORKSHEET_NAME');
    this.limitx = PropertiesService.getUserProperties().getProperty('CELL_CONTENT_LIMIT');
    this.limit = parseInt(this.limitx) - 1
    this.clearFlag = false

    this.registeredEmailTableDef = this.makeRegisteredEmailTableDef()
    this.bTableDef = this.makeBTableDef()

    this.noop = false
    if( option == "noop"){
      this.noop = true
    }
  }
  /**
   * クリアフラグを設定する
   * @param {boolean} value - クリアフラグの値（デフォルト: false）
   */
  setClearFlag(value=false){
    this.clearFlag = value
  }
  /**
   * クリアフラグの値を取得する
   * @returns {boolean} クリアフラグの値
   */
  getClearFlag(){
    return this.clearFlag
  }
  /**
   * noopモードかどうかを判定する
   * @returns {boolean} noopモードの場合true、そうでなければfalse
   */
  isNoop(){
    return this.noop
  }
  /**
   * noopモードを設定する
   * @param {boolean} value - noopモードの設定値
   */
  setNoop(value){
    this.noop = value
  }
  /**
   * レコード用スプレッドシートを取得する
   * @returns {Array} [spreadsheet, worksheet] の配列
   */
  getSpreadsheetForRecordSpreadsheet(){
    const [spreadsheet, _worksheet] = YKLiba.Base.getSpreadsheet(this.configSpreadsheetId)
    return [spreadsheet, _worksheet]
  }
  /**
   * 設定用スプレッドシートを取得する
   * @returns {Array} [spreadsheet, worksheet] の配列
   */
  getSpreadsheetForConfigSpreadsheet(){
    const [spreadsheet, _worksheet] = YKLiba.Base.getSpreadsheet(this.configInfoSpreadsheetId)
    return [spreadsheet, _worksheet]
  }

  /**
   * 登録済みメールテーブル定義を取得する
   * @returns {Config.TableDef} 登録済みメールテーブル定義
   */
  getRegisteredEmailTableDef(){
    return this.registeredEmailTableDef
  }
  /**
   * Bテーブル定義を取得する
   * @returns {Config.TableDef} Bテーブル定義
   */
  getBTableDef(){
    return this.bTableDef
  }
  /**
   * 登録済みメールテーブル定義を作成する
   * @returns {Config.TableDef} 作成されたテーブル定義
   */
  makeRegisteredEmailTableDef(){
    const nameOfId = "id"
    const header = [nameOfId, "from", "subject", "dateStr", "plainBody"]
    const tableDef = new Config.TableDef(header, nameOfId)
    return tableDef
  }
  /**
   * Bテーブル定義を作成する
   * @returns {Config.TableDef} 作成されたテーブル定義
   */
  makeBTableDef(){
    const nameOfId = "name"
    const header = [nameOfId, "condition", "query", "existingMsgCount", "existingMsgCount2", "existing_id", "existing_id2", "within", "within_id", "remain", "nth", "way", "r", "c", "h", "w"]
    const tableDef = new Config.TableDef(header, nameOfId)
    return tableDef
  }
  /**
   * 設定情報タイプを設定する
   * @param {string} value - 設定情報タイプ
   */
  setConfigInfoType(value){
    this.configInfoType = value
  }
  /**
   * 設定情報タイプを取得する
   * @returns {string} 設定情報タイプ
   */
  getConfigInfoType(){
    return this.configInfoType
  }
  /**
   * 設定情報タイプに応じて適切な設定情報を取得する
   * @param {Spreadsheet} spreadsheet - スプレッドシートオブジェクト
   * @returns {Array} [worksheet, values, totalRange] の配列
   */
  getConfigInfo(spreadsheet){
    const configInfoType = this.getConfigInfoType()
    if( configInfoType == Config.CONFIG_INFO() ){
      return this.ConfigInfo(spreadsheet)
    }
    else if( configInfoType == Config.CONFIG_INFO2() ){
      return this.ConfigInfo2(spreadsheet)
    }
    else{
      return this.ConfigInfox(spreadsheet)
    }
  }
  /**
   * Bシート名を取得する
   * @returns {string} Bシート名
   */
  getBSheetName(){
    return this.bSheetName
  }
  /**
   * CONFIG_INFOXタイプの設定情報を取得する
   * @param {Spreadsheet} spreadsheet - スプレッドシートオブジェクト
   * @returns {Array} [worksheet, values, totalRange] の配列
   */
  ConfigInfox(spreadsheet){
    YKLiblog.Log.debug(`configInfoxSheetName=${this.configInfoxSheetName}`)
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfoxSheetName)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  /**
   * CONFIG_INFOタイプの設定情報を取得する
   * @param {Spreadsheet} spreadsheet - スプレッドシートオブジェクト
   * @returns {Array} [worksheet, values, totalRange] の配列
   */
  ConfigInfo(spreadsheet){
    YKLiblog.Log.debug(`configInfoSheetName=${this.configInfoSheetName}`)
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfoSheetName)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  /**
   * CONFIG_INFO2タイプの設定情報を取得する
   * @param {Spreadsheet} spreadsheet - スプレッドシートオブジェクト
   * @returns {Array} [worksheet, values, totalRange] の配列
   */
  ConfigInfo2(spreadsheet){
    YKLiblog.Log.debug(`configInfo2SheetName=${this.configInfo2SheetName}`)
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfo2SheetName)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  /**
   * レコードスプレッドシートを取得する
   * @returns {Array} [spreadsheet, worksheet, values, totalRange] の配列
   */
  getRecordSpreadsheet(){
    YKLiblog.Log.debug(`configSpreadsheetId=${this.configSpreadsheetId}`)
    const [_spreadsheet, worksheet, values, totalRange] = YKLibb.Gssx.setupSpeadsheetValues(this.configSpreadsheetId, this.configInfo2SheetName)
    YKLiblog.Log.debug(`getConfigInfo2 values=${values}`)
    return [_spreadsheet, worksheet, values, totalRange]
  }
  /**
   * 設定スプレッドシートを取得する
   * @returns {Array} [spreadsheet, worksheet, values, totalRange] の配列
   */
  getConfigSpreadsheet(){
    YKLiblog.Log.debug(`configInfoSpreadsheetId=${this.configInfoSpreadsheetId}`)
    const [_spreadsheet, worksheet, values, totalRange] = YKLibb.Gssx.setupSpeadsheetValues(this.configInfoSpreadsheetId, this.configInfo2SheetName)
    YKLiblog.Log.debug(`getConfigInfo2 values=${values}`)
    return [_spreadsheet, worksheet, values, totalRange]
  }
  /**
   * 制限なしを表す値を取得する
   * @returns {number} 制限なしを表す値（-1）
   */
  nolimit(){
    return -1
  }
}
/**
 * テーブル定義を管理する内部クラス
 * ヘッダー情報とID列の位置を管理する
 */
Config.TableDef = class {
  /**
   * TableDefクラスのコンストラクタ
   * @param {Array} header - ヘッダー行の配列
   * @param {string} nameOfId - ID列の名前
   */
  constructor( header, nameOfId ){
    this.header = header
    this.nameOfId = nameOfId
    this.indexOfId = header.indexOf(nameOfId)    
  }
  /**
   * ヘッダー配列を取得する
   * @returns {Array} ヘッダー配列
   */
  getHeader(){
    return this.header
  }
  /**
   * ID列の名前を取得する
   * @returns {string} ID列の名前
   */
  getNameOfId(){
    return this.nameOfId
  }
  /**
   * ID列のインデックスを取得する
   * @returns {number} ID列のインデックス
   */
  getIndexOfId(){
    return this.indexOfId
  }
}

CONFIG = new Config("noop")

