function xtestb(gmail, key, numOfItems = 0){
  YKLiba.Log.debug(`xtestb key=${key}`)
  const targetedEmail = gmail.tabledata.getTargetedEmail(key);

  const folderConf = gmail.folderConf;
  YKLiba.Log.debug(`targetedEmail=${JSON.stringify(targetedEmail)}`)
  YKLiba.Log.debug(`folderConf=${JSON.stringify(folderConf)}`)

  YKLiba.Log.debug(`targetedEmail.old_nth=${ targetedEmail.old_nth }`)
  YKLiba.Log.debug(`folderConf.nth=${ folderConf.nth }`)
  if(targetedEmail.old_nth != folderConf.nth ){
    YKLiba.Log.debug(`xtestb key=${key} 1`)
    // continue
  }
  else{
    YKLiba.Log.debug(`xtestb key=${key} 2`)
    return
  }
  YKLiba.Log.debug(`xtestb key=${key} 3`)

  // return
  YKLiba.Log.debug(`folderConf.maxSearchesAvailable=${folderConf.maxSearchesAvailable}`)
  YKLiba.Log.debug(`folderConf.maxThreads=${folderConf.maxThreads}`)
  YKLiba.Log.debug(`targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  YKLiba.Log.debug(`targetedEmail.maxThreads=${targetedEmail.maxThreads}`)

  targetedEmail.setMaxSearchesAvailable(folderConf.maxSearchesAvailable);
  targetedEmail.setMaxThreads(folderConf.maxThreads);
  YKLiba.Log.debug(`2 targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  YKLiba.Log.debug(`2 targetedEmail.maxThreads=${targetedEmail.maxThreads}`)
  
  YKLiba.Log.debug(`1 targetedEmail.id=${targetedEmail.id}`)
  folder = targetedEmail.getOrCreateFolderUnderDocsFolder(gmail.parentFolderInfo);
  YKLiba.Log.debug(`2 targetedEmail.id=${targetedEmail.id}`)
  targetedEmail.backup();
  YKLiba.Log.debug(`3 targetedEmail.maxSearchesAvailable=${targetedEmail.maxSearchesAvailable}`)
  YKLiba.Log.debug(`3 targetedEmail.maxThreads=${targetedEmail.maxThreads}`)
  // return

  gmail.tabledata.rewrite(targetedEmail);
  gmail.tabledata.update();
  // return

  const gmailList = new GmailList(targetedEmail, gmail.tabledata);
  const store = gmailList.getMailListX(gmail.op);
  targetedEmail.setNth(folderConf.nth);
  targetedEmail.lastDateTime = store.get('last_date_time');
  YKLiba.Log.debug(`targetedEmail=${targetedEmail}`);

  gmail.tabledata.rewrite(targetedEmail);
  gmail.tabledata.update();

  numOfItems = numOfItems + 1

  return numOfItems
}
function xtesta(gmail, numOfItems){
  YKLiba.Log.debug(`xtesta gmail.limit=${gmail.limit}`)
  for(let i=0; i < gmail.limit; i++){
    key = gmail.keyList[i]
    YKLiba.Log.debug(`key=${key}`)
    numOfItems = xtestb(gmail, key, numOfItems)
    const folderConf = gmail.folderConf;

    if( numOfItems >= gmail.folderConf.maxItems){
      YKLiba.Log.debug(`xtesta break numOfItems=${numOfItems} gmail.folderConf.maxItems=${gmail.folderConf.maxItems}`)
      break;
    }
  }
  YKLiba.Log.debug(`xtesta END`)
}

function xtestx(){
  YKLiba.Log.setLogLevel(YKLiba.Log.DEBUG())

  // const tabledata = Util.makeTabledata()
  const tabledata = Util.makeTabledata2()
  const makeindexFlag = 3
  // YKLiba.Log.debug(`tabledata=${JSON.stringify(tabledata.values)}`)
  const gmail = new Gmail(tabledata, makeindexFlag)
  const numOfItems = 0
  xtesta(gmail, numOfItems)
}
