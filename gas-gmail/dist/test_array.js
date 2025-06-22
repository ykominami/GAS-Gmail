function test_aur_get_mail_list_from_Hotwire_Club(arg_store = null){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const basename = Store.theHotwireClub()
  const op = YKLiba.configADD_UNDER_ROW()
  test_get_mail_list(op, basename)
}

function test_rewrite_get_mail_list_from_Hotwire_Club(arg_store = null){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const basename = Store.theHotwireClub()
  const op = YKLiba.configREWRITE()
  test_get_mail_list(op, basename)
}

function test_aur_get_mail_list_from_Frontend_Focus(arg_store = null){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const basename = Store.frontendFocus()
  const op = YKLiba.configADD_UNDER_ROW()
  test_get_mail_list(op, basename)
}

function test_rewrite_get_mail_list_from_Frontend_Focus(arg_store = null){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const basename = Store.frontendFocus()
  const op = YKLiba.configREWRITE()
  test_get_mail_list(op, basename)
}

function test_acr_get_mail_list_from_hotwire_weekly(arg_store = null){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const basename = Store.hotwireWeekly()
  const op = YKLiba.configADD_UNDER_ROW()
  test_get_mail_list(op, basename)
}

function test_rewrite_get_mail_list_from_hotwire_weekly(arg_store = null){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const basename = Store.hotwireWeekly()
  const op = YKLiba.configREWRITE()
  test_get_mail_lis(op, basename)
}

function test_get_mail_list(op, basename, arg_store = null){
  const pairLabel = new PairLabel(basename)
  const queryInfo = new QueryInfo(basename, pairLabel)
  get_mail_list(basename, op, queryInfo, arg_store)
}


function execute_Test_array(){
  let failureFuncs = tester.executeTestGas(Test_gmail);
}

function test_data_array(){
  return [
    [
      [1,2],[3,4],[5,6]
    ],
    [
      [7,8],[9,10],[11,12]
    ]
  ]
}
class Test_gmaila {
/*
  test_gmail_search(){
    const query = 'is:starred subject:"IMPORTANT"'
    const start = 10
    const max = 10
    const actual = test_gmail_search(query, start, max)
    const expected = true
    tester.assertEquals(actual, expected)
  }
  */
  test_isObject_undefined(){
    const query = 'from: "Hotwire Weekly"'
    const start = 10
    const max = 10
    const actual = test_gmail_search(query, start, max)
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_ab_0(){
    YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())
    const a=test_data_array()
    const ary = a.flat()

    const actual = ary
    const expected = [[1,2],[3,4],[5,6], [7,8],[9,10],[11,12]]
    tester.assertEqualsArrayItems (actual, expected)
  }
  test_ab_1(){
    YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())
    let ary
    const a=[[
      [1,2],[3,4],[5,6]
    ],
      [
      [7,8],[9,10],[11,12]
    ]
    ]
    ary = a.flat(2)
    const actual = ary
    const expected = [[1,2],[3,4],[5,6], [7,8],[9,10],[11,12]]
    tester.assertEqualsArrayItems (actual, expected)
  }
  test_ab_2(){
    YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())
    let ary
    ary = test_flat_2(a)
    YKLiblog.Log.debug(ary)
  }
  test_ab_3(){
    YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())
    let ary
    ary = test_flat_3(a)
    YKLiblog.Log.debug(ary)
  }
}
function test_gl2(msgs, new_last_date){
  const x = msgs.filter( msg => {
      return isAfterDate(new_last_date, msg.getDate()) 
  } )
  YKLiblog.Log.debug(`#############`)
  YKLiblog.Log.debug(x)
  return x
}
function make_test_data_of_msg( date ){
  const ndate = new Date()
  msg = { _ndate: date }
  msg.getDate = function(){ return this._ndate }
  msg.getId = function(){ return this._ndate.getTime() }
  msg.getFrom = function(){ return this._ndate.getTime() }
  msg.getSubject = function(){ return this._ndate.getTime() }
  msg.getPlainBody = function(){ return this._ndate.getTime() }
  msg.getPlainBody = function(){ return this._ndate.getTime() }
  msg.getRawContent = function(){ return this._ndate.getTime() }
  return msg
}
function test_x(){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())
  let msg1,msg2, msg3
  const ndate = new Date()
  msg1 = make_test_data_of_msg( ndate )
  const ndate2 = new Date(2024, 11,27)
  msg2 = make_test_data_of_msg( ndate2 )
  const ndate3 = new Date(2024, 10,27)
  msg3 = make_test_data_of_msg( ndate3 )

  let msgs = [msg1, msg2, msg3]
  let last_date = null
  const [[filtered_msgs, rawcontents], new_last_date] = get_latest_date_and_valid_messages_from_message_array(msgs, last_date)
  // let new_last_date = get_lastest_date_and_register_messages_from_message_array(msgs, last_date)
  YKLiblog.Log.debug(`new_last_date=${new_last_date}`)
}

function test_gl3(msgs, new_last_date){
  n_msgs = msgs
    .filter( msg => isAfterDate(new_last_date, msg.getDate()) )
  return [n_msgs, new_last_date ]
}
