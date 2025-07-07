class Config {
  constructor(option = null){
    this.limit = 2;
    if (typeof PropertiesService === 'undefined' || !PropertiesService.getScriptProperties || typeof PropertiesService.getScriptProperties !== 'function') {
      this.safeLogDebug('constructor: PropertiesService.getScriptProperties is not available');
      this.configSpreadsheetId = '';
      this.idsSheetName = '';
      this.configInfoSpreadsheetId = '';
      this.configInfoxSheetName = '';
      this.configInfo2SheetName = '';
      this.docParentFolderId = '';
      this.docParentFolderPath = '';
      this.infoSpreadsheetId = '';
      this.infoWorksheetName = '';
    } else {
      this.configSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_SPREADSHEET_ID');
      this.idsSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_IDS_SHEETNAME');
      this.configInfoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SPREADSHEET_ID');
      this.configInfoxSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFOX_SHEETNAME');
      this.configInfo2SheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO2_SHEETNAME');
      this.docParentFolderId = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_ID');
      this.docParentFolderPath = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_PATH');
      this.infoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('INFO_SPREADSHEET_ID');
      this.infoWorksheetName = PropertiesService.getScriptProperties().getProperty('INFO_WORKSHEET_NAME');
    }
    if (typeof PropertiesService === 'undefined' || !PropertiesService.getUserProperties || typeof PropertiesService.getUserProperties !== 'function') {
      this.safeLogDebug('constructor: PropertiesService.getUserProperties is not available');
      this.limit = 1;
    } else {
      const cellLimit = PropertiesService.getUserProperties().getProperty('CELL_CONTENT_LIMIT');
      this.limit = (typeof cellLimit === 'number' ? cellLimit : parseInt(cellLimit, 10)) - 1;
    }
    const headerId = "id";
    this.headers = [headerId, "from", "subject", "dateStr", "plainBody"];
    this.headerId = headerId;
    this.noop = false;
    if( option == "noop"){
      this.noop = true;
    }
  }
  isNoop(){
    return this.noop;
  }
  setNoop(value){
    this.noop = value;
  }
  getHeaderId(){
    return this.headerId;
  }
  getIndexOfHeaderId(){
    const headerId = this.getHeaderId();
    if (!Array.isArray(this.headers)) {
      this.safeLogDebug('getIndexOfHeaderId: this.headers is not an array');
      return -1;
    }
    return this.headers.indexOf(headerId);
  }
  getHeaders(){
    return this.headers;
  }
  getConfigIds(){
    this.safeLogDebug(`configInfoSpreadsheetId=${this.configSpreadsheetId} | idsSheetName=${this.idsSheetName}`);
    if (typeof YKLiblog === 'undefined' || !YKLiblog.Log || typeof YKLiblog.Log.debug !== 'function') {
      this.safeLogDebug('getConfigIds: YKLiblog.Log.debug is not available');
    }
    if (typeof YKLibb === 'undefined' || !YKLibb.Gssx || typeof YKLibb.Gssx.setupForSpreadsheet !== 'function' || typeof YKLibb.Gssx.setupSpreadsheetX !== 'function') {
      this.safeLogDebug('getConfigIds: YKLibb.Gssx.setupForSpreadsheet or setupSpreadsheetX is not available');
      return [null, null, null, null, null];
    }
    const [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(this.configSpreadsheetId, this.idsSheetName);
    const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheetX(worksheet);
    this.safeLogDebug(`getConfigIds values=${values}`);
    return [spreadsheet, worksheet, header, values, dataRange];
  }
  getConfigInfox(){
    this.safeLogDebug(`configInfoSpreadsheetId=${this.configInfoSpreadsheetId} | configInfoxSheetName=${this.configInfoxSheetName}`);
    if (typeof YKLibb === 'undefined' || !YKLibb.Gssx || typeof YKLibb.Gssx.setupForSpreadsheet !== 'function' || typeof YKLibb.Gssx.setupSpreadsheetX !== 'function') {
      this.safeLogDebug('getConfigInfox: YKLibb.Gssx.setupForSpreadsheet or setupSpreadsheetX is not available');
      return [null, null, null, null, null];
    }
    const [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(this.configInfoSpreadsheetId, this.configInfoxSheetName);
    const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheetX(worksheet);
    return [spreadsheet, worksheet, header, values, dataRange];
  }
  getConfigInfo2(){
    this.safeLogDebug(`configInfoSpreadsheetId=${this.configInfoSpreadsheetId} | configInfo2SheetName=${this.configInfo2SheetName}`);
    if (typeof YKLibb === 'undefined' || !YKLibb.Gssx || typeof YKLibb.Gssx.setupForSpreadsheet !== 'function' || typeof YKLibb.Gssx.setupSpreadsheetX !== 'function') {
      this.safeLogDebug('getConfigInfo2: YKLibb.Gssx.setupForSpreadsheet or setupSpreadsheetX is not available');
      return [null, null, null, null, null];
    }
    const [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(this.configInfoSpreadsheetId, this.configInfo2SheetName);
    const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheetX(worksheet);
    return [spreadsheet, worksheet, header, values, dataRange];
  }
  nolimit(){
    return -1;
  }
  safeLogDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[Config] ${message}`);
      }
    } catch (error) {
      console.log(`[Config] Log error: ${error.message}`);
    }
  }
}

CONFIG = new Config("noop")

function config_test_x(){
  if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.initLogDebug === 'function') {
    YKLiblog.Log.initLogDebug();
  } else {
    console.log('[Config] YKLiblog.Log.initLogDebug is not available');
  }
  CONFIG.getConfigIds()
}

