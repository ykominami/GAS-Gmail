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
    this.numOfItems = 0
    this.gmail = null
    this.tabledata = null
    this.idtabledata = null
    this.setup()
  }
  setup(){
    this.tabledata = UtilGmail.makeTabledata2()
    this.idtabledata = UtilGmail.makeIdTabledata()
    YKLiblog.Log.debug(`Top setup this.idtabledata.targetedEmailIdsList=${this.idtabledata.targetedEmailIdsList}`)

    this.gmail = new Gmail(this.limitx, this.tabledata, this.idtabledata, this.makeIndexFlag)
    YKLiblog.Log.debug(`Top setup this.limitx=${this.limitx}`)
  }
  
  start(){
    if (!this.gmail) {
      YKLiblog.Log.debug('Top start: gmail is not initialized')
      return
    }
    YKLiblog.Log.debug(`Top setup this.gmail.limitx=${this.gmail.limitx}`)

    const startInitIndex = 1
    const endInitIndex = 1
    const keys = this.gmail.getKeys()
    const keya = [keys[1]]
    const [startIndex, limitx] = UtilGmail.makeIndex(startInitIndex, endInitIndex, 0)
    YKLiblog.Log.debug(`startIndex=${startIndex} limitx=${limitx}`)
    this.gmail.setStartIndex(startIndex)
    this.gmail.setLimitx(limitx)

    this.explore(this.gmail, this.numOfItems)
    // this.testExplore(this.gmail, this.numOfItems)
  }
  testExplore(gmail, numOfItems){
    YKLiblog.Log.debug(`Top explore numOfItems=${numOfItems}`)
 
    const [start, end] = gmail.getLimitedAccessRange()
    const keys = gmail.getKeys()
    YKLiblog.Log.debug(`Top explore keys=${keys}`)
    YKLiblog.Log.debug(`Top explore start=${start} end=${end} keys.length=${keys.length}`)
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([end, keys.length])

    const end2 = min
    const folderConf = gmail.tabledata.folderConf
    // ここで何か処理が必要なら追記
  }
  explore(gmail, numOfItems){
    YKLiblog.Log.debug(`Top explore numOfItems=${numOfItems}`)
 
    const [start, end] = gmail.getLimitedAccessRange()
    const keys = gmail.getKeys()
    YKLiblog.Log.debug(`Top explore keys=${keys}`)
    YKLiblog.Log.debug(`Top explore start=${start} end=${end} keys.length=${keys.length}`)
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([end, keys.length])

    const end2 = min
    const folderConf = gmail.tabledata.folderConf

    for(let i=start; i < end2; i++){
      if(numOfItems >= folderConf.maxItems){
        YKLiblog.Log.debug(`Top explore break numOfItems=${numOfItems} gmail.folderConf.maxItems=${gmail.folderConf.maxItems}`)
        break;
      }
      const key = keys[i]
      YKLiblog.Log.debug(`Top explore i=${i} key=${key}`)
      numOfItems = this.processOneTargetedEmail(gmail, key, numOfItems)
    }
    YKLiblog.Log.debug(`Top explore END`)
    // 必要ならthis.numOfItemsに反映
    this.numOfItems = numOfItems
  }
  
  processOneTargetedEmail(gmail, key, numOfItems = 0){
    YKLiblog.Log.debug(`getOneTargetedEmail key=${key}`)
    if(typeof(key) === "undefined"){
      YKLiblog.Log.debug(`Top processOneTargetedEmail key=undefined`)
      return numOfItems
    }
    const targetedEmail = gmail.tabledata.getTargetedEmail(key);
    if(typeof(targetedEmail) === "undefined" ){
      return numOfItems
    }  
    const folderConf = gmail.folderConf;
    if(targetedEmail.old_nth != folderConf.nth ){
      YKLiblog.Log.debug(`getOneTargetedEmail key=${key} 1`)
    }
    else{
      YKLiblog.Log.debug(`getOneTargetedEmail key=${key} 2`)
    }
    targetedEmail.setMaxSearchesAvailable(folderConf.maxSearchesAvailable);
    targetedEmail.setMaxThreads(folderConf.maxThreads);
    targetedEmail.backup();
    gmail.tabledata.rewrite(targetedEmail);
    gmail.tabledata.update();
    YKLiblog.Log.debug(`Top processOneTargetedEmail gmail.tabledata=${gmail.tabledata}`)
    YKLiblog.Log.debug(`Top processOneTargetedEmail gmail.idtabledata=${gmail.idtabledata}`)
    YKLiblog.Log.debug(`Top processOneTargetedEmail gmail.idtabledata.targetedEmailIdsList=${gmail.idtabledata.targetedEmailIdsList}`)
    const gmailList = new GmailList(targetedEmail, gmail.idtabledata, this.limitx);
    const store = gmailList.getMailListX(gmail.op);
    targetedEmail.setNth(folderConf.nth);
    gmail.tabledata.rewrite(targetedEmail);
    gmail.tabledata.update();
    numOfItems += 1
    return numOfItems
  }      
}
function start(){
  const top = new Top(3)
  top.start()
}



