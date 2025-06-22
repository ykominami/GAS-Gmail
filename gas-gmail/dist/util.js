class Util {
  static makeTabledata2(){
    const [header, values, dataRange] = CONFIG.getConfigInfo2()
    YKLiblog.Log.debug(`values=${values}`)
    const tabledata = new Tabledata(header, values, dataRange);
    return tabledata
  }
  static makeTabledata(){
    const [header, values, dataRange] = CONFIG.getConfigInfo2x()
    YKLiblog.Log.debug(`values=${values}`)
    const tabledata = new Tabledata(header, values, dataRange);
    return tabledata
  }
}

function getValuesFromSheet(){
  const sheet = getSheet();
  YKLiblog.Log.debug(`values=${values}`)
  const values = sheet.getDataRange().getValues();
  return values;
}
function getSheet(){
  const ss = getSpreadsheet()
  YKLiblog.Log.debug(`values=${values}`)
  const sheet = ss.getActiveSheet()
  return sheet
}
