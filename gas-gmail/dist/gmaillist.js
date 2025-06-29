class GmailList{
  constructor(targetedEmail, idtabledata, limitx){
    this.targetedEmail =  targetedEmail;
    this.idtabledata = idtabledata;
    YKLiblog.Log.debug(`GmailList constructor idtabledata=${ JSON.stringify(idtabledata.constructor) } )`)
    const key = targetedEmail.name
    // const targetedEmailIds = idtabledata.targetedEmailIdsList.getTargetedEmailIdsByKey(key)
    const targetedEmailIds = idtabledata.getTargetedEmailIdsByKey(key)
    this.targetedEmailIds = targetedEmailIds
    YKLiblog.Log.debug(`GmailList constructor idtabledata=${idtabledata}`)
    YKLiblog.Log.debug(`GmailList constructor idtabledata.targetedEmailIdsList=${idtabledata.targetedEmailIdsList}`)

    this.emailSearch = new GmailSearch( targetedEmailIds )
    this.limitx = limitx;
    this.register = new Dataregister();
  }

  makePairLabelAndQueryInfo(){
    const pairLabel = new PairLabel(this.targetedEmail.name)
    if(this.targetedEmail.maxThreads < 0 ){
      throw Error(`info.maxThreads=${this.targetedEmail.maxThreads}`)
    }
    YKLiblog.Log.debug(`GmailList makePairLabelAndQueryInfo typeof(this.targetedEmail.maxSearchesAvailable)=${ typeof(this.targetedEmail.maxSearchesAvailable) }`)
    const queryInfo = new QueryInfo(this.targetedEmail.condition, pairLabel, this.targetedEmail.maxThreads, this.targetedEmail.maxSearchesAvailable)
    return [pairLabel, queryInfo]
  }

  getMailListX(op, arg_store = null){
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo()
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
  getMailListBaseSub1(queryInfo, store){
    YKLiblog.Log.debug(`getMailListBaseSub1 queryInfo.getQuery0()=${queryInfo.getQuery0()}`)
    YKLiblog.Log.debug(`getMailListBaseSub1 queryInfo.getQuery1()=${queryInfo.getQuery1()}`)
    let start = queryInfo.start
    let maxThreads = queryInfo.maxThreads
    if( maxThreads <= 0 ){
      throw Error(`maxThreads=${maxThreads}`)
    }
    let maxSearchesAvailable = queryInfo.maxSearchesAvailable
    let lastDateTime = store.get('last_date_time')
    let lastDate = new Date(lastDateTime)
    YKLiblog.Log.debug(`getMailListBaseSub1 lastDateTime=${lastDateTime}`)
    if( YKLiba.Utils.isUndefined(lastDateTime) ){
      lastDate = new Date(0);
      lastDateTime = lastDate.getTime();
    }
    else{
      lastDate = new Date(lastDateTime);
      lastDateTime = lastDate.getTime();
    }
    return [start, maxThreads, lastDate, lastDateTime, maxSearchesAvailable]
  }
  getMailListBaseSub2(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op){
    // within1はスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearraである。
    // 以後within1のみを処理対象とする
    const [newLastDateTime1, within1, remain1] = this.emailSearch.SearchWithTargetLabel(queryInfo, this.targetedEmail, start, maxThreads, maxSearchesAvailable)
    YKLiblog.Log.debug(`GmailList getMailListBaseSub2 this.targetedEmail.name=${this.targetedEmail.name} within1.msgCount=${within1.msgCount} newLastDateTime1=${newLastDateTime1}`)
    if( within1.msgCount > 0 ){
      [recordedMessageIds, messageDataList] = this.register.registerData(within1, this.targetedEmail.name, op, this.limit, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds.length > 0){
        YKLiblog.Log.debug(`getMailListBaseSub2 recordedMessageIds.length=${recordedMessageIds.length}`)
        this.targetedEmail.addToDone(recordedMessageIds)
        this.idtabledata.rewrite(this.targetedEmail)
        this.idtabledata.updateRow(this.targetedEmail)
      }
      // 切り詰めメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList.length > 0 ){
        YKLiblog.Log.debug(`getMailListBaseSub2 messageDataList.length=${messageDataList.length}`)
        GmailSave.saveData(store, messageDataList)
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within1.threads) !== "undefined" && within1.threads.length > 0 ){
      YKLiblog.Log.debug(`getMailListBaseSub2 threadAndMsgs.length=${threadAndMsgs.length}`)
      within1.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pariLabel.targetLabel.addToThreads(thread)
        queryInfo.pariLabel.endLabel.addToThreads(thread)
      })
    }
    return [newLastDateTime1]
  }
  getMailListBaseSub3(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op){
    /***********************************/
    // within2はスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearraである。
    // 以後within2のみを処理対象とする
    const [newLastDateTime2, within2, remain2] = this.emailSearch.SearchWithFrom(queryInfo, this.targetedEmail, start, maxThreads, maxSearchesAvailable)
    YKLiblog.Log.debug(`GmailList getMailListBaseSub3 this.targetedEmail.name=${this.targetedEmail.name} within2.msgCount=${within2.msgCount} newLastDateTime2=${newLastDateTime2}`)
    
    if( within2.msgCount > 0 ){
      YKLiblog.Log.debug(`GmailList getMailListBaseSub3 within2.msgCount=${within2.msgCount}`)
      [recordedMessageIds2, messageDataList2] = this.register.registerData(within2, this.targetedEmail.name, op, this.limit, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds2.length > 0){
        YKLiblog.Log.debug(`getMailListBaseSub3 (recoreded IDs) recordedMessageIds2.length=${recordedMessageIds2.length}`)
        this.targetedEmail.addToDone(recordedMessageIds2)
        this.idtabledata.rewrite(this.targetedEmail)
        this.idtabledata.updateRow(this.targetedEmail)
      }
      // 切り詰めたメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList2.length > 0 ){
        YKLiblog.Log.debug(`getMailListBaseSub3 (Google Docs) messageDataList.length=${messageDataList.length}`)
        GmailSave.saveData(store, messageDataList2)
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within2.threads) !== "undefined" && within2.threads.length > 0){
      YKLiblog.Log.debug(`getMailListBaseSub3 4 threadAndMsgs.length=${threadAndMsgs.length}`)
      within2.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pariLabel.endLabel.addToThreads(thread)
      })
    }
    return [newLastDateTime2]  
  }
  getMailListBaseSub4(newLastDateTime1, newLastDateTime2, lastDateTime, store){
    const array = [newLastDateTime1, newLastDateTime2, lastDateTime]
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    YKLiblog.Log.debug(`getMailListBaseSub4 latestDateTime=${latestDateTime}`)
    store.set('new_last_date_time', latestDateTime)
    if( YKLiba.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      store.set('last_date_time', latestDateTime)
    }
  }

  getMailListBase(store, op, queryInfo){
    const [start, maxThreads, lastDate, lastDateTime, maxSearchesAvailable] = this.getMailListBaseSub1(queryInfo, store)
    YKLiblog.Log.debug(`GmailList getMailListBaseSub start=${start}, maxThreads=${maxThreads}, lastDate=${lastDate}, lastDateTime=${lastDateTime}, maxSearchesAvailable=${maxSearchesAvailable}`)
    // const [newLastDateTime1] = this.getMailListBaseSub2(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op)
    // YKLiblog.Log.debug(`GmailList getMailListBaseSub newLastDateTime1=${newLastDateTime1}`)
    const [newLastDateTime2] = this.getMailListBaseSub3(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op)
    YKLiblog.Log.debug(`GmailList getMailListBaseSub newLastDateTime2=${newLastDateTime2}`)
    this.getMailListBaseSub4(newLastDateTime1, newLastDateTime2, lastDateTime, store)
  }
}