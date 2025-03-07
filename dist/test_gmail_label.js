function execute_Test_gmail_label_x(){
  execute_Test_gmail_label_ForTestGas()
}
function execute_Test_gmail_label_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail_Label);
}
function execute_Test_gmail_label_2_x(){
  execute_Test_gmail_label_2_ForTestGas()
}
function execute_Test_gmail_label_2_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail_Label_2);
}
function execute_Test_gmail_label_3_x(){
  execute_Test_gmail_label_3_ForTestGas()
}
function execute_Test_gmail_label_3_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail_Label_3);
}

class Test_Gmail_Label {
  // 
  test_label(){
    // YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
    let start = 0
    let max = 5
    const base_name = Store.TEST_NAME()
    const query = `from : me after:2024/12/1 before:2024/12/3`
    const [threads, msgs] = get_threads_and_messages(query, start, max)
    YKLiba.Log.debug(`testcase| threads.length=${threads.length}`)
    YKLiba.Log.debug(`testcase| msgs.length=${msgs.length}`)

    const pairLabel = new PairLabel(base_name)
    let targetLabel = pairLabel.targetLabel
    const threads_2 = targetLabel.getThreads()
    YKLiba.Log.debug(`threads_2.length=${threads_2.length}`)

    targetLabel.removeFromThreads(threads_2)

    targetLabel.addToThreads(threads)

    const threads_3 = targetLabel.getThreads()
    YKLiba.Log.debug(`threads_3.length=${threads_3.length}`)
    const msgs_3 = getMessages(threads_3)
    YKLiba.Log.debug(`msgs_3.length=${msgs_3.length}`)
    const actual = threads_3.length
    const expected = max
    tester.assertEquals(actual, expected)
  }
  test_get_msgs_by_label1(){
    let start = 0
    let max = 5
    let last_date = null
    const base_name = Store.TEST_NAME()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)

    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()
    const msgs = getMessages(threads)

    const actual = msgs.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_remove_thread_from_label(){
    let start = 0
    let max = 5
    let last_date = null
    const base_name = Store.TEST_NAME()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)

    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()
    pairLabel.targetLabel.removeFromThreads(threads)

    const threads_2 = targetLabel.getThreads()
    const msgs = getMessages(threads_2)
    
    const actual = msgs.length
    const expected = 0
    tester.assertEquals(actual, expected)
  }
  test_remove_threads_from_label(){
    let start = 0
    let max = 5
    let last_date = null
    const base_name = Store.TEST_NAME()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)
  
    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()
    targetLabel.removeFromThreads(threads)
    const threads_2 = targetLabel.getThreads()

    const actual = threads_2.length
    const expected = 0
    tester.assertEquals(actual, expected)
  }
}
class Test_Gmail_Label_2 {
}
function test_remove_labes_FF(){
  const basename = Store.FRONTEND_FOCUS()
  remove_labels(basename)
}

function test_remove_labes_THC(){
  const basename = Store.THE_HOTWIRE_CLUB()
  remove_labels(basename)
}

function test_remove_labes_HW(){
  const basename = Store.HOTWIRE_WEEKLY()
  remove_labels(basename)
}

function test_remove_labels(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())

  test_remove_labes_FF()
  test_remove_labes_THC()
  test_remove_labes_HW()
}
