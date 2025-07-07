class ThreadAndMessagedataarray {
  constructor(thread, messagedataArray){
    this.thread = thread;
    // 引数messagedataArrayはMessagedataの配列
    this.messagedataArray = messagedataArray;
  }
  collectMessagesdataAfterDate(new_last_date){
    // messagedataArrayの存在チェック
    if (!this.messagedataArray || !Array.isArray(this.messagedataArray)) {
      this.logDebug("collectMessagesdataAfterDate: messagedataArray is not available or not an array");
      return [];
    }
    // YKLiba.Utils.isAfterDateの存在チェック
    if (typeof YKLiba === 'undefined' || !YKLiba.Utils || typeof YKLiba.Utils.isAfterDate !== 'function') {
      this.logDebug("collectMessagesdataAfterDate: YKLiba.Utils.isAfterDate is not available");
      return [];
    }
    return this.messagedataArray.filter((messagedata) => {
      // messagedata.msg.getDate()の存在チェック
      let msgDate = null;
      if (messagedata && messagedata.msg && typeof messagedata.msg.getDate === 'function') {
        msgDate = messagedata.msg.getDate();
      } else {
        this.logDebug("collectMessagesdataAfterDate: messagedata.msg.getDate is not available");
        return false;
      }
      // YKLiblog.Log.debugの存在チェック
      this.logDebug(`ThreadAndMessagedataarray collectMessagesdataAfterDate typeof(messagedata)=${typeof(messagedata)} new_last_date=${new_last_date} messagedata.msg.getDate()=${msgDate}`);
      messagedata.isAfter = YKLiba.Utils.isAfterDate(new_last_date, msgDate);
      this.logDebug(`messagedata.isAfter=${messagedata.isAfter}`);
      return messagedata.isAfter === true;
    });
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
        console.log(`[ThreadAndMessagedataarray] ${message}`);
      }
    } catch (error) {
      console.log(`[ThreadAndMessagedataarray] Log error: ${error.message}`);
    }
  }
}
