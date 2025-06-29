class ThreadAndMessagedataarray {
  constructor(thread, messagedataArray){
    this.thread = thread
    // 引数messagedataArrayはMessagedataの配列
    this.messagedataArray = messagedataArray
  }
  collectMessagesdataAfterDate(new_last_date){
    return this.messagedataArray.filter( (messagedata) => 
      messagedata.isAfter = YKLiba.Utils.isAfterDate(new_last_date, messagedata.msg.getDate())
    )
  }
}
