class SearchStatus {
  constructor(rowIndex, item){
    this.rowIndex = rowIndex

    this.index_nth = 1
    this.nth = parseInt(item[ this.index_nth ])
    if( isNaN(this.nth) ){
      this.nth = 0
    }
  }
  getNth(){
    return this.nth
  }
  incrementNth(){
    this.nth += 1
  }
}