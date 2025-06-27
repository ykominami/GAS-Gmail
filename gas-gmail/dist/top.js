class Top {
  constructor(limitx, maxIndexFlag = 3){
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.UNKNOWN())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.FAULT())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.ERROR())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.WARN())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.INFO())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.DEBUG())
    YKLiblog.Log.setLogLevel(YKLiblog.Log.DEBUG())
    this.makeIndexFlag = maxIndexFlag
    YKLiblog.Log.debug(`this.makeindexFlag=${this.makeIndexFlag}`)

    this.limitx = limitx
  }
  setup(){
    const tabledata = Util.makeTabledata2()
    this.tabledata = tabledata
    const idtabledata = Util.makeIdTabledata()
    const keys = tabledata.keys()
    idtabledata.adjust(keys)
    this.idtabledata = idtabledata
    YKLiblog.Log.debug(`Top setup this.idtabledata.targetedEmailIdsList=${this.idtabledata.targetedEmailIdsList}`)

    const gmail = new Gmail(this.limitx, tabledata, idtabledata, this.makeIndexFlag)
    this.gmail = gmail
    this.numOfItems = 0

    YKLiblog.Log.debug(`Top constructor this.limitx=${this.limitx}`)
    // const tabledata = Util.makeTabledata()
  }
  start(){
    YKLiblog.Log.debug(`Top constructor gmail.limitx=${this.gmail.limitx}`)
    YKLiblog.Log.debug(`Top constructor this.gmail.limit=${this.gmail.limit}`)

    this.explore(this.gmail, this.numOfItems)
  }  
  explore(gmail, numOfItems){
    YKLiblog.Log.debug(`gmail`)
    YKLiblog.Log.debug(`explore gmail.limitx=${gmail.limitx}`)
    for(let i=0; i < gmail.limitx; i++){
      const key = gmail.keyList[i]
      YKLiblog.Log.debug(`i=${i} key=${key}`)
      numOfItems = this.processOneTargetedEmail(gmail, key, numOfItems)
      const folderConf = gmail.tabledata.folderConf
  
      if( numOfItems >= folderConf.maxItems){
        YKLiblog.Log.debug(`xtesta break numOfItems=${numOfItems} folderConf.maxItems=${folderConf.maxItems}`)
        break;
      }
    }
    YKLiblog.Log.debug(`explore END`)
  }
  processOneTargetedEmail(gmail, key, numOfItems = 0){
    YKLiblog.Log.debug(`getOneTargetedEmail key=${key}`)
    const targetedEmail = gmail.tabledata.getTargetedEmail(key);

    if( typeof(targetedEmail) === "undefined" ){
      return numOfItems
    }  

    const folderConf = gmail.tabledata.folderConf;
  
    if(targetedEmail.old_nth != folderConf.nth ){
      YKLiblog.Log.debug(`getOneTargetedEmail key=${key} 1`)
      // continue
    }
    else{
      YKLiblog.Log.debug(`getOneTargetedEmail key=${key} 2`)
      // return
    }
  
    targetedEmail.setMaxSearchesAvailable(folderConf.maxSearchesAvailable);
    targetedEmail.setMaxThreads(folderConf.maxThreads);
    
    targetedEmail.backup();
    // return
  
    gmail.tabledata.rewrite(targetedEmail);
    gmail.tabledata.update();
    // return
    YKLiblog.Log.debug(`Top processOneTargetedEmail gmail.tabledata=${gmail.tabledata}`)
    YKLiblog.Log.debug(`Top processOneTargetedEmail gmail.idtabledata=${gmail.idtabledata}`)
    YKLiblog.Log.debug(`Top processOneTargetedEmail gmail.idtabledata.targetedEmailIdsList=${gmail.idtabledata.targetedEmailIdsList}`)

    const gmailList = new GmailList(targetedEmail, gmail.idtabledata, gmail.limitx);
    const store = gmailList.getMailListX(gmail.op);
    targetedEmail.setNth(folderConf.nth);
    targetedEmail.lastDateTime = store.get('last_date_time');
  
    gmail.tabledata.rewrite(targetedEmail);
    gmail.tabledata.update();
  
    numOfItems += 1
  
    return numOfItems
  }      
}
function start(){
//  const top = new Top(CONFIG.limit)
  const top = new Top(3)
  top.setup()
  top.start()
}



