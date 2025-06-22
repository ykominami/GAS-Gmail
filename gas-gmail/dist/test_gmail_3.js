function execute_Test_gmail3_x(){
  execute_Test_gmail3_ForTestGas()
}

function execute_Test_gmail3_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail3);
}

class Test_Gmail3 {
  test_register_data_rewrite_HW_a(){
    const basename = Store.testName()
    const store = get_valid_store(basename, null)
    const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
    const [ss, sheet] = YKLiba.get_spreadsheet(ssId, basename)
    YKLiba.clear_sheet(sheet);

    test_register_data_1_rewrite(store, basename)
    test_register_data_2_rewrite(store, basename)
    test_register_data_3_rewrite(store, basename)

    // const sheet = YKLiba.get_sheet(basename)
    const range = sheet.getDataRange();
    const values = range.getValues()
    const lastRow = sheet.getLastRow()
    const lastColumn = sheet.getLastColumn()

    YKLiblog.Log.debug(`lastRow=${lastRow} lastColumn=${lastColumn}`)

    const actual = (values.length === 2 && values[0].length === 5)
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_register_data_rewrite_HW_b(){
    const basename = Store.testName()
    const store = get_valid_store(basename, null)
    const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
    const [ss, sheet] = YKLiba.get_spreadsheet(ssId, basename)
    YKLiba.clear_sheet(sheet);
    // clear_sheet(basename)

    test_register_data_3_rewrite(store, basename)
    test_register_data_2_rewrite(store, basename)
    test_register_data_1_rewrite(store, basename)

    // const sheet = YKLiba.get_sheet(basename)
    const range = sheet.getDataRange();
    const values = range.getValues()
    const lastRow = sheet.getLastRow()
    const lastColumn = sheet.getLastColumn()

    YKLiblog.Log.debug(`lastRow=${lastRow} lastColumn=${lastColumn}`)

    const actual = (values.length === 1 && values[0].length === 5)
    const expected = true
    tester.assertEquals(actual, expected)

  }
  test_register_data_aur_HW_a(){
    const basename = Store.testName()
    const store = get_valid_store(basename, null)
    const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
    const [ss, sheet] = YKLiba.get_spreadsheet(ssId, basename)
    YKLiba.clear_sheet(sheet);
    // clear_sheet(basename)

    // const sheet = YKLiba.get_sheet(basename)
    const lastRow = sheet.getLastRow()
    const lastColumn = sheet.getLastColumn()
    YKLiblog.Log.debug(`lastRow=${lastRow} lastColumn=${lastColumn}`)

    test_register_data_1_aur(store, basename)
    test_register_data_2_aur(store, basename)
    test_register_data_3_aur(store, basename)

    const range = sheet.getDataRange();
    const values = range.getValues()

    YKLiblog.Log.debug(`values.length=${values.length}`)
    const lastRow_2 = sheet.getLastRow()
    const lastColumn_2 = sheet.getLastColumn()
    YKLiblog.Log.debug(`lastRow_2=${lastRow_2} lastColumn_2=${lastColumn_2}`)

    const actual = (values.length === 4 && values[0].length === 5)
    const expected = true
    tester.assertEquals(actual, expected)
  }
  test_register_data_aur_HW_b(){
    const basename = Store.hotwireWeekly()
    const store = get_valid_store(basename, null)
    const ssId = "1Mz4pqoclYFPSmbNlpf_g18CUNTcxt68KkKFVTNEJGg4";
    const [ss, sheet] = YKLiba.get_spreadsheet(ssId, basename)
    YKLiba.clear_sheet(sheet);
    // clear_sheet(basename)

    //const sheet = YKLiba.get_sheet(basename)
    const lastRow = sheet.getLastRow()
    const lastColumn = sheet.getLastColumn()
    YKLiblog.Log.debug(`lastRow=${lastRow} lastColumn=${lastColumn}`)

    test_register_data_3_aur(store, basename)
    test_register_data_2_aur(store, basename)
    test_register_data_1_aur(store, basename)

    const range = sheet.getDataRange();
    const values = range.getValues()

    YKLiblog.Log.debug(`values.length=${values.length}`)
    const lastRow_2 = sheet.getLastRow()
    const lastColumn_2 = sheet.getLastColumn()
    YKLiblog.Log.debug(`lastRow_2=${lastRow_2} lastColumn_2=${lastColumn_2}`)

    const actual = (values.length === 4 && values[0].length === 5)
    const expected = true
    tester.assertEquals(actual, expected)
  }
}

function execute_Test_gmail32_x(){
  execute_Test_gmail32_ForTestGas()
}
function execute_Test_gmail32_ForTestGas(){
  let failureFuncs = tester.executeTestGas(Test_Gmail32);
}
class Test_Gmail32 {
}

// rewrite
// 済
function test_register_data_x_rewrite_a(base_name){
  const store = get_valid_store(base_name, null)
  test_register_data_1_rewrite(store, base_name)
  test_register_data_2_rewrite(store, base_name)
  test_register_data_3_rewrite(store, base_name)
}

// 済
function test_register_data_x_rewrite_b(base_name){
  const store = get_valid_store(base_name, null)
  test_register_data_3_rewrite(store, base_name)
  test_register_data_2_rewrite(store, base_name)
  test_register_data_1_rewrite(store, base_name)
}

// aur
// 済
function test_register_data_x_aur_a(base_name){
  const store = get_valid_store(base_name, null)
  test_register_data_1_aur(store, base_name)
  test_register_data_2_aur(store, base_name)
  test_register_data_3_aur(store, base_name)
}
// 済
function test_register_data_x_aur_b(base_name){
  const store = get_valid_store(base_name, null)
  test_register_data_3_aur(store, base_name)
  test_register_data_2_aur(store, base_name)
  test_register_data_1_aur(store, base_name)
}

//////////////// aur
// 済
function test_register_data_1_aur(store, sheetname){
  let result = []
  Dataregister.registerData(store, YKLiba.configADD_UNDER_ROW(), result, sheetname)
}

// 済
function test_register_data_2_aur(store, sheetname){
  let result = []
  const msgdata = test_make_msgdata()
  result.push(msgdata)
  Dataregister.registerData(store, YKLiba.configADD_UNDER_ROW(), result, sheetname)
}

// 済
function test_register_data_3_aur(store, sheetname){
  let result = []
  const msgdata = test_make_msgdata()
  result.push(msgdata)

  const msgdata2 = test_make_msgdata_2()
  result.push(msgdata2)
  Dataregister.registerData(store, YKLiba.configADD_UNDER_ROW(), result, sheetname)
}
//////////////// rewrite
// 済
function test_register_data_1_rewrite(store, sheetname){
  let result = []
  Dataregister.registerData(store, YKLiba.configREWRITE(), result, sheetname)
}
// 済
function test_register_data_2_rewrite(store, sheetname){
  let result = []
  const msgdata = test_make_msgdata()
  result.push(msgdata)
  Dataregister.registerData(store, YKLiba.configREWRITE(), result, sheetname)
}
// 済
function test_register_data_3_rewrite(store, sheetname){
  let result = []
  const msgdata = test_make_msgdata()
  result.push(msgdata)

  const msgdata2 = test_make_msgdata_2()
  result.push(msgdata2)
  Dataregister.registerData(store, YKLiba.configREWRITE(), result, sheetname)
}
