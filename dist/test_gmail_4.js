function execute_Test_gmail4_x(){
  execute_Test_gmail4_ForTestGas()
}
function execute_Test_gmail4_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail4);
}

class Test_Gmail4 {
  test_clear_sheet_THC(){
    YKLiba.Log.set_log_level( YKLiba.Log.DEBUG() )

    const basename = Store.THE_HOTWIRE_CLUB()
    clear_sheet(basename)
    const sheet = YKLiba.get_sheet(basename)
    const range = sheet.getDataRange();
    const values = range.getValues()

    const actual = (values.length === 1 && values[0].length === 1)
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_clear_sheet_FF(){
    YKLiba.Log.set_log_level( YKLiba.Log.DEBUG() )

    const basename = Store.FRONTEND_FOCUS()
    clear_sheet(basename)
    const sheet = YKLiba.get_sheet(basename)
    const range = sheet.getDataRange();
    const values = range.getValues()

    const actual = (values.length === 1 && values[0].length === 1)
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_clear_sheet_HW(){
    YKLiba.Log.set_log_level( YKLiba.Log.DEBUG() )

    const basename = Store.HOTWIRE_WEEKLY()
    clear_sheet(basename)
    const sheet = YKLiba.get_sheet(basename)
    const range = sheet.getDataRange();
    const values = range.getValues()

    const actual = (values.length === 1 && values[0].length === 1)
    const expected = true
    tester.assertEquals(actual, expected)
  }
}
