class Config {
  static CONFIG_INFOX() {
    return "CONFIG_INFOX"
  }
  static CONFIG_INFO2() {
    return "CONFIG_INFO2"
  }
  static CONFIG_INFO() {
    return "CONFIG_INFO"
  }
  constructor(option = null){
    this.limit = 2
    this.configSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_SPREADSHEET_ID');
    this.idsSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_IDS_SHEETNAME');

    this.configInfoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SPREADSHEET_ID');
    this.configInfoxSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFOX_SHEETNAME');
    this.configInfo2SheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO2_SHEETNAME');
    this.configInfoSheetName = PropertiesService.getScriptProperties().getProperty('CONFIG_INFO_SHEETNAME');
    this.docParentFolderId = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_ID');
    this.docParentFolderPath = PropertiesService.getScriptProperties().getProperty('DOC_PARENT_FOLDER_PATH');
    this.infoSpreadsheetId = PropertiesService.getScriptProperties().getProperty('INFO_SPREADSHEET_ID');
    this.infoWorksheetName = PropertiesService.getScriptProperties().getProperty('INFO_WORKSHEET_NAME');
    this.limitx = PropertiesService.getUserProperties().getProperty('CELL_CONTENT_LIMIT');
    this.limit = parseInt(this.limitx) - 1

    this.registeredEmailTableDef = this.makeRegisteredEmailTableDef()
    this.targetedEmailIdsTableDef = this.makeTargetedEmailIdsTableDef()

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
  getSpreadsheetForRecordSpreadsheet(){
    const [spreadsheet, _worksheet] = YKLiba.Base.getSpreadsheet(this.configSpreadsheetId)
    return [spreadsheet, _worksheet]
  }
  getSpreadsheetForConfigSpreadsheet(){
    const [spreadsheet, _worksheet] = YKLiba.Base.getSpreadsheet(this.configInfoSpreadsheetId)
    return [spreadsheet, _worksheet]
  }

  getRegisteredEmailTableDef(){
    return this.registeredEmailTableDef
  }
  getTargetedEmailIdsTableDef(){
    return this.targetedEmailIdsTableDef
  }
  makeRegisteredEmailTableDef(){
    const nameOfId = "id"
    const header = [nameOfId, "from", "subject", "dateStr", "plainBody"]
    const tableDef = new Config.TableDef(header, nameOfId)
    return tableDef
  }
  makeTargetedEmailIdsTableDef(){
    const nameOfId = "name"
    const header = [nameOfId]
    const tableDef = new Config.TableDef(header, nameOfId)
    return tableDef
  }
  setConfigInfoType(value){
    this.configInfoType = value
  }
  getConfigInfoType(){
    return this.configInfoType
  }
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
  ConfigInfox(spreadsheet){
    YKLiblog.Log.debug(`configInfoxSheetName=${this.configInfoxSheetName}`)
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfoxSheetName)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  ConfigInfo(spreadsheet){
    YKLiblog.Log.debug(`configInfoSheetName=${this.configInfoSheetName}`)
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfoSheetName)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  ConfigInfo2(spreadsheet){
    YKLiblog.Log.debug(`configInfo2SheetName=${this.configInfo2SheetName}`)
    const [worksheet, totalRange] = YKLibb.Gssx.getDataSheetRange(spreadsheet, this.configInfo2SheetName)
    const values = totalRange.getValues()
    YKLiblog.Log.debug(`getConfigInfo values=${values}`)
    return [worksheet, values, totalRange]
  }
  getRecordSpreadsheet(){
    YKLiblog.Log.debug(`configSpreadsheetId=${this.configSpreadsheetId}`)
    const [_spreadsheet, worksheet, values, totalRange] = YKLibb.Gssx.setupSpeadsheetValues(this.configSpreadsheetId, this.configInfo2SheetName)
    YKLiblog.Log.debug(`getConfigInfo2 values=${values}`)
    return [_spreadsheet, worksheet, values, totalRange]
  }
  getConfigSpreadsheet(){
    YKLiblog.Log.debug(`configInfoSpreadsheetId=${this.configInfoSpreadsheetId}`)
    const [_spreadsheet, worksheet, values, totalRange] = YKLibb.Gssx.setupSpeadsheetValues(this.configInfoSpreadsheetId, this.configInfo2SheetName)
    YKLiblog.Log.debug(`getConfigInfo2 values=${values}`)
    return [_spreadsheet, worksheet, values, totalRange]
  }
  nolimit(){
    return -1
  }
}
Config.TableDef = class {
  constructor( header, nameOfId ){
    this.header = header
    this.nameOfId = nameOfId
    this.indexOfId = header.indexOf(nameOfId)    
  }
  getHeader(){
    return this.header
  }
  getNameOfId(){
    return this.nameOfId
  }
  getIndexOfId(){
    return this.indexOfId
  }
}

CONFIG = new Config("noop")

