function test_get_valid_store(){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const arg_store = null
  const base_name = "XYz"
  const store = get_valid_store(base_name, arg_store)
  YKLiblog.Log.debug(store)
  const base_name2 = "ABc"
  const store2 = get_valid_store(base_name2, arg_store)
  YKLiblog.Log.debug(store2)

  store2.set('BCD', 'EFG')
  const value = store2.get('BCD')
  YKLiblog.Log.debug(value)
}

function gety(){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())
  let index
  let store_index
  index = Store.init()
  store_index = Store.storeIndex()
  const storeA = new Store("A", index, store_index)
  YKLiblog.Log.debug(`storeA.index=${storeA.index}`)
  YKLiblog.Log.debug(`storeA.store_index=${storeA.store_index}`)
  index = Store.init()
  store_index = Store.storeIndex()
  const storeB = new Store("B", index, store_index)
  YKLiblog.Log.debug(`storeB.idx=${storeB.idx}`)
  YKLiblog.Log.debug(`storeB.store_index=${storeB.store_index}`)
}

function testx(){
  YKLiblog.Log.set_log_level(YKLiblog.Log.DEBUG())

  const date = new Date()
  YKLiblog.Log.debug(date)
  const inm = date.getTime()
  YKLiblog.Log.debug(inm)
  const date2 = new Date(inm)
  YKLiblog.Log.debug(date2)
  const inm2 = date2.getTime()
  YKLiblog.Log.debug(inm2)

}