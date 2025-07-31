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
  static CONFIG_INFO1() {
    return "CONFIG_INFO1"
  }
  /**
   * 設定情報タイプ: CONFIG_INFO
   * @returns {string} 設定情報タイプの識別子
   */
  static CONFIG_INFO() {
    return "CONFIG_INFO"
  }
  /**
   * 設定情報タイプ: CONFIG_INFO4
   * @returns {string} 設定情報タイプの識別子
   */
  static CONFIG_INFO4() {
    return "CONFIG_INFO4"
  }
  /**
   * Configクラスのコンストラクタ
   * スクリプトプロパティから設定値を読み込み、テーブル定義を初期化する
   * @param {string|null} option - オプション設定（"noop"の場合、noopモードを有効にする）
   */
  constructor(option = null){
    this.configInfoTypeArray = [Config.CONFIG_INFO(), Config.CONFIG_INFO1(), Config.CONFIG_INFO2(), Config.CONFIG_INFO4(), Config.CONFIG_INFOX()]

    this.limit = 2
    this.configSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_SPREADSHEET_ID');
    this.idsSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_IDS_SHEETNAME');

    this.configInfoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SPREADSHEET_ID');
    this.configInfo1SheetName = 'INFO1';
    this.configInfoxSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFOX_SHEETNAME');
    this.configInfo2SheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO2_SHEETNAME');
    this.configInfo4SheetName = "INFO4";
    this.configInfoSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SHEETNAME');
    this.aSheetName = '_A';
    this.bSheetName = '_B';
    this.docParentFolderId = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_ID');
    this.docParentFolderPath = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_PATH');
    this.infoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('INFO_SPREADSHEET_ID');
    this.infoWorksheetName = PropertiesService.getScriptProperties().getProperty('INFO_WORKSHEET_NAME');
    this.limitx = PropertiesService.getUserProperties().getProperty('CELL_CONTENT_LIMIT');
    this.limit = parseInt(this.limitx) - 1
    this.clearFlag = false

    this.registeredEmailTableDef = this.makeRegisteredEmailTableDef()
    this.aTableDef = this.makeATableDef()
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
   * Aテーブル定義を取得する
   * @returns {Config.TableDef} Aテーブル定義
   */
  getATableDef(){
    return this.aTableDef
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
    const header = [nameOfId, "from", "subject", "dateStr", "plainBody", "date"]
    const tableDef = new Config.TableDef(header, nameOfId)
    return tableDef
  }
  /**
   * Aテーブル定義を作成する
   * @returns {Config.TableDef} 作成されたテーブル定義
   */
  makeATableDef(){
    const nameOfId = "name"
    const header = [nameOfId, "count", "condtion", "url"]
    const tableDef = new Config.TableDef(header, nameOfId)
    return tableDef
  }
  /**
   * Bテーブル定義を作成する
   * @returns {Config.TableDef} 作成されたテーブル定義
   */
  makeBTableDef(){
    const nameOfId = "name"
    // const header = [nameOfId, "condition", "query", "existingMsgCount", "existingMsgCount2", "existing_id", "existing_id2", "messageSize", "within", "nth", "way", "r", "c", "h", "w"]
    const header = [nameOfId, "condition", "query", "existingMsgCount", "existingMsgCount2", "existing_id", "existing_id2", "messageSize", "within", 
    "numberOfthreadsOfTargetLabel",
    "numberOfThreadsOfEndLabel",
    "numberOfthreadsOfTargetLabelRetry",
    "nth", "way"]
    const tableDef = new Config.TableDef(header, nameOfId)
    return tableDef
  }
  /**
   * 設定情報タイプを設定する
   * @param {string} value - 設定情報タイプ
   */
  setConfigInfoType(value){
    if( this.configInfoTypeArray.includes(value) ){
      this.configInfoType = value
    }
    else{
      this.configInfoType = null
    }
    return this.configInfoType
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
    else if( configInfoType == Config.CONFIG_INFO1() ){
      return this.ConfigInfo1(spreadsheet)
    }
    else if( configInfoType == Config.CONFIG_INFO2() ){
      return this.ConfigInfo2(spreadsheet)
    }
    else if( configInfoType == Config.CONFIG_INFO4() ){
      return this.ConfigInfo4(spreadsheet)
    }
    else{
      return this.ConfigInfox(spreadsheet)
    }
  }
  /**
   * Aシート名を取得する
   * @returns {string} Aシート名
   */
  getASheetName(){
    return this.aSheetName
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
    const ultimate = false
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfoxSheetName, ultimate)
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
    const ultimate = false
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfoSheetName, ultimate)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  /**
   * CONFIG_INFO1タイプの設定情報を取得する
   * @param {Spreadsheet} spreadsheet - スプレッドシートオブジェクト
   * @returns {Array} [worksheet, values, totalRange] の配列
   */
  ConfigInfo1(spreadsheet){
    YKLiblog.Log.debug(`configInfo1SheetName=${this.configInfo1SheetName}`)
    const ultimate = false
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfo1SheetName, ultimate)
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
    const ultimate = false
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfo2SheetName, ultimate)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  /**
   * CONFIG_INFO4タイプの設定情報を取得する
   * @param {Spreadsheet} spreadsheet - スプレッドシートオブジェクト
   * @returns {Array} [worksheet, values, totalRange] の配列
   */
  ConfigInfo4(spreadsheet){
    YKLiblog.Log.debug(`configInfo4SheetName=${this.configInfo4SheetName}`)
    const ultimate = false
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfo4SheetName, ultimate)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
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

