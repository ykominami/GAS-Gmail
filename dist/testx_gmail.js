///////////////////////////////
// The Hotwire Club
function get_mail_list_from_Hotwire_Club(arg_store = null){
  const basename = Store.theHotwireClub()
  // remove_labels(basename)
  const op = YKLiba.Config.addUnderRow()
  const testdata = Util.makeTabledata()
  const gmail = new Gmail(testdata)
  YKLiba.Log.debug(`basename=${basename}`)
  return gmail.getMailList(basename, op, arg_store)
  // return gmail.get_mail_list_x(basename, op, arg_store)
}

function get_mail_list_from_Frontend_Focus(arg_store = null){
  YKLiba.Log.setLogLevel(YKLiba.Log.DEBUG())
  const basename = Store.frontendFocus()
  // remove_labels(basename)
  const op = YKLiba.Config.addUnderRow()
  // const op = YKLiba.Config.REWRITE()
  const testdata = Util.makeTabledata()
  const gmail = new Gmail(testdata)
  return gmail.getMailList(basename, op, arg_store)
  // return gmail.get_mail_list_x(basename, op, arg_store)
}

// Hotwire Weekly
function get_mail_list_from_hotwire_weekly(arg_store = null){
  const basename = Store.hotwireWeekly()
  const testdata = Util.makeTabledata()
  const gmail = new Gmail(testdata)
  const op = YKLiba.Confg.addUnderRow()
  return gmail.getMailList(basename, op, arg_store)
  // return gmail.get_mail_list_x(basename, op, arg_store)
}

function getMailList_3(){
  get_mail_list_from_Hotwire_Club()
  get_mail_list_from_Frontend_Focus()
  get_mail_list_from_hotwire_weekly()
}

function remove_labels(base_name){
  pairLabel = new PairLabel(base_name)

  const threads = pairLabel.targetLabel.getThreads()
  pairLabel.targetLabel.removeFromThreads(threads)

  const threads2 = pairLabel.endLabel.getThreads()
  pairLabel.endLabel.removeFromThreads(threads2)
}

function clear_sheet(sheetname){
  const sheet = YKLiba.Arrayx.getSheetByName(sheetname)
  YKLiba.clear_sheet(sheet)
}

function testx_gmail_THC(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const basename = Store.theHotwireClub()
  const gmail = new Gmail(basename)
  gmail.main()
}
function testx_gmail_FF(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const basename = Store.frontendFocus()
  const gmail = new Gmail(basename)
  gmail.main()
}
function testx_gmail_HW(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const basename = Store.hotwireWeekly()
  const gmail = new Gmail(basename)
  gmail.main()
}

function testx_gmail(){
  const url = "https://www.google.com/url?q=https://system.reins.jp/cja/CJA_030.html?id%3D240510001099&sa=D&sntz=1&usg=AOvVaw01aDMgXy-gM-w_p4wYx5U"
  const filename = YKLiba.Url.getFilenameFromUrl(url)
  const decodedUrl = decodeURIComponent(url);
  const basename = YKLiba.Url.getBasename(decodedUrl)
  YKLiba.Log.debug(`basename=${basename}`)
}
