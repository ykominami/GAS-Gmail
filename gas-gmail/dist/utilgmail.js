class UtilGmail {
  static makeTabledata2(){
    const [spradsheet, worksheet, header, values, dataRange] = CONFIG.getConfigInfo2()
    YKLiblog.Log.debug(`UtilGmail makeTabledata2 values=${values}`)
    const tabledata = new Tabledata(spradsheet, worksheet, header, values, dataRange);
    return tabledata
  }
  static makeTabledata(){
    const [spradsheet, worksheet, header, values, dataRange] = CONFIG.getConfigInfox()
    YKLiblog.Log.debug(`UtilGmail makeTabledata values=${values}`)
    const tabledata = new Tabledata(spradsheet, worksheet, header, values, dataRange);
    return tabledata
  }
  static makeIdTabledata(){
    const [spradsheet, worksheet, header, values, dataRange] = CONFIG.getConfigIds()
    YKLiblog.Log.debug(`UtilGmail makeIdTabledata values=${values}`)
    const idtabledata = new IdTabledata(spradsheet, worksheet, header, values, dataRange);
    return idtabledata
  }

  static makeIndex(startIndex, limitx, makeindexFlag = 0){
    return [startIndex, limitx]
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
