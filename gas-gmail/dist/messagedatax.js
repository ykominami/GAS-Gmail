class Messagedatax{
  constructor(msg, date){
    this.id = null
    this.from = null
    this.subject = null
    this.dateStr = null
    this.date = null
    this.plainBody = null

    if( msg !== null){
      this.id = msg.getId()
      this.from = msg.getFrom()
      this.subject = msg.getSubject()
      this.plainBody = msg.getPlainBody()
    }
    if( date !== null){
      this.dateStr = YKLiba.make_date_string(date)
      this.date = date
    }
  }
}