class Config {
  constructor(option = null){
    this.limit = 2
    this.configSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_SPREADSHEET_ID');
    this.idsSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_IDS_SHEETNAME');

    this.configInfoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SPREADSHEET_ID');
    this.configInfoxSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFOX_SHEETNAME');
    this.configInfo2SheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO2_SHEETNAME');
    this.docParentFolderId = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_ID');
    this.docParentFolderPath = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_PATH');
    this.infoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('INFO_SPREADSHEET_ID');
    this.infoWorksheetName = PropertiesService.getScriptProperties().getProperty('INFO_WORKSHEET_NAME');
    this.limit = PropertiesService.getUserProperties().getProperty('CELL_CONTENT_LIMIT') - 1;
    const headerId = "id"
    this.headers = [headerId, "from", "subject", "dateStr", "plainBody"]
    this.headerId = headerId
    this.noop = false
    if( option == "noop"){
      this.noop = true
    }
  }
  isNoop(){
    return this.noop
  }
  setNoop(value){
    this.noop = value
  }
  getHeaderId(){
    return this.headerId
  }
  getIndexOfHeaderId(){
    const headerId = this.getHeaderId()
    this.headers.indexOf(headerId)
  }
  getHeaders(){
    return this.headers
  }
  getConfigIds(){
    YKLiblog.Log.debug(`configInfoSpreadsheetId=${this.configSpreadsheetId} | idsSheetName=${this.idsSheetName}`)
    const [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(this.configSpreadsheetId, this.idsSheetName)
    const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheetX(worksheet)
    YKLiblog.Log.debug(`getConfigIds values=${values}`)
    return [spreadsheet, worksheet, header, values, dataRange]
  }
  getConfig(){
    YKLiblog.Log.debug(`configInfoSpreadsheetId=${this.configInfoSpreadsheetId} | configInfoxSheetName=${this.configInfoxSheetName}`)
    const [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(this.configInfoSpreadsheetId, this.configInfoxSheetName)
    const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheetX(worksheet)
    return [spreadsheet, worksheet, header, values, dataRange]
  }
  getConfigInfo2(){
    YKLiblog.Log.debug(`configInfoSpreadsheetId=${this.configInfoSpreadsheetId} | configInfo2SheetName=${this.configInfo2SheetName}`)
    // [header, values, dataRange] = YKLibb.setupSpreadsheet(spreadsheetId, sheetName);
    const [spreadsheet, worksheet] = YKLibb.Gssx.setupForSpreadsheet(this.configInfoSpreadsheetId, this.configInfo2SheetName)
    const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheetX(worksheet)
    return [spreadsheet, worksheet, header, values, dataRange]
  }
  nolimit(){
    return -1
  }
}

CONFIG = new Config("noop")

function config_test_x(){
  YKLiblog.Log.initLogDebug()

  CONFIG.getConfigIds()
}

