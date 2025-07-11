class Store {
  static theHotwireClub(){
    return "The Hotwire Club"
  }
  static frontendFocus(){
    return 'Frontend Focus'
  }
  static hotwireWeekly(){
    return 'Hotwire Weekly'
  }
  static testName(){
    return "0-AA-TEST_NAME"
  }
  
  static keys(){

  }
  static init(){
    const index = Store.index()
    if(index === 0){
      YKLiba.Store.init()
      const store_index = YKLiba.Store.add({})
      Store.setStoreIndex(store_index)
    }
    const index2 = index + 1
    Store.setIndex(index2)

    return index2
  }
  static storeIndex(){
    return Store.getStoreIndex()
  }
  static setStoreIndex(value){
    Store.store_index_x = value
  }
  static getStoreIndex(){
    return Store.store_index_x
  }
  static index(){
    return Store.getIndex()
  }
  static getIndex(){
    if( typeof(Store.index_x) === "undefined" ){
      Store.setIndex(-1)
    }
    let index = Store.index_x
    index += 1
    Store.setIndex(index)
    return index
  }
  static setIndex(value){
    Store.index_x = value
    YKLiblog.Log.debug(`set_index Store.index_x=${Store.index_x}`)
  }
  static set(key, value){
    YKLiba.Store.set(Store.index, key, value)
  }
  static get(key){
    // return YKLiba.Store.get(Store.index, key)
    return YKLiba.Store.keys(index)
  }
  static getValidStore(base_name, arg_store=null){
    YKLiblog.Log.debug(`get_valid_store arg_store=${arg_store} base_name=${base_name}`)
    let store;
    if( arg_store === null ){
      YKLiblog.Log.debug(`get_valid_store 1`)
      const store_index = Store.init()
      const idx = Store.index();
      // const store_index = Store.storeIndex()
      store = new Store(base_name, idx, store_index)
      // YKLiba.Store.add_level_2(store_index, base_name, {})
      YKLiblog.Log.debug("get_valid_store T")
      YKLiblog.Log.debug(store)
    }
    else{
      store = arg_store
      YKLiblog.Log.debug("get_valid_store F")
    }
    return store
  }
  constructor(base_name, idx, store_index){
    YKLiblog.Log.debug(`Store constructor base_name=${base_name}`)
    this.base_name = base_name
    this.idx = idx
    this.store_index = store_index
    YKLiba.Store.add_level_3(this.store_index, this.idx, this.base_name, {})
  }
  set(key, value){
    YKLiba.Store.set_level_3(this.store_index, this.idx, this.base_name, key, value)
  }
  get(key){
    return YKLiba.Store.get_level_3(this.store_index, this.idx, this.base_name, key)
  }
  keys(){
    return YKLiba.Store.keys_level_3(this.store_index, this.index, this.base_name)
  }
}

function get_valid_store(base_name, arg_store=null){
  YKLiblog.Log.debug(`get_valid_store arg_store=${arg_store} base_name=${base_name}`)
  let store;
  if( arg_store === null ){
    YKLiblog.Log.debug(`get_valid_store 1`)
    const store_index = Store.init()
    const idx = Store.index();
    // const store_index = Store.storeIndex()
    store = new Store(base_name, idx, store_index)
    // YKLiba.Store.add_level_2(store_index, base_name, {})
    YKLiblog.Log.debug("get_valid_store T")
    YKLiblog.Log.debug(store)
  }
  else{
    store = arg_store
    YKLiblog.Log.debug("get_valid_store F")
  }
  return store
}
