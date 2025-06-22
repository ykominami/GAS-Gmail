class Tableop {
  static getRangeShape(range){
    const row = range.getRow()
    const col = range.getColumn()
    const height = range.getNumRows()
    const width = range.getNumColumns()
    return [row, col, height, width]
  }
  static showRangeShape(range){
    let row, col, height, width
    ;[row, col, height, width] = YKLiba.Range.getRangeShape(range)
    YKLiba.Log.debug(`################# showRange row=${row} col=${col} height=${height} width=${width}`)
  }
}