class Store {
  static THE_HOTWIRE_CLUB(){
    return "The Hotwire Club"
  }
  static FRONTEND_FOCUS(){
    return 'Frontend Focus'
  }
  static HOTWIRE_WEEKLY(){
    return 'Hotwire Weekly'
  }
  static TEST_NAME(){
    return "0-AA-TEST_NAME"
  }
  
  static keys(){

  }
  static init(){
    const index = Store.index()
    if(index === 0){
      YKLiba.Store.init()
      const store_index = YKLiba.Store.add({})
      Store.set_store_index(store_index)
    }
    const index2 = index + 1
    Store.set_index(index2)

    return index2
  }
  static store_index(){
    return Store.get_store_index()
  }
  static set_store_index(value){
    Store.store_index_x = value
  }
  static get_store_index(){
    return Store.store_index_x
  }
  static index(){
    return Store.get_index()
  }
  static get_index(){
    if( typeof(Store.index_x) === "undefined" ){
      Store.set_index(-1)
    }
    let index = Store.index_x
    index += 1
    Store.set_index(index)
    return index
  }
  static set_index(value){
    Store.index_x = value
    YKLiba.Log.debug(`set_index Store.index_x=${Store.index_x}`)
  }
  static set(key, value){
    YKLiba.Store.set(Store.index, key, value)
  }
  static get(key){
    // return YKLiba.Store.get(Store.index, key)
    return YKLiba.Store.keys(index)
  }
  static get_valid_store(base_name, arg_store=null){
    YKLiba.Log.debug(`get_valid_store arg_store=${arg_store} base_name=${base_name}`)
    let store;
    if( arg_store === null ){
      YKLiba.Log.debug(`get_valid_store 1`)
      const store_index = Store.init()
      const idx = Store.index();
      // const store_index = Store.store_index()
      store = new Store(base_name, idx, store_index)
      // YKLiba.Store.add_level_2(store_index, base_name, {})
      YKLiba.Log.debug("get_valid_store T")
      YKLiba.Log.debug(store)
    }
    else{
      store = arg_store
      YKLiba.Log.debug("get_valid_store F")
    }
    return store
  }
  constructor(base_name, idx, store_index){
    YKLiba.Log.debug(`Store constructor base_name=${base_name}`)
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
  YKLiba.Log.debug(`get_valid_store arg_store=${arg_store} base_name=${base_name}`)
  let store;
  if( arg_store === null ){
    YKLiba.Log.debug(`get_valid_store 1`)
    const store_index = Store.init()
    const idx = Store.index();
    // const store_index = Store.store_index()
    store = new Store(base_name, idx, store_index)
    // YKLiba.Store.add_level_2(store_index, base_name, {})
    YKLiba.Log.debug("get_valid_store T")
    YKLiba.Log.debug(store)
  }
  else{
    store = arg_store
    YKLiba.Log.debug("get_valid_store F")
  }
  return store
}
