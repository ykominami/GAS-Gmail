class PairLabel {
  static getOrCreateLabel(labelName){
    // labelNameの存在チェック
    if (!labelName || typeof labelName !== 'string') {
      this.logDebug("PairLabel getOrCreateLabel: labelName is not valid");
      return null;
    }
    
    // GmailAppの存在チェック
    if (typeof GmailApp === 'undefined') {
      this.logDebug("PairLabel getOrCreateLabel: GmailApp is not available");
      return null;
    }
    
    // GmailApp.getUserLabelByName()の存在チェック
    if (typeof GmailApp.getUserLabelByName !== 'function') {
      this.logDebug("PairLabel getOrCreateLabel: GmailApp.getUserLabelByName is not available");
      return null;
    }
    
    let label;
    try {
      label = GmailApp.getUserLabelByName(labelName);
    } catch (error) {
      this.logDebug(`PairLabel getOrCreateLabel: getUserLabelByName error - ${error.message}`);
      return null;
    }
    
    if (label === null){
      // GmailApp.createLabel()の存在チェック
      if (typeof GmailApp.createLabel !== 'function') {
        this.logDebug("PairLabel getOrCreateLabel: GmailApp.createLabel is not available");
        return null;
      }
      
      try {
        label = GmailApp.createLabel(labelName);
      } catch (error) {
        this.logDebug(`PairLabel getOrCreateLabel: Failed to create label - ${error.message}`);
        return null;
      }
    }
    return label;
  }
  
  constructor(name){
    // nameパラメータの存在チェック
    if (!name || typeof name !== 'string') {
      this.logDebug("PairLabel constructor: name is not valid");
      throw new Error("PairLabel constructor: name is not valid");
    }
    
    this.targetLabelName = name;
    this.endLabelName = this.makeEndLabelName(name);
    
    // targetLabelの作成
    this.targetLabel = PairLabel.getOrCreateLabel(this.targetLabelName);
    if (!this.targetLabel) {
      this.logDebug("PairLabel constructor: Failed to create targetLabel");
      throw new Error("PairLabel constructor: Failed to create targetLabel");
    }
    
    // endLabelの作成
    this.endLabel = PairLabel.getOrCreateLabel(this.endLabelName);
    if (!this.endLabel) {
      this.logDebug("PairLabel constructor: Failed to create endLabel");
      throw new Error("PairLabel constructor: Failed to create endLabel");
    }
  }
  
  makeEndLabelName(name){
    // nameパラメータの存在チェック
    if (!name || typeof name !== 'string') {
      this.logDebug("PairLabel makeEndLabelName: name is not valid");
      return '';
    }
    
    return name + "_";
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
        console.log(`[PairLabel] ${message}`);
      }
    } catch (error) {
      console.log(`[PairLabel] Log error: ${error.message}`);
    }
  }
  
  /**
   * 静的メソッド用の安全なログ出力メソッド
   * @param {string} message ログメッセージ
   */
  static logDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[PairLabel] ${message}`);
      }
    } catch (error) {
      console.log(`[PairLabel] Log error: ${error.message}`);
    }
  }
}
