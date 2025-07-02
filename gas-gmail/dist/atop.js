class Top {
  constructor(limitx, maxIndexFlag = 3){
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.UNKNOWN())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.FAULT())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.ERROR())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.WARN())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.INFO())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.DEBUG())
    YKLiblog.Log.initLogDebug()
    this.makeIndexFlag = maxIndexFlag
    YKLiblog.Log.debug(`this.makeindexFlag=${this.makeIndexFlag}`)

    this.limitx = limitx
    this.setup()
  }
  setup(){
    const tabledata = UtilGmail.makeTabledata2()
    this.tabledata = tabledata
    const idtabledata = UtilGmail.makeIdTabledata()
    const keys = tabledata.keys()
    idtabledata.adjust(keys)
    this.idtabledata = idtabledata
    YKLiblog.Log.debug(`Top setup this.idtabledata.targetedEmailIdsList=${this.idtabledata.targetedEmailIdsList}`)

    const gmail = new Gmail(this.limitx, tabledata, idtabledata, this.makeIndexFlag)
    this.gmail = gmail
    this.numOfItems = 0

    YKLiblog.Log.debug(`Top setup this.limitx=${this.limitx}`)
  }
  
  start(){
    YKLiblog.Log.debug(`Top setup this.gmail.limitx=${this.gmail.limitx}`)

    const startInitIndex = 0
    const endInitIndex = 1
    const keys = this.gmail.getKeys()
    const keya = [keys[1]]
    const [startIndex, limitx] = UtilGmail.makeIndex(startInitIndex, endInitIndex, 0) // 0 または 0以外
    // const [startIndex, limitx] = UtilGmail.makeIndex(startInitIndex, 1, 1) // 0 または 0以外
    YKLiblog.Log.debug(`startIndex=${startIndex} limitx=${limitx}`)
    this.gmail.setStartIndex(startIndex)

    // this.gmail.limitx = limitx
    this.gmail.setLimitx(limitx)

    this.explore(this.gmail, this.numOfItems)
  }

  explore(gmail, numOfItems){
    YKLiblog.Log.debug(`gmail`)
    YKLiblog.Log.debug(`explore gmail.limitx=${gmail.limitx}`)

    const [start, end] = gmail.getLimitedAccessRange()
    YKLiblog.Log.debug(`Top explore start=${start} end=${end}`)
    const endPlusOne = end + 1
    const keys = gmail.getKeys()
    YKLiblog.Log.debug(`keys=${keys}`)
    const folderConf = gmail.tabledata.folderConf

    for(let i=start; i < endPlusOne; i++){
      if( numOfItems >= folderConf.maxItems){
        YKLiblog.Log.debug(`top break numOfItems=${numOfItems} gmail.folderConf.maxItems=${gmail.folderConf.maxItems}`)
        break;
      }
      const key = keys[i]
      YKLiblog.Log.debug(`i=${i} key=${key}`)
      // return

      numOfItems = this.processOneTargetedEmail(gmail, key, numOfItems)
    }
    YKLiblog.Log.debug(`explore END`)
  }
  
  processOneTargetedEmail(gmail, key, numOfItems = 0){
    YKLiblog.Log.debug(`getOneTargetedEmail key=${key}`)
    const targetedEmail = gmail.tabledata.getTargetedEmail(key);
    

    if( typeof(targetedEmail) === "undefined" ){
      return numOfItems
    }  

    const folderConf = gmail.folderConf;
  
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

    const gmailList = new GmailList(targetedEmail, gmail.idtabledata, this.limitx);
    const store = gmailList.getMailListX(gmail.op);
    targetedEmail.setNth(folderConf.nth);
    targetedEmail.setLastDateTime(store.get('last_date_time'));
  
    gmail.tabledata.rewrite(targetedEmail);
    gmail.tabledata.update();
  
    numOfItems += 1
  
    return numOfItems
  }      
}
function start(){
//  const top = new Top(CONFIG.limit)
  const top = new Top(3)
//  top.setup()
  top.start()
}



