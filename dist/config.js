class Config {
  constructor(option = null){
    this.configInfoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SPREADSHEET_ID');
    this.configInfoxSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFOX_SHEETNAME');
    this.configInfo2SheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO2_SHEETNAME');
    this.parentFolderId = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_ID');
    this.parentFolderPath = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_PATH');
    this.destinationSpreadsheetId = PropertiesService.getScriptProperties().getProperty('DESTINATION_SPREADSHEET_ID');
    this.infoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('INFO_SPREADSHEET_ID');
    this.infoWorksheetName = PropertiesService.getScriptProperties().getProperty('INFO_WORKSHEET_NAME');

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
  getConfig(){
    Logger.log(`configInfoSpreadsheetId=${this.configInfoSpreadsheetId} | configInfoxSheetName=${this.configInfoxSheetName}`)
    return YKLibb.setupSpreadsheet(this.configInfoSpreadsheetId, this.configInfoxSheetName);
  }
  getConfigInfo2(){
    // [header, values, dataRange] = YKLibb.setupSpreadsheet(spreadsheetId, sheetName);
    return YKLibb.setupSpreadsheet(this.configInfoSpreadsheetId, this.configInfo2SheetName);
  }
  getConfigInfo2x(){
    return YKLibb.setupSpreadsheet(this.configInfoSpreadsheetId, this.configInfoxSheetName);
  }
  nolimit(){
    return -1
  }
}
function testdatef(){
  const date = new Date();
  const str = YKLiba.formatDateTimeManual(date);
  Logger.log(str);
}

CONFIG = new Config("noop")
