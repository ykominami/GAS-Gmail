class EmailFetcherAndStorer{
  static SearchWithTargetLabel(){
    return "SearchWithTargetLabel"
  }
  static SearchWithFrom(){
    return "SearchWithFrom"
  }
  constructor(targetedEmail, registeredEmail, limitx, op, nth, config){
    this.config = config
    this.targetedEmail =  targetedEmail;
    this.registeredEmail = registeredEmail;

    this.gmailSearch = new GmailSearch( registeredEmail , config)
    this.limitx = limitx;
    const [pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo()
    this.pairLabel = pairLabel
    this.queryInfo = queryInfo
    this.op = op
    this.nth = nth
  }

  fetchEmail(queryInfo, way){
    // withinはスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearrayである。
    // 以後within1のみを処理対象とする
    const [newLastDateTime, within, remain] = this.gmailSearch.search(queryInfo, this.targetedEmail, way)

    YKLiblog.Log.debug(`fetchEmail within.msgCount=${within.msgCount} newLastDateTime=${newLastDateTime}`)

    return [within, newLastDateTime]
  }

  storeEmail(within, way){
    YKLiblog.Log.debug(`storeEmail 1`)
    if( within.msgCount > 0 ){
      YKLiblog.Log.debug(`storeEmail 2`)
      const lastDate = this.targetedEmail.getLastDate()
      const [recordedMessageIds, messageDataList] = this.registeredEmail.registerData(within, this.op, this.limitx, lastDate)
      // 切り詰めメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList.length > 0 ){
        YKLiblog.Log.debug(`storeEmail messageDataList.length=${messageDataList.length}`)
        this.targetedEmail.saveData(messageDataList)
      }
      // throw Error(`under saveData`)
    }
    if( within.msgCount.length > 0 ){
      YKLiblog.Log.debug(`storeEmail 4`)
      within.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        YKLiblog.Log.debug(`storeEmail 5`)
        if( way === EmailFetcherAndStorer.SearchWithTargetLabel() ){
          YKLiblog.Log.debug(`storeEmail 6`)
          queryInfo.pariLabel.targetLabel.addToThreads(thread)
          queryInfo.pariLabel.endLabel.addToThreads(thread)
        }
        else{
          YKLiblog.Log.debug(`storeEmail 7`)
          queryInfo.pariLabel.endLabel.addToThreads(thread)
        }
      })
    }
  }

  registerLastDateTime(newLastDateTime1, newLastDateTime2, lastDateTime){
    const array = [newLastDateTime1, newLastDateTime2, lastDateTime]
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    YKLiblog.Log.debug(`registerLastDateTime latestDateTime=${latestDateTime}`)
    if( YKLiba.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      // store.set('last_date_time', latestDateTime)
      this.targetedEmail.setValidLatestDateAndDateTime(latestDateTime)
    }
  }
  registerNth(){
    this.targetedEmail.setNth(this.nth)
  }

  searchAndRegister(queryInfo){
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchAndRegister queryInfo.maxThreads=${queryInfo.maxThreads}, queryInfo.lastDate=${queryInfo.lastDate}, queryInfo.lastDateTime=${queryInfo.lastDateTime}, queryInfo.maxSearchesAvailable=${queryInfo.maxSearchesAvailable}`)

    const way1 = EmailFetcherAndStorer.SearchWithTargetLabel()
    const [within1, newLastDateTime1] = this.fetchEmail(queryInfo, way1)
    this.storeEmail(within1, way1)

    const way2 = EmailFetcherAndStorer.SearchWithFrom()
    const [within2, newLastDateTime2] = this.fetchEmail(queryInfo, way2)
    this.storeEmail(within2, way2)
 
    YKLiblog.Log.debug(`EmailFetcherAndStorer searchAndRegister newLastDateTime2=${newLastDateTime2}`)
    const lastDateTime = queryInfo.lastDateTime

    this.registerLastDateTime(newLastDateTime1, newLastDateTime2, lastDateTime)
    this.registerNth()
  }
}
