class GmailList{
  constructor(targetedEmail, tabledata){
    this.targetedEmail = targetedEmail;
    this.tabledata = tabledata;
  }

  getMailListX(op, arg_store = null){
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(this.targetedEmail)
    return this.getMailList(op, queryInfo, arg_store)
  }

  getMailList(op, queryInfo, arg_store=null){
    if( queryInfo.maxThreads <= 0 ){
      throw Error(`ueryInfo.maxThreads=${queryInfo.maxThreads}`)
    }
    const store = Store.getValidStore( this.targetedEmail.name, arg_store );

    store.set("name", this.targetedEmail.name );
    store.set("condition", this.targetedEmail.condition );
    store.set("id", this.targetedEmail.id );
    store.set("url", this.targetedEmail.url );
    store.set("last_date_time", this.targetedEmail.lastDateTime );
    store.set("lastDate", this.targetedEmail.lastDate );
    store.set("folder", this.targetedEmail.folder );

    this.getMailListBase(store, op, queryInfo)

    return store;
  }

  makePairLabelAndQueryInfo(){
    const pairLabel = new PairLabel(this.targetedEmail.name)
    if(this.targetedEmail.maxThreads < 0 ){
      throw Error(`info.maxThreads=${this.targetedEmail.maxThreads}`)
    }
    const queryInfo = new QueryInfo(this.targetedEmail.condition, pairLabel, this.targetedEmail.maxThreads, this.targetedEmail.maxSearchesAvailable)
    return [pairLabel, queryInfo]
  }

  getMailListBase(store, op, queryInfo){
    // YKLiblog.Log.debug(JSON.stringify(queryInfo).slice(0, 100))

    let start = queryInfo.start
    let maxThreads = queryInfo.maxThreads
    if( maxThreads <= 0 ){
      throw Error(`maxThreads=${maxThreads}`)
    }

    let maxSearchesAvailable = queryInfo.maxSearchesAvailable

    let lastDateTime = store.get('last_date_time')
    let lastDate = new Date(lastDateTime)
    // let lastDateTime = lastDate.getTime()
    YKLiblog.Log.debug(`lastDateTime=${lastDateTime}`)
    if( YKLiba.is_undefined(lastDateTime) ){
      lastDate = new Date(0);
      lastDateTime = lastDate.getTime();
    }
    else{
      lastDate = new Date(lastDateTime);
      lastDateTime = lastDate.getTime();
    }
    // YKLiblog.Log.debug(`##=== gmail|get_mail_list_base|lastDate=${lastDate}`)
    const limit = PropertiesService.getUserProperties().getProperty('CELL_CONTENT_LIMIT') - 1;
    let threadAndMessagedataArray

    const [newLastDateTime_1, within1, remain1] = GmailSearch.SearchWithTargetLabel(queryInfo, store, this.targetedEmail, op, start, maxThreads, maxSearchesAvailable, lastDate, limit)
    // YKLiblog.Log.debug(`gmail|get_mail_list_base|queryInfo=${ JSON.stringify(queryInfo)}`)
    // YKLiblog.Log.debug(`gmail|get_mail_list_base|within1=${ JSON.stringify(within1).slice(0, 200)}`)
    if( within1.msgCount > 0 ){
      messageDataList = Dataregister.registerData(within1, this.targetedEmail.name, op, limit, lastDate)
      if(  messageDataList.length > 0 ){
        GmailSave.saveData(store, messageDataList)
      }
      // throw Error(`under saveData`)
    }
    
    if( typeof(within1.threads) !== "undefined" && within1.threads.length > 0 ){
      within1.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pariLabel.targetLabel.addToThreads(thread)
        queryInfo.pariLabel.endLabel.addToThreads(thread)
      })
    }

    /***********************************/
    const [newLastDateTime_2, within2, remain2] = GmailSearch.SearchWithFrom(queryInfo, store, this.targetedEmail, op, start, maxThreads, maxSearchesAvailable, lastDate, limit)
    if( within2.msgCount > 0 ){
      YKLiblog.Log.debug(`get_mail_list_base info.name=${this.targetedEmail.name}`)
      YKLiblog.Log.debug(`within2=${JSON.stringify(within2)}`)

      const messageDataList = Dataregister.registerData(within2, this.targetedEmail.name, op, limit, lastDate)
      if(  messageDataList.length > 0 ){
        GmailSave.saveData(store, messageDataList)
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within2.threads) !== "undefined" && within2.threads.length > 0){
      within2.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pariLabel.endLabel.addToThreads(thread)
      })
    }
  
    const array = [newLastDateTime_1, newLastDateTime_2, lastDateTime]
    // YKLiblog.Log.debug(`GAS-Gmail|gmail|get_mail_list_base array=${array}`)
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    store.set('new_last_date_time', latestDateTime)
    // YKLiblog.Log.debug(`#################============== 0 lastDateTime=${lastDateTime} latestDateTime=${latestDateTime}`)
    if( YKLiblog.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      // YKLiblog.Log.debug(`#################============== 1 lastDateTime=${lastDateTime} latestDateTime=${latestDateTime}`)
      store.set('last_date_time', latestDateTime)
      // YKLiblog.Log.debug(`#################============== 2 lastDateTime=${store.get('last_date_time')}`)
    }
  }

  get_maillist(arg_store){
    const store = Store.getValidStore( this.targetedEmail.name, arg_store );
    let records = store.get(this.targetedEmail.name)
    if( records === null ){
      // ... existing code ...
    }
  }
}