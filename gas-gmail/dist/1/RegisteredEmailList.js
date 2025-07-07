class RegisteredEmailList {
  constructor(spreadsheet, config){
    this.config = config
    this.spreadsheet = spreadsheet
    this.registeredEmailByKey = {}
    this.tabledata = null
    this.keySet = new Set()
    // YKLiblog.Log.debug( `config.constructor=${ config.constructor }` )
    // Logger.log( `config.constructor=${ config.constructor }` )
    // const x = 0
    const tableDef = config.getRegisteredEmailTableDef()
    this.tableDef = tableDef
    this.sourceHeader = tableDef.getHeader()
    this.yklibbConfig = new YKLibb.Config(this.sourceHeader.length, this.sourceHeader, YKLibb.Config.COMPLETE())
    this.configTable = null
    this.targetedEmailList = null

    // const [header, values, totalRange] = YKLibb.Gssx.setupSpeadsheet(spreadsheet, )
    // YKLibb.Gssx.getHeaderAndData(values, totalRange, config)
  }
  getKeys(){
    return Object.keys(this.registeredEmailByKey)
  }
  getRegisteredEmailByKey(key){
    return this.registeredEmailByKey[key]
  }
  addRegisteredEmailFromTargetedEmailList(){
    if (this.targetedEmailList) {
      const keys = this.targetedEmailList.getKeys()
      keys.forEach(key => this.addRegisteredEmail(key))
    }
  }
  addRegisteredEmail(key){
    if(this.keySet.has(key)){
      return
    }
    let targetedEmail = null
    if (this.configTable) {
      const targetedEmailList = this.configTable.getTargetedEmailList()
      if (targetedEmailList) {
        targetedEmail = targetedEmailList.getTargetedEmailByKey(key)
      }
    } else if (this.targetedEmailList) {
      targetedEmail = this.targetedEmailList.getTargetedEmailByKey(key)
    }
    
    if (targetedEmail) {
      const registeredEmail = new RegisteredEmail(targetedEmail, this.spreadsheet, key, this.config, this.tableDef, this.yklibbConfig)
      this.registeredEmailByKey[key] = registeredEmail
      this.keySet.add(key)
    }
  }
  addTargetedEmailList(targetedEmailList){
    this.targetedEmailList = targetedEmailList
  }
  addConfigTable(configTable){
    this.configTable = configTable
  }
  addTabledata(tabledata){
    this.tabledata = tabledata
  }
  addRegisteredEmails(keys){
    keys.forEach(key => this.addRegisteredEmail(key))
  }
}