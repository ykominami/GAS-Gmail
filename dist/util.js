class Util {
  static makeTabledata2(){
    const [header, values, dataRange] = CONFIG.getConfigInfo2()
    YKLiba.Log.debug(`values=${values}`)
    const tabledata = new Tabledata(header, values, dataRange);
    return tabledata
  }
  static makeTabledata(){
    const [header, values, dataRange] = CONFIG.getConfigInfo2x()
    YKLiba.Log.debug(`values=${values}`)
    const tabledata = new Tabledata(header, values, dataRange);
    return tabledata
  }
}

function getValuesFromSheet(){
  const sheet = getSheet();
  YKLiba.Log.debug(`values=${values}`)
  const values = sheet.getDataRange().getValues();
  return values;
}
function getSheet(){
  const ss = getSpreadsheet()
  YKLiba.Log.debug(`values=${values}`)
  const sheet = ss.getActiveSheet()
  return sheet
}
