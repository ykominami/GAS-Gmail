class Messagedata{
  /**
   * Messagedataクラスのコンストラクタ
   * 1個のメッセージに関する情報を管理するインスタンスを初期化する
   * @param {Array} names - メッセージ情報の項目名の配列
   * @param {Object} msg - Gmailメッセージオブジェクト
   * @param {string|null} date_str - メッセージの日時の日付文字列（nullの場合はmsgから取得）
   * @param {boolean} recorded - 記録済みフラグ
   * @param {Object} config - 設定オブジェクト
   */
  constructor (names, msg, date_str, recorded, config){
    this.names = names
    this.config = config

    let date
    if( date_str !== null){
      date = new Date(date_str)
    }
    else{
      try{
        date = msg.getDate()
      }
      catch(error){
        YKLiblog.Log.unknown(error.name)
        YKLiblog.Log.unknown(error.message)
        YKLiblog.Log.unknown(error.stack)
        return null
      }
    }
    this.date = date
    this.msg = msg
    this.recorded = recorded
    this.isAfter = false
    this.isTruncated = false

    this.truncated = new Messagedatax(null, null)
    this.original = new Messagedatax(msg, date)

    this.dataArray = null
  }
  
  /**
   * 文字列データを指定された最大長に切り詰める
   * オリジナルデータと切り詰めデータの両方を保持し、切り詰めが発生した場合はisTruncatedフラグを設定する
   * @param {number} maxLength - 最大文字数（無効な値の場合は設定の無制限値を使用）
   */
  truncateString(maxLength) {
    if (typeof maxLength !== 'number'){
      maxLength = this.config.nolimit()
    } 
    if ( maxLength <= 0) {
      maxLength = this.config.nolimit()
    }

    this.isTruncated = false;

    for(let i=0; i<this.names.length; i++){
      const name = this.names[i]
      const str = this.original[name]
      if( maxLength === this.config.nolimit() ){
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
  
  /**
   * メッセージのIDを取得する
   * @returns {string} メッセージのID
   */
  getMessageId(){
    return this.msg.getId()
  }
  
  /**
   * 切り詰められたデータを配列形式で取得する
   * id, from, subject, date, plainBodyの順序で配列を返す
   * @returns {Array} メッセージデータの配列
   */
  getDataAsArray(){
    this.dataArray = [this.truncated.id, this.truncated.from, this.truncated.subject, this.truncated.date, this.truncated.plainBody, this.date]
    YKLiblog.Log.debug(`Messagedata.getDataAsArray dataArray.length=${this.dataArray.length} this.dataArray[0]=${this.dataArray[0]} this.dataArray[2]=${this.dataArray[2]}`)
    return this.dataArray
  }
}