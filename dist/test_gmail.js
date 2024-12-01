function test_label_Frontend_Focus(){
  removeFromThread(thread)
  removeFromThread(thread)
}
function test_remove_labes(){
  remove_labels('Frontend Focus')
}


function execute_Test_gmail(){
  let failureFuncs = tester.executeTestGas(Test_gmail);
}

function test_gmail_search(query, start, max){
  ret = gmail_search(query, start, max)
  return ret[0]  
}

class Test_gmail {
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
}
function test_ab(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  let ary
  const a=[[
    [1,2],[3,4],[5,6]
  ],
    [
    [7,8],[9,10],[11,12]
  ]
  ]
  ary = test_flat_0(a)
  YKLiba.Log.debug(ary)

  ary = test_flat_1(a)
  YKLiba.Log.debug(ary)

  ary = test_flat_2(a)
  YKLiba.Log.debug(ary)

  ary = test_flat_3(a)
  YKLiba.Log.debug(ary)
}
function test_flat_0(a){
  return a.reduce((ac, item) => {
    const ary2 = item.reduce((ac2, item2) => {
      return [...ac2, ...item2]
    })
    return [...ac, ...ary2]
  }, [])
}
function test_flat_1(a){
  return a.flat(1)
}
function test_flat_2(a){
  return a.flat(2)
}
function test_flat_3(a){
  return a.flat(3)
}
function test_gl2(msgs, new_last_date){
  const x = msgs.filter( msg => {
      return isAfterDate(new_last_date, msg.getDate()) 
  } )
  YKLiba.Log.debug(`#############`)
  YKLiba.Log.debug(x)
  return x
}
function make_test_data_of_msg( date ){
  const ndate = new Date()
  msg = { _ndate: date }
  msg.getDate = function(){ return this._ndate }
  return msg
}
function test_x(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  let msg1,msg2, msg3
  const ndate = new Date()
  msg1 = make_test_data_of_msg( ndate )
  const ndate2 = new Date(2024, 11,27)
  msg2 = make_test_data_of_msg( ndate2 )
  const ndate3 = new Date(2024, 10,27)
  msg3 = make_test_data_of_msg( ndate3 )

  let msgs = [msg1, msg2, msg3]
  let last_date = null
  let new_last_date = get_lastest_date_and_register_messages_from_message_array(msgs, last_date)
  YKLiba.Log.debug(`new_last_date=${new_last_date}`)

  msgs = [msg3, msg2, msg1]
  last_date = null
  new_last_date = get_lastest_date_and_register_messages_from_message_array(msgs, last_date)
  YKLiba.Log.debug(`new_last_date=${new_last_date}`)
}

function test_gl3(msgs, new_last_date){
  n_msgs = msgs
    .filter( msg => isAfterDate(new_last_date, msg.getDate()) )
  return [n_msgs, new_last_date ]
}
