class QueryInfo {
  constructor(from, pairLabel, maxThreads, maxSearchesAvailable ){
    if (!pairLabel || typeof pairLabel !== 'object') {
      QueryInfo.safeLogDebug("QueryInfo constructor: pairLabel is not valid");
      throw new Error("QueryInfo constructor: pairLabel is not valid");
    }
    if (typeof from !== 'string') {
      QueryInfo.safeLogDebug("QueryInfo constructor: from is not a string");
      throw new Error("QueryInfo constructor: from is not a string");
    }
    this.from = from;
    this.pairLabel = pairLabel;
    let targetLabelName2 = pairLabel.targetLabelName || '';
    if (typeof targetLabelName2 === 'string' && targetLabelName2.includes(" ")) {
      targetLabelName2 = `"${targetLabelName2}"`;
    }
    let endLabelName2 = pairLabel.endLabelName || '';
    if (typeof endLabelName2 === 'string' && endLabelName2.includes(" ")) {
      endLabelName2 = `"${endLabelName2}"`;
    }
    let from2 = from;
    if (typeof from2 === 'string' && from2.includes(" ")) {
      from2 = `"${from2}"`;
    }
    const query   = `label:${targetLabelName2} -label:${endLabelName2}`;
    const query2 = `from: ${from2} -label:${targetLabelName2}`;
    this.queries = [query, query2];
    this.start = 0;
    this.maxThreads = maxThreads;
    this.maxSearchesAvailable = maxSearchesAvailable;
  }
  setQuery0(query){
    if (!this.queries) this.queries = [];
    this.queries[0] = query;
  }
  setQuery1(query){
    if (!this.queries) this.queries = [];
    this.queries[1] = query;
  }
  getQuery0(){
    if (!this.queries) return '';
    return this.queries[0];
  }
  getQuery1(){
    if (!this.queries) return '';
    return this.queries[1];
  }
  setCount(value){
    this.count = value;
  }
  getCount(){
    return this.count;
  }
  setCount2(value){
    this.count2 = value;
  }
  getCount2(){
    return this.count2;    
  }
  isValid(){
    let result = true;
    let count=0;
    const messages = [];
    let message;
    // YKLiba.isValidObjectの存在チェック
    if (typeof YKLiba === 'undefined' || typeof YKLiba.isValidObject !== 'function') {
      QueryInfo.safeLogDebug("QueryInfo.isValid: YKLiba.isValidObject is not available");
      throw new Error("YKLiba.isValidObject is not available");
    }
    // YKLiblog.Log.debugの存在チェック
    const logDebug = (msg) => {
      QueryInfo.safeLogDebug(msg);
    };
    const retPairLabel = YKLiba.isValidObject(this.pairLabel);
    logDebug(`QueryInfo retPairLabel=${retPairLabel}`);
    let ret = retPairLabel[0];
    if( ret ){
      const retPairLabelAndTargetLabel = YKLiba.isValidObject(this.pairLabel.targetLabel);
      if( !retPairLabelAndTargetLabel[0] ){
        message = `QueryInfo  this.pairLabel.targetLabel ${retPairLabelAndTargetLabel[1]}`;
        logDebug(message);
        messages.push(message);
        count++;
      }
      const retPairLabelAndEndLabel = YKLiba.isValidObject(this.pairLabel.endLabel);
      if( !retPairLabelAndEndLabel[0] ){
        message =`QueryInfo this.pairLabel.endtLabel ${retPairLabelAndEndLabel[1]}`;
        messages.push(message);
        logDebug(message);
        count++;
      }
    }
    else{
      message = `QueryInfo this.pairLable1 ${retPairLabel[1]}`;
      logDebug(message);
      messages.push(message);
      count++;
    }
    const retQueries = YKLiba.isValidObject(this.queries);
    const retQueries0 = YKLiba.isValidObject(this.queries[0]);
    const retQueries1 = YKLiba.isValidObject(this.queries[1]);
    logDebug(`QueryInfo.isValid count=${count}`);
    if(count > 0){
      result = false;
      throw Error(`Invalid QueryInfo ${messages}`);
    }
    return result;
  }
  /**
   * 安全なログ出力メソッド
   * @param {string} message ログメッセージ
   */
  logDebug(message) {
    QueryInfo.safeLogDebug(message);
  }
  /**
   * 静的に安全なログ出力
   */
  static safeLogDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[QueryInfo] ${message}`);
      }
    } catch (error) {
      console.log(`[QueryInfo] Log error: ${error.message}`);
    }
  }
}
