function test_get_valid_store(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())

  const arg_store = null
  const base_name = "XYz"
  const store = get_valid_store(base_name, arg_store)
  YKLiba.Log.debug(store)
  const base_name2 = "ABc"
  const store2 = get_valid_store(base_name2, arg_store)
  YKLiba.Log.debug(store2)

  store2.set('BCD', 'EFG')
  const value = store2.get('BCD')
  YKLiba.Log.debug(value)
}

function gety(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  let index
  let store_index
  index = Store.init()
  store_index = Store.storeIndex()
  const storeA = new Store("A", index, store_index)
  YKLiba.Log.debug(`storeA.index=${storeA.index}`)
  YKLiba.Log.debug(`storeA.store_index=${storeA.store_index}`)
  index = Store.init()
  store_index = Store.storeIndex()
  const storeB = new Store("B", index, store_index)
  YKLiba.Log.debug(`storeB.idx=${storeB.idx}`)
  YKLiba.Log.debug(`storeB.store_index=${storeB.store_index}`)
}

function testx(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())

  const date = new Date()
  YKLiba.Log.debug(date)
  const inm = date.getTime()
  YKLiba.Log.debug(inm)
  const date2 = new Date(inm)
  YKLiba.Log.debug(date2)
  const inm2 = date2.getTime()
  YKLiba.Log.debug(inm2)

}