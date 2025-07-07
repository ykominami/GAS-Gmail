class UtilGmail {
  static makeAll(config){
    // configSpreadsheet = config.setConfigInfoType(Config.CONFIG_INFO())
    config.setConfigInfoType(Config.CONFIG_INFO2())
    // config.setConfigInfoType(Config.CONFIG_INFOX())
    const configSpreadsheet = UtilGmail.makeConfigSpreassheet(config)
    const recordSpreadsheet = UtilGmail.makeRecordSpreassheet(config, configSpreadsheet)
    recordSpreadsheet.addConfigSpreadsheet(configSpreadsheet)
  }
  static makeRecordSpreassheet(config, configSpreadsheet){
    const [spreadsheet, _worksheet] = config.getSpreadsheetForRecordSpreadsheet()

    const recordSpreadsheet = new RecordSpreadsheet(spreadsheet, config)
    recordSpreadsheet.addConfigSpreadsheet(configSpreadsheet)
    return recordSpreadsheet
  }
  static makeConfigSpreassheet(config){
    const [spreadsheet, _worksheet] = config.getSpreadsheetForConfigSpreadsheet()

    const configSpreadsheet = new ConfigSpreadsheet(spreadsheet, config)
    return configSpreadsheet
  }
/*
  static makeTabledata2(){
    CONFIG.setConfigInfoType(Config.CONFIG_INFO2)
    const tabledata = new Tabledata(CONFIG);
    return tabledata
  }
  static makeTabledata(){
    CONFIG.setConfigInfoType(Config.CONFIG_INFOX)
    const tabledata = new Tabledata(CONFIG);
    return tabledata
  }
  static makeIdTabledata(){
    YKLiblog.Log.initLogDebug()

    const idtabledata = new IdTabledata(CONFIG);
    return idtabledata
  }
*/
  static makeIndex(startIndex, limitx, makeindexFlag = 0){
    if (typeof startIndex !== 'number' || typeof limitx !== 'number') {
      UtilGmail.safeLogDebug('makeIndex: startIndex or limitx is not a number');
      return [0, 0];
    }
    return [startIndex, limitx]
  }
  static safeLogDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[UtilGmail] ${message}`);
      }
    } catch (error) {
      console.log(`[UtilGmail] Log error: ${error.message}`);
    }
  }
}

function test_makeIdTabledata(){
  YKLiblog.Log.initLogDebug()

  const tabledata = UtilGmail.makeIdTabledata()
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
function test_x(){
  
  let [spreadsheet, _worksheet] = CONFIG.getSpreadsheetForRecordSpreadsheet()
  let [worksheet, header, values, totalRange, headerRange, dataRange] = CONFIG.getRecordIds(spreadsheet)
  let dataRowsRange

  const [spreadsheet2, _worksheet2] = CONFIG.getSpreadsheetForConfigSpreadsheet()

  CONFIG.setConfigInfoType(Config.CONFIG_INFO())
  const [worksheetA, valuesA, totalRangeA] = CONFIG.getConfigInfo(spreadsheet2)
  YKLiblog.Log.debug(`valuesA=${valuesA}`)
  CONFIG.setConfigInfoType(Config.CONFIG_INFO2())
  const [worksheetB, valuesB, totalRangeB] = CONFIG.getConfigInfo(spreadsheet2)
  YKLiblog.Log.debug(`valuesB=${valuesB}`)
  CONFIG.setConfigInfoType(Config.CONFIG_INFOX())
  const [worksheetC, valuesC, totalRangeC] = CONFIG.getConfigInfo(spreadsheet2)
  YKLiblog.Log.debug(`valuesC=${valuesC}`)
}
function test_z(){
  const config = new Config()
  UtilGmail.makeAll(config)
}
