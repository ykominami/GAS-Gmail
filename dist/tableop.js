class Tableop {
  static showRange(range){
    const row = range.getRow()
    const col = range.getColumn()
    const height = range.getNumRows()
    const width = range.getNumColumns()
    // Logger.log(`################# showRange row=${row} col=${col} height=${height} width=${width}`)
    return [row, col, height, width]
  }
}