class RegisteredEmailList {
  constructor(spreadsheet){
    this.spreadsheet = spreadsheet
    this.registeredEmailByKey = {}
    this.tabledata = null
  }
  getKeys(){
    return Object.keys(this.registeredEmailByKey)
  }
  getRegiseteredEmailByKey(key){
    return this.registeredEmailByKey[key]
  }
  addRegiseteredEmail(key){
    const targetedEmail = this.tabledata.getTargetedEmail(key)
    const registeredEmail = new RegisteredEmail(targetedEmail, this.spreadsheet, key)
    this.registeredEmailByKey[key] = registeredEmail
  }
  add(key){
    this.addRegiseteredEmail(key)
  }
  addTabledata(tabledata){
    this.tabledata = tabledata
  }
}