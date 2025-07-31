class UtilGmail {
  /**
   * 設定とレコードスプレッドシートを作成し、設定を統合する
   * @param {Object} config - 設定オブジェクト
   */
  static makeAll(config){
    // configSpreadsheet = config.setConfigInfoType(Config.CONFIG_INFO())
    config.setConfigInfoType(Config.CONFIG_INFO2())
    // config.setConfigInfoType(Config.CONFIG_INFOX())
    const configSpreadsheet = UtilGmail.makeConfigSpreassheet(config)
    const recordSpreadsheet = UtilGmail.makeRecordSpreassheet(config)
    recordSpreadsheet.addConfigSpreadsheet(configSpreadsheet)
  }
  /**
   * 設定スプレッドシートを作成する
   * @param {Object} config - 設定オブジェクト
   * @returns {ConfigSpreadsheet} 作成された設定スプレッドシート
   */
  static makeConfigSpreassheet(config){
    const [spreadsheet, _worksheet] = config.getSpreadsheetForConfigSpreadsheet()

    const configSpreadsheet = new ConfigSpreadsheet(spreadsheet, config)
    return configSpreadsheet
  }
  /**
   * レコードスプレッドシートを作成する
   * @param {Object} config - 設定オブジェクト
   * @returns {RecordSpreadsheet} 作成されたレコードスプレッドシート
   */
  static makeRecordSpreassheet(config){
    const [spreadsheet, _worksheet] = config.getSpreadsheetForRecordSpreadsheet()

    const recordSpreadsheet = new RecordSpreadsheet(spreadsheet, config)
    return recordSpreadsheet
  }
  /**
   * 開始インデックスと終了インデックスからインデックス配列を作成する
   * @param {number} startIndex - 開始インデックス
   * @param {number} endIndex - 終了インデックス
   * @param {number} makeindexFlag - インデックス作成フラグ（デフォルト: 0）
   * @returns {Array} [startIndex, endIndex]の配列
   */
  static makeIndex(startIndex, endIndex, makeindexFlag = 0){
    return [startIndex, endIndex]
  }
}

function test_util(){
  YKLiblog.Log.initLogDebug()

  let key
  const idtabledata = UtilGmail.makeIdTabledata()
  const keys = idtabledata.getKeys()
  YKLiblog.Log.debug(`keys=${ keys }`)
  key = keys[0]
  test_util_b(idtabledata, key)
  
  key = "xyz"
  test_util_b(idtabledata, key)
  
}
function test_util_b(idtabledata, key){
  const targetedEmailIds = idtabledata.getTargetedEmailIdsByKey(key)
  const ret = typeof(targetedEmailIds)
  if( ret !== "undefined" ){
    YKLiblog.Log.debug(`done=${ [...targetedEmailIds.done] }`)
  }
}
function test_util_c(){
  YKLiblog.Log.debug()
  const [spreadsheet, _worksheet] = CONFIG.getSpreadsheetForRecordSpreadsheet()
  const recordSpreadsheet = UtilGmail.makeRecordSpreadsheet(spreadsheet, CONFIG)
}
function test_util_d(){
  YKLiblog.Log.debug()
  const [spreadsheet, _worksheet] = CONFIG.getSpreadsheetForConfigSpreadsheet()

  CONFIG.setConfigInfoType(Config.CONFIG_INFO2())
  // CONFIG.setConfigInfoType(Config.CONFIG_INFOX())
  // CONFIG.setConfigInfoType(Config.CONFIG_INFO())
  const configSpreadsheet = UtilGmail.makeConfigSpreadsheet(spreadsheet, CONFIG)
}
