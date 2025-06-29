class TargetedEmailIds {
  constructor(index, item){
    let array
    this.index = index
    this.name = item[0]
    const w = item.length
    if( w > 1){
      array = item.slice(1, w).map( str => parseInt(str) )
    }
    else{
      array = []
    }
    const done = array.filter( i => typeof(i) === "number" )
    YKLiblog.Log.debug(`TargetedEmailIds constructor done=${ JSON.stringify( [...done] ) }`)
    this.done = new Set(done)
    this.setOnly = null;
    this.arrayOnly = null;
    this.symmetric = null;
  }
  /**
   * Setと配列の差分を取得する
   * @param {Set} setObj - 比較元のSet
   * @param {Array} arrayObj - 比較対象の配列
   * @returns {{setOnly: Array, arrayOnly: Array, symmetric: Array}} 3種類の差分を含むオブジェクト
   */
  calculateSetAndArrayDifference(arrayObj) {
    const x1 = [...arrayObj]
    YKLiblog.Log.debug(`x1=${x1}`)

    const [setOnly, arrayOnly, symmetric] = Util.calculateSetAndArrayDifference(this.done, arrayObj)

    // this.doneにのみ存在する要素
    this.setOnly = setOnly;
    
    // 配列にのみ存在する要素
    this.arrayOnly = arrayOnly;
    
    // 対称差
    this.symmetric = symmetric;
  }
  addToDone(arrayObj){
    // calculateSetAndArrayDifference(arrayObj)
    YKLiblog.Log.debug(`TargetedEmailIds addToDone B this.done=${[...this.done]}`)
    arrayObj.forEach( (item) => this.done.add(item) )
    YKLiblog.Log.debug(`TargetedEmailIds addToDone A this.done=${[...this.done]}`)
  }
  getDoneAsArray(){
    const array = [...this.done]
    YKLiblog.Log.debug(`TargetedEmailIds getDoneAsArray [..this.done]=${array}`)
    return array
  }
  doneHas(el){
    return this.done.has(el)
  }
}

// 関数の使用例
function runDifferenceExample() {
  YKLiblog.Log.initLogDebug()

  // const mySet = new Set([1, 2, 3, 'A', 'B']);
  const values = ['abc', 1, 2, 3, 4, 5 ];
  const teids = new TargetedEmailIds(1, values)

  const myArray = [3, 5, 6, 7];
  const x = [...myArray]
  YKLiblog.Log.debug(`x=${x}`)

  teids.calculateSetAndArrayDifference(myArray)
  
  console.log(`teids.done=${teids.done}`)
  console.log('Setにのみ存在する:', teids.setOnly);       // [1, 2, 'A']
  console.log('配列にのみ存在する:', teids.arrayOnly);   // ['C', 'D']
  console.log('対称差:', teids.symmetric);               // [1, 2, 'A', 'C', 'D']
  teids.addToDone(teids.arrayOnly);
  console.log( `teids.done=${ [...teids.done] }` )
}
