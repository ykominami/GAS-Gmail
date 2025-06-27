function test_gmail_ids(){
  YKLiblog.Log.initLogDebug()

  const basename = "_ids"
  const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
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
function test_set(){
  const done = new Set([1,2,3])
  done.add(4)
  done.add(1)
  done.add(...[1,5,6])
  YKLiblog.Log.debug( [...done] )
}
function test_gmail_hw() {
  // const basename = Store.hotwireWeekly()
  const basename = "Hotwire Weekly"
  const store = get_valid_store(basename, null)
  const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
  const [header, values, dataRange] = YKLibb.Gssx.setupSpreadsheet(ssId, basename);
  const r = YKLiba.Range.getValidRange()

  YKLiblog.Log.debug( values[0] );

  // YKLiba.clear_sheet(sheet);
}
function test_gmail_x() {
  // const basename = Store.hotwireWeekly()
  const basename = "Hotwire Weekly"
  const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
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

  // const rDs=YKLiba.Range.getRangeShape(range4)
  // Logger.log( JSON.stringify(rDs) );

  range5.setValues(ary3)
}