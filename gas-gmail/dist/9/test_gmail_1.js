
// let tester = TestGAS.createExecutor();

function execute_Test_gmail1(){
  let failureFuncs = tester.executeTestGas(Test_gmail1);
}

function test_gmail_search(query, start, max){
  ret = GmailSearch.gmail_search(query, start, max)
  return ret[0]  
}

class Test_gmail1 {
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
