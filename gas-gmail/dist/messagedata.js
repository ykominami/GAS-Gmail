class Messagedata{
  constructor (msg, date_str, recorded){
    let date
    if( date_str !== null){
      date = new Date(date_str)
    }
    else{
      try{
        date = msg.getDate()
      }
      catch(error){
        YKLiblog.Log.unknown(error)
        return null
      }
    }
    this.msg = msg
    this.recorded = recorded
    this.isAfter = false
    this.isTruncated = false

    // クラスMessagedataは、1個のメッセージに関する情報を持つ
    // メッセージについて、関心のある一部の情報をクラスMessagedataxのインスタンスとして持つ
    // Messagedataxの持つ情報のうち、文字列として保持するものは、オリジナルのものと、指定バイト数まで切り詰めた文字列の2種類もつ。
    // オリジナルの情報がすべて指定バイト数以下の文字列であれば、切り詰め版の情報と同一である。
    // 通常は、切り詰め版の情報を用いる。
    // 切り詰めが発生した場合、オリジナル版をGoogle Docsのファイルとして保存する

    // クラスMessagedataxは、クラスMessagedataの
    this.truncated = new Messagedatax(null, null)
    this.original = new Messagedatax(msg, date)

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
  getMessageId(){
    return this.msg.getId()
  }
  getDataAsArray(){
    this.dataArray = [this.truncated.id, this.truncated.from, this.truncated.subject, this.truncated.date, this.truncated.plainBody]
    YKLiblog.Log.debug(`Messagedata.getDataAsArray dataArray.length=${this.dataArray.length} this.dataArray[0]=${this.dataArray[0]} this.dataArray[2]=${this.dataArray[2]}`)
    return this.dataArray
  }
}