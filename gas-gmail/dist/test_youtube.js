let tester = TestGAS.createExecutor();

function execute_Test_youtube(){
  let failureFuncs = tester.executeTestGas(Test_youtube);
}

function test_searchByKeyword(keyword, limit = 25){
  ret = searchByKeyword(keyword, limit)
  return ret  
}

class Test_youtube {
  test_isObject_null(){
    const keyword = "Rails Hotwire"
    // const keyword = "dog"
    // const keyword = "cat"
    const actual = test_searchByKeyword(keyword)
    const expected = true
    tester.assertEquals(actual, expected)
  }
}
