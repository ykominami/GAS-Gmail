class Tableop {
  static getRangeShape(range){
    const row = range.getRow()
    const col = range.getColumn()
    const height = range.getNumRows()
    const width = range.getNumColumns()
    return [row, col, height, width]
  }
  static showRangeShape(range){
    const [row, col, height, width] = Tableop.getRangeShape(range)
    Logger.log(`################# showRange row=${row} col=${col} height=${height} width=${width}`)
  }
}