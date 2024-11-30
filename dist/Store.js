class Store {
  static init(){
    YKLiba.Store.init()
    Store.index = YKLiba.Store.add({})
  }
  static set(key, value){
    YKLiba.Store.set(Store.index, key, value)
  }
  static get(key){
    return YKLiba.Store.get(Store.index, key)
  }
}