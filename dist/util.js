class Util {
  static makeTabledata2(){
    const [header, values, dataRange] = CONFIG.getConfigInfo2()
    const tabledata = new Tabledata(header, values, dataRange);
    return tabledata
  }
  static makeTabledata(){
    const [header, values, dataRange] = CONFIG.getConfigInfo2x()
    const tabledata = new Tabledata(header, values, dataRange);
    return tabledata
  }
}
