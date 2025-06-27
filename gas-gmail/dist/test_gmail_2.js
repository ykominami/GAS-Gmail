function execute_Test_gmail_x(){
  execute_Test_gmail_ForTestGas()
}
function execute_Test_gmail_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail2);
}

function setup_for_test_gmail(base_name){
  const pairLabel = new PairLabel(base_name)
  const queryInfo = new QueryInfo(base_name, pairLabel)
  const store = get_valid_store(base_name, null)
  return [pairLabel, queryInfo, store]
}

class Test_Gmail2 {
  test_thread(){
    const base_name = Store.theHotwireClub();
    // const base_name = Store.testName()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)
    const targetLabel = pairLabel.targetLabel

    const threads = targetLabel.getThreads()
    const actual = threads.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_msgs(){
    const base_name = Store.theHotwireClub()
    const [pairLabel, queryInfo, store] = setup_for_test_gmail(base_name)
    const targetLabel = pairLabel.targetLabel
    const threads = targetLabel.getThreads()

    const threadAndMessagedataarrayList = threads.map( (thread) => {
      return thread.getMessages()
    } )
  
    const actual = threadAndMessagedataarrayList.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_priority_inbox() {
    const threads = GmailApp.getPriorityInboxThreads()
    const threadAndMessagedataarrayList = threads.map( (thread) => {
      return thread.getMessages()
    } )
  
    const actual = threadAndMessagedataarrayList.length > 0
    const expected = true
    tester.assertEquals(actual, expected)
  }

}
function test_get_mail_threads(){
  base_name = Store.theHotwireClub()
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

function test_gmail_2_1(){
  const gmail = new Gmail()
  const base_name = Store.theHotwireClub();
  // const base_name = Store.testName()
  gmail.init(base_name, "test_gmail_2_1")
  const thread = gmail.threads[0]
}

function test_gmail_2_2(){
  const gmail = new Gmail()
  gmail.init_("test_gmail_2_2", ()=>{
    const base_name = Store.theHotwireClub()
    return gmail.search_query(base_name)
  })
  const thread = gmail.threads[0]
}

function test_gmail_2_3(){
  let base_name;
  const gmail = new Gmail()
  gmail.init_("test_gmail_2_3", ()=>{
    base_name = Store.theHotwireClub()
    return gmail.search_query(base_name)
  })
}
