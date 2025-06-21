function xtestb(gmail, key, numOfItems = 0){
  Logger.log(`xtestb key=${key}`)
  const folderInfo = gmail.tabledata.getFolderInfo(key);

  const folderConf = gmail.folderConf;
  Logger.log(`folderInfo=${JSON.stringify(folderInfo)}`)
  Logger.log(`folderConf=${JSON.stringify(folderConf)}`)

  Logger.log(`folderInfo.old_nth=${ folderInfo.old_nth }`)
  Logger.log(`folderConf.nth=${ folderConf.nth }`)
  if(folderInfo.old_nth != folderConf.nth ){
    Logger.log(`xtestb key=${key} 1`)
    // continue
  }
  else{
    Logger.log(`xtestb key=${key} 2`)
    return
  }
  Logger.log(`xtestb key=${key} 3`)

  // return
  Logger.log(`folderConf.maxSearchesAvailable=${folderConf.maxSearchesAvailable}`)
  Logger.log(`folderConf.maxThreads=${folderConf.maxThreads}`)
  Logger.log(`folderInfo.maxSearchesAvailable=${folderInfo.maxSearchesAvailable}`)
  Logger.log(`folderInfo.maxThreads=${folderInfo.maxThreads}`)

  folderInfo.setMaxSearchesAvailable(folderConf.maxSearchesAvailable);
  folderInfo.setMaxThreads(folderConf.maxThreads);
  Logger.log(`2 folderInfo.maxSearchesAvailable=${folderInfo.maxSearchesAvailable}`)
  Logger.log(`2 folderInfo.maxThreads=${folderInfo.maxThreads}`)
  
  Logger.log(`1 folderInfo.id=${folderInfo.id}`)
  folder = folderInfo.getOrCreateFolderUnderDocsFolder(gmail.parentFolderInfo);
  Logger.log(`2 folderInfo.id=${folderInfo.id}`)
  folderInfo.backup();
  Logger.log(`3 folderInfo.maxSearchesAvailable=${folderInfo.maxSearchesAvailable}`)
  Logger.log(`3 folderInfo.maxThreads=${folderInfo.maxThreads}`)
  return

  gmail.tabledata.rewrite(folderInfo);
  gmail.tabledata.update();

  const store = gmail.get_mail_list_x(folderInfo, gmail.op);
  folderInfo.setNth(folderConf.nth);
  folderInfo.lastDateTime = store.get('last_date_time');
  Logger.log(`folderInfo=${folderInfo}`);

  gmail.tabledata.rewrite(folderInfo);
  gmail.tabledata.update();

  numOfItems = numOfItems + 1
  if( numOfItems >= folderConf.maxItems){
    return
  }
}
function xtesta(gmail, numOfItems){
  Logger.log(`xtesta`)
  for(let i=0; i < gmail.limit; i++){
    key = gmail.keyList[i]
    Logger.log(`key=${key}`)
    xtestb(gmail, key, numOfItems)
  }
}

function xtestx(){
  YKLiba.Log.setLogLevel(YKLiba.Log.DEBUG())

  // const tabledata = Util.makeTabledata()
  const tabledata = Util.makeTabledata2()
  const makeindexFlag = 3
  const gmail = new Gmail(tabledata, makeindexFlag)

  const numOfItems = 0
  xtesta(gmail, numOfItems)
}

function makeIndexes2(keyList){
  // const startIndex = 0
  const startIndex = 11
  // const endIndex = keyList.length
  const endIndex = startIndex + 1

  // Logger.log(`endIndex=${endIndex}|`)
  // Logger.log(`tabledata.folderConf.maxItems=${tabledata.folderConf.maxItems}|`)
  // Logger.log(`keyList.length=${keyList.length}|`)
  // const [_max, limit] =  getMaxAndMin([endIndex, tabledata.folderConf.maxItems , keyList.length])
  const array0 = [endIndex, keyList.length]
  // Logger.log(`array0=${array0}`)
  const [_max, limit] =  YKLiba.getMaxAndMin(array0)

  return [startIndex, limit]
}

