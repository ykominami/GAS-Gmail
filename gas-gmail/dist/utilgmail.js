class UtilGmail {
  static makeTabledata2(){
    if (typeof CONFIG === 'undefined' || typeof CONFIG.getConfigInfo2 !== 'function') {
      UtilGmail.safeLogDebug('makeTabledata2: CONFIG.getConfigInfo2 is not available');
      return null;
    }
    const result = CONFIG.getConfigInfo2();
    if (!Array.isArray(result) || result.length < 5) {
      UtilGmail.safeLogDebug('makeTabledata2: CONFIG.getConfigInfo2 did not return expected array');
      return null;
    }
    const [spradsheet, worksheet, header, values, dataRange] = result;
    UtilGmail.safeLogDebug(`UtilGmail makeTabledata2 values=${values}`);
    if (typeof Tabledata !== 'function') {
      UtilGmail.safeLogDebug('makeTabledata2: Tabledata constructor is not available');
      return null;
    }
    const tabledata = new Tabledata(spradsheet, worksheet, header, values, dataRange);
    return tabledata;
  }
  static makeTabledata(){
    if (typeof CONFIG === 'undefined' || typeof CONFIG.getConfigInfox !== 'function') {
      UtilGmail.safeLogDebug('makeTabledata: CONFIG.getConfigInfox is not available');
      return null;
    }
    const result = CONFIG.getConfigInfox();
    if (!Array.isArray(result) || result.length < 5) {
      UtilGmail.safeLogDebug('makeTabledata: CONFIG.getConfigInfox did not return expected array');
      return null;
    }
    const [spradsheet, worksheet, header, values, dataRange] = result;
    UtilGmail.safeLogDebug(`UtilGmail makeTabledata values=${values}`);
    if (typeof Tabledata !== 'function') {
      UtilGmail.safeLogDebug('makeTabledata: Tabledata constructor is not available');
      return null;
    }
    const tabledata = new Tabledata(spradsheet, worksheet, header, values, dataRange);
    return tabledata;
  }
  static makeIdTabledata(){
    if (typeof CONFIG === 'undefined' || typeof CONFIG.getConfigIds !== 'function') {
      UtilGmail.safeLogDebug('makeIdTabledata: CONFIG.getConfigIds is not available');
      return null;
    }
    const result = CONFIG.getConfigIds();
    if (!Array.isArray(result) || result.length < 5) {
      UtilGmail.safeLogDebug('makeIdTabledata: CONFIG.getConfigIds did not return expected array');
      return null;
    }
    const [spradsheet, worksheet, header, values, dataRange] = result;
    UtilGmail.safeLogDebug(`UtilGmail makeIdTabledata values=${values}`);
    if (typeof IdTabledata !== 'function') {
      UtilGmail.safeLogDebug('makeIdTabledata: IdTabledata constructor is not available');
      return null;
    }
    const idtabledata = new IdTabledata(spradsheet, worksheet, header, values, dataRange);
    return idtabledata;
  }

  static makeIndex(startIndex, limitx, makeindexFlag = 0){
    if (typeof startIndex !== 'number' || typeof limitx !== 'number') {
      UtilGmail.safeLogDebug('makeIndex: startIndex or limitx is not a number');
      return [0, 0];
    }
    return [startIndex, limitx]
  }
  static safeLogDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[UtilGmail] ${message}`);
      }
    } catch (error) {
      console.log(`[UtilGmail] Log error: ${error.message}`);
    }
  }
}


function test_util(){
  let key
  const idtabledata = UtilGmail.makeIdTabledata()
  const keys = idtabledata.keys()
  YKLiblog.Log.debug(`keys=${ keys }`)
  key = keys[0]
  test_util_b(idtabledata, key)
  
  key = "xyz"
  test_util_b(idtabledata, key)
  
}
function test_util_b(idtabledata, key){
  YKLiblog.Log.debug(key)
  const targetedEmailIds = idtabledata.getTargetedEmailIds(key)
  const ret = typeof(targetedEmailIds)
  if( ret !== "undefined" ){
    YKLiblog.Log.debug(`done=${ [...targetedEmailIds.done] }`)
  }
}
function test_util_c(idtabledata, key){
  YKLiblog.Log.debug(key)
  const targetedEmailIds = idtabledata.getTargetedEmailIds(key)
  YKLiblog.Log.debug(`done=${ [...targetedEmailIds.done] }`)
}
