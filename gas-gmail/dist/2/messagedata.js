class Messagedata{
  constructor (headers, msg, date_str, recorded){
    // Messagedataxクラスの存在チェック
    if (typeof Messagedatax === 'undefined') {
      console.log("Messagedata constructor: Messagedatax class is not defined");
      throw new Error("Messagedatax class is not defined");
    }
    
    let date
    if( date_str !== null){
      date = new Date(date_str)
    }
    else{
      try{
        // msg.getDate()の存在チェック
        if (msg && typeof msg.getDate === 'function') {
          date = msg.getDate()
        } else {
          console.log("Messagedata constructor: msg.getDate is not available");
          date = new Date()
        }
      }
      catch(error){
        // コンストラクタ内ではthis.logUnknown()を直接呼び出せないため、console.logを使用
        console.log(`Messagedata constructor error: ${error.message}`);
        throw new Error("Failed to get date from message")
      }
    }
    this.msg = msg
    this.recorded = recorded
    this.isAfter = false
    this.isTruncated = false
    // const headers = ["id", "from", "subject", "dateStr", "plainBody"]
    this.names = [...headers,  "date"]
    this.headers = headers  // getHeadersメソッド用にheadersを保存

    // クラスMessagedataは、1個のメッセージに関する情報を持つ
    // メッセージについて、関心のある一部の情報をクラスMessagedataxのインスタンスとして持つ
    // Messagedataxの持つ情報のうち、文字列として保持するものは、オリジナルのものと、指定バイト数まで切り詰めた文字列の2種類もつ。
    // オリジナルの情報がすべて指定バイト数以下の文字列であれば、切り詰め版の情報と同一である。
    // 通常は、切り詰め版の情報を用いる。
    // 切り詰めが発生した場合、オリジナル版をGoogle Docsのファイルとして保存する

    // クラスMessagedataxは、クラスMessagedataの
    try {
      this.truncated = new Messagedatax(null, null)
      this.original = new Messagedatax(msg, date)
    } catch (error) {
      console.log(`Messagedata constructor: Failed to create Messagedatax instances - ${error.message}`);
      throw new Error("Failed to create Messagedatax instances");
    }

    this.dataArray = null
  }
  truncateString(maxLength) {
    // CONFIGの存在チェック
    if (typeof CONFIG === 'undefined' || typeof CONFIG.nolimit !== 'function') {
      console.log("Messagedata truncateString: CONFIG.nolimit is not available");
      maxLength = 1000; // デフォルト値
    } else {
      if (typeof maxLength !== 'number'){
        maxLength = CONFIG.nolimit()
      } 
      if ( maxLength <= 0) {
        maxLength = CONFIG.nolimit()
      }
    }

    this.isTruncated = false;

    for(let i=0; i<this.names.length; i++){
      const name = this.names[i]
      
      // this.original[name]の存在チェック
      if (!this.original || typeof this.original[name] === 'undefined') {
        console.log(`Messagedata truncateString: this.original[${name}] is not available`);
        continue;
      }
      
      const str = this.original[name]
      
      // CONFIG.nolimit()の存在チェック（再度チェック）
      if (typeof CONFIG === 'undefined' || typeof CONFIG.nolimit !== 'function') {
        console.log("Messagedata truncateString: CONFIG.nolimit is not available in loop");
        continue;
      }
      
      if( maxLength === CONFIG.nolimit() ){
        // this.truncated[name]の存在チェック
        if (this.truncated) {
          this.truncated[name] = str;
        } else {
          console.log("Messagedata truncateString: this.truncated is not available");
        }
      }
      else{
        if (typeof str === 'string' && str.length > maxLength) {
          this.isTruncated = true;
          // this.truncated[name]の存在チェック
          if (this.truncated) {
            // str.substring()の存在チェック
            if (typeof str.substring === 'function') {
              this.truncated[name] = str.substring(0, maxLength);
            } else {
              console.log("Messagedata truncateString: str.substring is not available");
              this.truncated[name] = str;
            }
          } else {
            console.log("Messagedata truncateString: this.truncated is not available");
          }
        }
        else{
          // this.truncated[name]の存在チェック
          if (this.truncated) {
            this.truncated[name] = str;
          } else {
            console.log("Messagedata truncateString: this.truncated is not available");
          }
        }        
      }
    }
  }
  getHeaders(){
    return this.headers || this.names  // this.headersが存在しない場合はthis.namesを返す
  }
  getMessageId(){
    // this.msg.getId()の存在チェック
    if (this.msg && typeof this.msg.getId === 'function') {
      try {
        return this.msg.getId()
      } catch (error) {
        console.log(`Messagedata getMessageId error: ${error.message}`);
        return null;
      }
    } else {
      console.log("Messagedata getMessageId: this.msg.getId is not available");
      return null;
    }
  }
  getDataAsArray(){
    // this.truncatedの各プロパティの存在チェック
    if (!this.truncated) {
      console.log("Messagedata getDataAsArray: this.truncated is not available");
      return [];
    }
    
    const id = this.truncated.id || '';
    const from = this.truncated.from || '';
    const subject = this.truncated.subject || '';
    const date = this.truncated.date || '';
    const plainBody = this.truncated.plainBody || '';
    
    this.dataArray = [id, from, subject, date, plainBody]
    
    // this.logDebug()の存在チェック
    if (typeof this.logDebug === 'function') {
      this.logDebug(`Messagedata.getDataAsArray dataArray.length=${this.dataArray.length} this.dataArray[0]=${this.dataArray[0]} this.dataArray[2]=${this.dataArray[2]}`)
    } else {
      console.log(`Messagedata.getDataAsArray dataArray.length=${this.dataArray.length} this.dataArray[0]=${this.dataArray[0]} this.dataArray[2]=${this.dataArray[2]}`)
    }
    
    return this.dataArray
  }
  
  /**
   * 安全なログ出力メソッド
   * @param {string} message ログメッセージ
   */
  logDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[Messagedata] ${message}`);
      }
    } catch (error) {
      console.log(`[Messagedata] Log error: ${error.message}`);
    }
  }
  
  /**
   * 安全なエラーログ出力メソッド
   * @param {Error} error エラーオブジェクト
   */
  logUnknown(error) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.unknown === 'function') {
        YKLiblog.Log.unknown(error);
      } else {
        console.log(`[Messagedata] Unknown error: ${error.message}`);
      }
    } catch (logError) {
      console.log(`[Messagedata] Log error: ${logError.message}`);
    }
  }
}