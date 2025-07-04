class ThreadAndMessagedataarray {
  constructor(thread, messagedataArray){
    this.thread = thread
    // 引数messagedataArrayはMessagedataの配列
    this.messagedataArray = messagedataArray
  }
  collectMessagesdataAfterDate(new_last_date){
    return this.messagedataArray.filter( (messagedata) => {
      YKLiblog.Log.debug(`ThreadAndMessagedataarray collectMessagesdataAfterDate ThreadAndMessagedataarray typeof(messagedata)=${typeof(messagedata)} new_last_date=${new_last_date} messagedata.msg.getDate()=${messagedata.msg.getDate()}`)
      messagedata.isAfter = YKLiba.Utils.isAfterDate(new_last_date, messagedata.msg.getDate())
      YKLiblog.Log.debug(`messagedata.isAfter=${messagedata.isAfter}`)
      return messagedata
    }
    )
  }
}
