function execute_Test_gmail_x(){
  execute_Test_gmail_ForTestGas()
}
function execute_Test_gmail_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail);
}

function setup_for_test_gmail(base_name){
  const pairLabel = new PairLabel(base_name)
  const queryInfo = new QueryInfo(base_name, pairLabel)
  const store = get_valid_store(base_name, null)
  return [pairLabel, queryInfo, store]
}

class Test_Gmail {
  test_thread(){
    const base_name = Store.THE_HOTWIRE_CLUB();
    // const base_name = Store.TEST_NAME()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)
    const targetLabel = pairLabel.targetLabel

    const threads = targetLabel.getThreads()
    const actual = threads.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_msgs(){
    const base_name = Store.THE_HOTWIRE_CLUB()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)
    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()
    const msgs = getMessages(threads)
  
    const actual = msgs.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_priority_inbox() {
    const threads = GmailApp.getPriorityInboxThreads()
    const msgs = getMessages(threads)
  
    const actual = msgs.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }

  /*
  test_isObject_undefined(){
    const array = undefined
    const actual = is_valid_object(array)
    const expected = false
    tester.assertEquals(actual, expected)
  }
  */
}
function test_get_mail_threads(){
  base_name = Store.THE_HOTWIRE_CLUB()
  const store = get_valid_store(base_name, null)
  const threads = get_mail_threads(store, base_name)
  return threads
}

function test_make_msgdata(){
  const msgdata = [
    "xid2234",
    "ykominami@gmail.com",
    "subject",
    "2024-11-29",
    "body1"
  ]
  return msgdata
}
function test_make_msgdata_2(){
  const msgdata = [
    "xid2235",
    "ykominami@nifty.com",
    "subject2",
    "2024-11-28",
    "body2"
  ]
  return msgdata
}
