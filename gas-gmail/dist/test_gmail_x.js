function test_x(){
  const basename = "0-AA-TEST_NAME"
  const ssId = CONFIG.configSpreadsheetId;
  const [ss, sheet] = YKLibb.Gssx.setupForSpreadsheet(ssId, basename);
  const r = sheet.getRange(1,1,2, 2)
  const array = [[1,2], [3,4]]
  r.setValues(array)
}
function test_y(){
  YKLiblog.Log.initLogDebug()
  const basename = "0-AA-TEST_NAME"
  const ssId = CONFIG.configSpreadsheetId;
  const [ss, sheet] = YKLibb.Gssx.setupForSpreadsheet(ssId, basename);
  const r = sheet.getRange(1,1,2, 2)
  const s = YKLiba.Range.getRangeShape(r)
  YKLiba.Range.showRangeShape(s)
  YKLiblog.Log.debug(`s=${JSON.stringify(r)}`)
  const basename2 = "A"
  const [ss2, sheet2] = YKLibb.Gssx.setupForSpreadsheet(ssId, basename2);
  const range2 = sheet2.getDataRange()
  const s2 = YKLiba.Range.getRangeShape(range2)
  YKLiba.Range.showRangeShape(s2)
  const ret2 = Util.isBrankRange(range2)
  YKLiblog.Log.debug(`ret2=${ret2}`)

  const data2 = range2.getValues()
  YKLiblog.Log.debug(`data2=${ JSON.stringify(data2)}` )
}
function getRangeForTargetedEmail(r){
  const result = Util.hasValidDataHeaderAndDataRows(r)
  YKLiblog.Log.debug(`result[0]=${result[0]}`)

  const headerRange = Util.getHeaderRange(r)
  const dataRowsRange = Util.geDataRowsRange(r)
  const headers = CONFIG.getHeaders()
  const values = dataRowsRange.getValues()
  assocArray = Util.makeAssocArray(headers, values)

  const headerId = CONFIG.getHeaderId()
  YKLiblog.Log.debug( `headerId=${headerId}` )
  const ids = assocArray.map( item => {
      YKLiblog.Log.debug( `item[headerId]` )
      return item[headerId]
    }
  )
  YKLiblog.Log.debug( ids )
  // const ids = array.map( item => item )
  const idset = new Set(ids)
  YKLiblog.Log.debug( [...idset] )
  if( ids.length == idset.size ){

  }
}
function test_z(){
  YKLiblog.Log.initLogDebug()
  
  const idTableData = UtilGmail.makeIdTabledata()
  const keys = idTableData.getKeys()
  // YKLiblog.Log.debug(keys)
  keys.map( key => {
      YKLiblog.Log.debug(key)
      const targetedEmailIds = idTableData.getTargetedEmailIdsByKey(key)
      targetedEmailIds
    }
  )

  const basename = "Hotwire Weekly"
  const ssId = CONFIG.configSpreadsheetId;
  const [ss, sheet] = YKLibb.Gssx.setupForSpreadsheet(ssId, basename);
  const r = sheet.getDataRange()

/*
  const s = YKLiba.Range.getRangeShape(r)
  const r2 = sheet.getRange(1,1,s.h, 1)
  const values = r2.getValues()
  const idset = new Set()
*/
  /*
  values.reduce( (accumrator, currentValue) => {
    if( !accumrator.has(currentValue) ){
      accumrator.add()
    }
  }, ideset)
  YKLiblog.Log.debug(`values=${ JSON.stringify(values)}`)
  */
}

function test_gmail_ids_and_x(){
  YKLiblog.Log.initLogDebug()

  const tabledata = UtilGmail.makeTabledata2()
  const idtabledata = UtilGmail.makeIdTabledata()

  const keys0 = tabledata.keys()
  idtabledata.adjust(keys0)

  const keys = idtabledata.keys()
  keys.map( key => {
    const targetedEmailIds = idtabledata.getTargetedEmailIdsByKey(key)
    targetedEmailIds.addToDone([10,20, 30])
    // YKLiblog.Log.debug([...targetedEmailIds.done])
    idtabledata.rewrite(targetedEmailIds)
  })
  idtabledata.update()

}

function test_gmail_ids(){
  YKLiblog.Log.initLogDebug()

  const basename = "_ids"
  // const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
  const ssId = CONFIG.configSpreadsheetId;
  const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheet(ssId, basename);

  YKLiblog.Log.debug( `header=${header}` )
  YKLiblog.Log.debug( `values=${ JSON.stringify(values) }` )
  const r = YKLiba.Range.getValidRange()
  const idtabledata = Util.makeIdTabledata()
  // idtabledata.dump()
  const keys = idtabledata.keys()
  keys.map( key => {
    const targetedEmailIds = idtabledata.getTargetedEmailIdsByKey(key)
    const values2 = dataRange.getValues()
    YKLiblog.Log.debug( `values2=${JSON.stringify(values2)}` );
    targetedEmailIds.addToDone([10,20, 30])
    // YKLiblog.Log.debug([...targetedEmailIds.done])
    idtabledata.rewrite(targetedEmailIds)
  })
  idtabledata.update()
}
function test_gmail_hw() {
  // const basename = Store.hotwireWeekly()
  const basename = "Hotwire Weekly"
  const store = get_valid_store(basename, null)
  const ssId = CONFIG.configSpreadsheetId;
  // const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
  const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheet(ssId, basename);
  const r = YKLiba.Range.getValidRange()

  YKLiblog.Log.debug( values[0] );

  // YKLiba.clear_sheet(sheet);
}
function test_gmail_x() {
  // const basename = Store.hotwireWeekly()
  const basename = "Hotwire Weekly"
  // const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
  const ssId = CONFIG.configSpreadsheetId;
  const [ss, sheet] = YKLibb.Gssx.setupForSpreadsheet(ssId, basename);

  const basenameDest = "testa"
  const [ssDest, sheetDest] = YKLibb.Gssx.setupForSpreadsheet(ssId, basenameDest);
  const [headerDest, valuesDest, dataRangeDest] = YKLibb.Gssx.setupSpreadsheet(ssId, basenameDest);

  const r = YKLibb.Gssx.getMinimalContentRange(sheet)
  const values = r.getValues();

  const rs = YKLiba.Range.getRangeShape(r) 
  YKLiblog.Log.debug( JSON.stringify(rs) );

  const ary = values.filter( item => typeof(item[0]) == "string" && item[0].length > 0 )
  const asoc = {}
  ary.forEach( item => asoc[item[0]] = item )

  // YKLiblog.Log.debug( JSON.stringify(Object.keys(asoc)) )
  const ary3 = Object.keys(asoc).map( key => asoc[key])  // YKLiblog.Log.debug( JSON.stringify(ary3) )
  // const dest
  height = Object.keys(asoc).length
  const range3 = YKLiba.Code.transformRange2(dataRangeDest, height, rs.w)

  const rDest = YKLibb.Gssx.getMinimalContentRange(sheetDest)

  const range4 = rDest.offset(0,0, height, rs.w)
  const range5 = sheetDest.getRange(1,1, height, rs.w)

  range5.setValues(ary3)
}
