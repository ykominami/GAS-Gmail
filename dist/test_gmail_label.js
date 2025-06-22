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

class TestGmailLabel {
  // 
  test_label(){
    // YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
    let start = 0
    let max = 5
    const base_name = Store.testName()
    const query = `from : me after:2024/12/1 before:2024/12/3`
    const tamda = GmailSearch.getThreadsAndMessagedataArray(query, start, max)
    tamda.forEach( function(item, idx) {
      Logger.log(`tamda idx=${idx} item.constructor=${ item.constructor }`)
      Logger.log(`tamda item=${ JSON.stringify(item)}`)
      Logger.log(`tamda item.ar()=${ JSON.stringify(item.ar()) }` )
    })
    Logger.log(`tamda.constructor=${tamda.constructor}`)
    // YKLiba.Log.debug(`testcase| tamda.thread=${tamda.tx()}`)
    // YKLiba.Log.debug(`testcase| tamda.messagedataArray.length=${tamda.mx().length}`)

    const pairLabel = new PairLabel(base_name)
    let targetLabel = pairLabel.targetLabel
    const threads_2 = targetLabel.getThreads()
    threads_2.forEach( (item, index) => {
      const messages = item.getMessages()
      return messages
    })
    YKLiba.Log.debug(`threads_2.length=${threads_2.length}`)

    targetLabel.removeFromThreads(threads_2)
    const txs = tamda.filter((item) => {
      return item.tx
    })
    targetLabel.addToThreads(txs)

    const threads_3 = targetLabel.getThreads()
    YKLiba.Log.debug(`threads_3.length=${threads_3.length}`)
    const msgs_3 = threads_3.filter( (item, index) => {
      return item.getMessages()      
    })
    YKLiba.Log.debug(`msgs_3.length=${msgs_3.length}`)
    const actual = threads_3.length
    const expected = max
    tester.assertEquals(actual, expected)
  }
  test_get_msgs_by_label1(){
    let start = 0
    let max = 5
    let last_date = null
    const base_name = Store.testName()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)

    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()
    const msgs = threads.filter( (item) => {
      return item.getMessages()
    })

    const actual = msgs.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_remove_thread_from_label(){
    let start = 0
    let max = 5
    let last_date = null
    const base_name = Store.testName()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)

    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()
    pairLabel.targetLabel.removeFromThreads(threads)

    const threads_2 = targetLabel.getThreads()
    const msgs = threads_2.filter( (item) => {
      return item.getMessages()
    } )
    
    const actual = msgs.length
    const expected = 0
    tester.assertEquals(actual, expected)
  }
  test_remove_threads_from_label(){
    let start = 0
    let max = 5
    let last_date = null
    const base_name = Store.testName()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)
  
    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()
    targetLabel.removeFromThreads(threads)
    const threads_2 = targetLabel.getThreads()

    const actual = threads_2.length
    const expected = 0
    tester.assertEquals(actual, expected)
  }
  test_get_labels(){
    const pairLabel = new PairLabel("test")
    const actual = pairLabel.labels.length
    tester.assert(actual > 0, "labels.length > 0")
  }
  test_get_threads_A(){
    const base_name = Store.testName()
    const pairLabel = new PairLabel(base_name)
    const threads = pairLabel.targetLabel.getThreads()
    tester.assertEquals(threads.length, 0)
  }
  test_label_A(){
    const base_name = Store.testName()
    const pairLabel = new PairLabel(base_name)
    const threads = pairLabel.get_threads_A()
    tester.assertEquals(threads.length, 0)
  }
  test_label_B(){
    const base_name = Store.testName()
    const pairLabel = new PairLabel(base_name)
    const threads = pairLabel.get_threads_B()
  }
  test_label_C(){
    const base_name = Store.testName()
    const pairLabel = new PairLabel(base_name)
    const threads = pairLabel.get_threads_C()
  }
  test_paired_label(){
    let basename
    basename = Store.frontendFocus()
    const pairLabel = new PairLabel(basename)
    pairLabel.do_label()

    basename = Store.theHotwireClub()
    const pairLabel2 = new PairLabel(basename)
    pairLabel2.do_label()

    basename = Store.hotwireWeekly()
    const pairLabel3 = new PairLabel(basename)
    pairLabel3.do_label()
  }
}
class Test_Gmail_Label_2 {
}
function test_remove_labes_FF(){
  const basename = Store.frontendFocus()
  remove_labels(basename)
}

function test_remove_labes_THC(){
  const basename = Store.theHotwireClub()
  remove_labels(basename)
}

function test_remove_labes_HW(){
  const basename = Store.hotwireWeekly()
  remove_labels(basename)
}

function test_remove_labels(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())

  test_remove_labes_FF()
  test_remove_labes_THC()
  test_remove_labes_HW()
}
