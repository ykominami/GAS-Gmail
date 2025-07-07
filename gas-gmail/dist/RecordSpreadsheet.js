class RecordSpreadsheet {
  constructor(spreadsheet, config){
    this.config = config
  
    this.spreadsheet = spreadsheet
    this.registeredEmailList = new RegisteredEmailList(spreadsheet, config)
  }
  addConfigSpreadsheet(configSpreadsheet){
    this.configSpreadsheet = configSpreadsheet
    this.targetedEmailList = configSpreadsheet.getTargetedEmailList()
    this.registeredEmailList.addTargetedEmailList(this.targetedEmailList)
    this.registeredEmailList.addRegisteredEmailFromTargetedEmailList()
  }
}