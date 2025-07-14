class SearchStatus {
  constructor(rowIndex, item, rowRange){
    this.item = item
    this.rowIndex = rowIndex
    this.rowRange = rowRange

    this.index_nth = 1
    this.nth = parseInt(item[ this.index_nth ])
    if( isNaN(this.nth) ){
      this.nth = 0
    }
  }
  rewrite(){
    this.item[this.index_nth] = this.nth
  }
  update(){
    this.rowRange.setValues( [this.item] )
  }
  getNth(){
    return this.nth
  }
  incrementNth(){
    this.nth += 1
  }
}
