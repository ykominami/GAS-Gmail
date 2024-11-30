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
