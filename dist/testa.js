function y(){
  const base_name = "HOT";
  const store = get_valid_store(base_name);
  const key="folder";
  const value="FOLDER";
  store.set(key, value);
  const value2 = store.get(key);
  Logger.log(`value2=${value2}`);
}
function x(){
  let index0 = Store.init();
  Logger.log(`index0=${index0}`);
  let index1 = Store.get_index();
  Logger.log(`index1=${index1}`);
  let index2 = Store.index();
  Logger.log(`index2=${index2}`);
  const key="folder";
  const value="FOLDER";
  Store.set(key, value);
  const value2=Store.get(key);

  Logger.log(`value2=${value2}`);
}
