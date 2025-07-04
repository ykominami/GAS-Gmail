function xtestb(gmail, key, numOfItems = 0){
  YKLiblog.Log.debug(`xtestb key=${key}`)
  const targetedEmail = gmail.tabledata.getTargetedEmail(key);

  const folderConf = gmail.folderConf;
  YKLiblog.Log.debug(`targetedEmail=${JSON.stringify(targetedEmail)}`)
  YKLiblog.Log.debug(`folderConf=${JSON.stringify(folderConf)}`)

  YKLiblog.Log.debug(`targetedEmail.old_nth=${ targetedEmail.old_nth }`)
  YKLiblog.Log.debug(`folderConf.nth=${ folderConf.nth }`)
  if(targetedEmail.old_nth != folderConf.nth ){
    YKLiblog.Log.debug(`xtestb key=${key} 1`)
    // continue
  }
  else{
    YKLiblog.Log.debug(`xtestb key=${key} 2`)
    // return
  }
  YKLiblog.Log.debug(`xtestb key=${key} 3`)

  // return
  YKLiblog.Log.debug(`folderConf.maxSearchesAvailable=${folderConf.maxSearchesAvailable}`)
  YKLiblog.Log.debug(`folderConf.maxThreads=${folderConf.maxThreads}`)
  YKLiblog.Log.debug(`targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  YKLiblog.Log.debug(`targetedEmail.maxThreads=${targetedEmail.maxThreads}`)

  targetedEmail.setMaxSearchesAvailable(folderConf.maxSearchesAvailable);
  targetedEmail.setMaxThreads(folderConf.maxThreads);
  YKLiblog.Log.debug(`2 targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  YKLiblog.Log.debug(`2 targetedEmail.maxThreads=${targetedEmail.maxThreads}`)
  
  YKLiblog.Log.debug(`1 targetedEmail.folderId=${targetedEmail.folderId}`)
  folder = targetedEmail.getOrCreateFolderUnderSpecifiedFolder(gmail.parentFolderInfo);
  YKLiblog.Log.debug(`2 targetedEmail.folderId=${targetedEmail.folderId}`)
  targetedEmail.backup();
  YKLiblog.Log.debug(`3 targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  YKLiblog.Log.debug(`3 targetedEmail.maxThreads=${targetedEmail.maxThreads}`)
  // return

  gmail.tabledata.rewrite(targetedEmail);
  gmail.tabledata.update();
  // return

  const gmailList = new GmailList(targetedEmail, gmail.tabledata);
  const store = gmailList.getMailListX(gmail.op);
  targetedEmail.setNth(folderConf.nth);
  targetedEmail.setLastDateTime(store.get('last_date_time'));
  YKLiblog.Log.debug(`targetedEmail=${targetedEmail}`);

  gmail.tabledata.rewrite(targetedEmail);
  gmail.tabledata.update();

  numOfItems = numOfItems + 1

  return numOfItems
}
function xtesta(gmail, numOfItems){
  YKLiblog.Log.debug(`xtesta gmail.limit=${gmail.limit}`)
  for(let i=0; i < gmail.limit; i++){
    key = gmail.keyList[i]
    YKLiblog.Log.debug(`key=${key}`)
    numOfItems = xtestb(gmail, key, numOfItems)
    const folderConf = gmail.folderConf;

    if( numOfItems >= gmail.folderConf.maxItems){
      YKLiblog.Log.debug(`xtesta break numOfItems=${numOfItems} gmail.folderConf.maxItems=${gmail.folderConf.maxItems}`)
      break;
    }
  }
  YKLiblog.Log.debug(`xtesta END`)
}

function xtestx(){
  // YKLiblog.Log.setLogLevel(YKLiblog.Log.UNKNOWN())
  // YKLiblog.Log.setLogLevel(YKLiblog.Log.FAULT())
  // YKLiblog.Log.setLogLevel(YKLiblog.Log.ERROR())
  // YKLiblog.Log.setLogLevel(YKLiblog.Log.WARN())
  // YKLiblog.Log.setLogLevel(YKLiblog.Log.INFO())
   YKLiblog.Log.setLogLevel(YKLiblog.Log.DEBUG())

  // const tabledata = UtilGmail.makeTabledata()
  const tabledata = UtilGmail.makeTabledata2()
  const makeindexFlag = 3
  // YKLiblog.Log.debug(`tabledata=${JSON.stringify(tabledata.values)}`)
  const gmail = new Gmail(tabledata, makeindexFlag)
  const numOfItems = 0
  xtesta(gmail, numOfItems)
}
