class Messagedata{
  constructor (msg, date_str){
    let date
    if( date_str !== null){
      date = new Date(date_str)
    }
    else{
      try{
        date = msg.getDate()
      }
      catch(error){
        YKLiba.Log.unknown(error)
        return null
      }
    }
    this.msg = msg
    this.isAfter = false
    this.isTruncated = false
    this.truncated = new Messagedatax()

    this.original = new Messagedatax()
    this.original.id = msg.getId()
    this.original.from = msg.getFrom()
    this.original.subject = msg.getSubject()
    this.original.dateStr = YKLiba.make_date_string(date)
    this.original.date = date
    this.original.plainBody = msg.getPlainBody()
    this.dataArray = null
  }
  truncateString(maxLength) {
    if (typeof maxLength !== 'number'){
      maxLength = CONFIG.nolimit()
    } 
    if ( maxLength <= 0) {
      maxLength = CONFIG.nolimit()
    }

    this.isTruncated = false;

    const names = ["id", "from", "subject", "dateStr", "date", "plainBody"]
    for(let i=0; i<names.length; i++){
      const name = names[i]
      const str = this.original[name]
      if( maxLength === CONFIG.nolimit() ){
        this.truncated[name] = str;
      }
      else{
        if (typeof str === 'string' && str.length > maxLength) {
          this.isTruncated = true;
          this.truncated[name] = str.substring(0, maxLength);
        }
        else{
          this.truncated[name] = str;
        }        
      }
    }
  }

  getDataAsArray(){
    this.dataArray = [this.truncated.id, this.truncated.from, this.truncated.subject, this.truncated.date, this.truncated.plainBody]
    Logger.log(`Messagedata.getDataAsArray dataArray.length=${this.dataArray.length} this.dataArray[0]=${this.dataArray[0]} this.dataArray[2]=${this.dataArray[2]}`)
    return this.dataArray
  }
}