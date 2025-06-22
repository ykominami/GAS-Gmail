function xtestb(gmail, key, numOfItems = 0){
  Logger.log(`xtestb key=${key}`)
  const targetedEmail = gmail.tabledata.getTargetedEmail(key);

  const folderConf = gmail.folderConf;
  Logger.log(`targetedEmail=${JSON.stringify(targetedEmail)}`)
  Logger.log(`folderConf=${JSON.stringify(folderConf)}`)

  Logger.log(`targetedEmail.old_nth=${ targetedEmail.old_nth }`)
  Logger.log(`folderConf.nth=${ folderConf.nth }`)
  if(targetedEmail.old_nth != folderConf.nth ){
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
  Logger.log(`targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  Logger.log(`targetedEmail.maxThreads=${targetedEmail.maxThreads}`)

  targetedEmail.setMaxSearchesAvailable(folderConf.maxSearchesAvailable);
  targetedEmail.setMaxThreads(folderConf.maxThreads);
  Logger.log(`2 targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  Logger.log(`2 targetedEmail.maxThreads=${targetedEmail.maxThreads}`)
  
  Logger.log(`1 targetedEmail.id=${targetedEmail.id}`)
  folder = targetedEmail.getOrCreateFolderUnderDocsFolder(gmail.parentFolderInfo);
  Logger.log(`2 targetedEmail.id=${targetedEmail.id}`)
  targetedEmail.backup();
  Logger.log(`3 targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  Logger.log(`3 targetedEmail.maxThreads=${targetedEmail.maxThreads}`)
  // return

  gmail.tabledata.rewrite(targetedEmail);
  gmail.tabledata.update();
  // return

  const gmailList = new GmailList(targetedEmail, gmail.tabledata);
  const store = gmailList.getMailListX(gmail.op);
  targetedEmail.setNth(folderConf.nth);
  targetedEmail.lastDateTime = store.get('last_date_time');
  Logger.log(`targetedEmail=${targetedEmail}`);

  gmail.tabledata.rewrite(targetedEmail);
  gmail.tabledata.update();

  numOfItems = numOfItems + 1

  return numOfItems
}
function xtesta(gmail, numOfItems){
  Logger.log(`xtesta gmail.limit=${gmail.limit}`)
  for(let i=0; i < gmail.limit; i++){
    key = gmail.keyList[i]
    Logger.log(`key=${key}`)
    numOfItems = xtestb(gmail, key, numOfItems)
    const folderConf = gmail.folderConf;

    if( numOfItems >= gmail.folderConf.maxItems){
      Logger.log(`xtesta break numOfItems=${numOfItems} gmail.folderConf.maxItems=${gmail.folderConf.maxItems}`)
      break;
    }
  }
  Logger.log(`xtesta END`)
}

function xtestx(){
  YKLiba.Log.setLogLevel(YKLiba.Log.DEBUG())

  // const tabledata = Util.makeTabledata()
  const tabledata = Util.makeTabledata2()
  const makeindexFlag = 3
  // Logger.log(`tabledata=${JSON.stringify(tabledata.values)}`)
  const gmail = new Gmail(tabledata, makeindexFlag)
  const numOfItems = 0
  xtesta(gmail, numOfItems)
}
