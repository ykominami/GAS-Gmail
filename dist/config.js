class Config {
  static x(){
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_SPREADSHEET_ID');
    const sheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_SHEETNAME');
    console.log(`spreadsheetId=${spreadsheetId} sheetName=${sheetName}`);
    const [header, values, dataRange] = YKLibb.setupSpreadsheet(spreadsheetId, sheetName);
    // return [header, values, dataRange];
    // return header;
    return values;
    // return "x";
  }
  static getConfig(){
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_SPREADSHEET_ID');
    const sheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_SHEETNAME');
    // [header, values, dataRange] = YKLibb.setupSpreadsheet(spreadsheetId, sheetName);
    return YKLibb.setupSpreadsheet(spreadsheetId, sheetName);
    // return [header, values, dataRange];
    // return [header];
  }
  static isNoop(){
    return CONFIG.isNoop()
  }
  constructor(option = null){
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
}
function testdatef(){
  const date = new Date();
  const str = YKLiba.formatDateTimeManual(date);
  Logger.log(str);
}

CONFIG = new Config("noop")