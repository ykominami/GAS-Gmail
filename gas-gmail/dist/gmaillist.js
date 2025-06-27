class GmailList{
  constructor(targetedEmail, idtabledata, limitx){
    this.targetedEmail = targetedEmail;
    this.idtabledata = idtabledata;
    YKLiblog.Log.debug(`GmailList constructor idtabledata=${idtabledata}`)
    const key = targetedEmail.name
    const targetedEmailIds = idtabledata.targetedEmailIdsList.getTargetedEmailIdsByKey(key)
    this.targetedEmailIds = targetedEmailIds
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
    const queryInfo = new QueryInfo(this.targetedEmail.condition, pairLabel, this.targetedEmail.maxThreads, this.targetedEmail.maxSearchesAvailable)
    return [pairLabel, queryInfo]
  }

  getMailListX(op, arg_store = null){
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo()
    return this.getMailList(op, queryInfo, arg_store)
  }

  getMailList(op, queryInfo, arg_store=null){
    if( queryInfo.maxThreads <= 0 ){
      throw Error(`queryInfo.maxThreads=${queryInfo.maxThreads}`)
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
    let start = queryInfo.start
    let maxThreads = queryInfo.maxThreads
    if( maxThreads <= 0 ){
      throw Error(`maxThreads=${maxThreads}`)
    }
    let maxSearchesAvailable = queryInfo.maxSearchesAvailable
    let lastDateTime = store.get('last_date_time')
    let lastDate = new Date(lastDateTime)
    YKLiblog.Log.debug(`lastDateTime=${lastDateTime}`)
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
    if( within1.msgCount > 0 ){
      [recordedMessageIds, messageDataList] = this.register.registerData(within1, this.targetedEmail.name, op, this.limitx, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds.length > 0){
        this.targetedEmail.addToDone(recordedMessageIds)
        this.idtabledata.rewrite(this.targetedEmail)
        this.idtabledata.updateRow(this.targetedEmail)
      }
      // 切り詰めメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList.length > 0 ){
        GmailSave.saveData(store, messageDataList)
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within1.threads) !== "undefined" && within1.threads.length > 0 ){
      within1.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pairLabel.targetLabel.addToThreads(thread)
        queryInfo.pairLabel.endLabel.addToThreads(thread)
      })
    }
    return [newLastDateTime1]
  }
  getMailListBaseSub3(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op){
    /***********************************/
    // within2はスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearraである。
    // 以後within2のみを処理対象とする
    const [newLastDateTime2, within2, remain2] = this.emailSearch.SearchWithFrom(queryInfo, this.targetedEmail, start, maxThreads, maxSearchesAvailable)
    if( within2.msgCount > 0 ){
      [recordedMessageIds2, messageDataList2] = this.register.registerData(within2, this.targetedEmail.name, op, this.limitx, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds2.length > 0){
        this.targetedEmail.addToDone(recordedMessageIds2)
        this.idtabledata.rewrite(this.targetedEmail)
        this.idtabledata.updateRow(this.targetedEmail)
      }
      // 切り詰めたメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList2.length > 0 ){
        GmailSave.saveData(store, messageDataList2)
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within2.threads) !== "undefined" && within2.threads.length > 0){
      within2.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pairLabel.endLabel.addToThreads(thread)
      })
    }
    return [newLastDateTime2]  
  }
  getMailListBaseSub4(newLastDateTime1, newLastDateTime2, lastDateTime, store){
    const array = [newLastDateTime1, newLastDateTime2, lastDateTime]
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    store.set('new_last_date_time', latestDateTime)
    if( YKLiba.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      store.set('last_date_time', latestDateTime)
    }
  }

  getMailListBase(store, op, queryInfo){
    const [start, maxThreads, lastDate, lastDateTime, maxSearchesAvailable] = this.getMailListBaseSub1(queryInfo, store)
    const [newLastDateTime1] = this.getMailListBaseSub2(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op)
    const [newLastDateTime2] = this.getMailListBaseSub3(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op)
    this.getMailListBaseSub4(newLastDateTime1, newLastDateTime2, lastDateTime, store)
  }
  getMailListBase00(store, op, queryInfo){
    // YKLiblog.Log.debug(JSON.stringify(queryInfo).slice(0, 100))
    let messageDataList
    let recordedMessageIds
    let messageDataList2
    let recordedMessageIds2
    /////////////////

  }

  getMailListBase0(store, op, queryInfo){
    // YKLiblog.Log.debug(JSON.stringify(queryInfo).slice(0, 100))
    let messageDataList
    let recordedMessageIds
    let messageDataList2
    let recordedMessageIds2

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
    if( YKLiba.Utils.isUndefined(lastDateTime) ){
      lastDate = new Date(0);
      lastDateTime = lastDate.getTime();
    }
    else{
      lastDate = new Date(lastDateTime);
      lastDateTime = lastDate.getTime();
    }

    // within1はスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearraである。
    // 以後within1のみを処理対象とする
    const [newLastDateTime1, within1, remain1] = this.emailSearch.SearchWithTargetLabel(queryInfo, this.targetedEmail, start, maxThreads, maxSearchesAvailable)
    if( within1.msgCount > 0 ){
      [recordedMessageIds, messageDataList] = this.register.registerData(within1, this.targetedEmail.name, op, this.limitx, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds.length > 0){
        this.targetedEmail.addToDone(recordedMessageIds)
        this.idtabledata.rewrite(this.targetedEmail)
        this.idtabledata.updateRow(this.targetedEmail)
      }
      // 切り詰めメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList.length > 0 ){
        GmailSave.saveData(store, messageDataList)
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within1.threads) !== "undefined" && within1.threads.length > 0 ){
      within1.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pairLabel.targetLabel.addToThreads(thread)
        queryInfo.pairLabel.endLabel.addToThreads(thread)
      })
    }

    /***********************************/
    // within2はスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearraである。
    // 以後within2のみを処理対象とする
    const [newLastDateTime2, within2, remain2] = this.emailSearch.SearchWithFrom(queryInfo, this.targetedEmail, start, maxThreads, maxSearchesAvailable)
    if( within2.msgCount > 0 ){
      [recordedMessageIds2, messageDataList2] = this.register.registerData(within2, this.targetedEmail.name, op, this.limitx, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds2.length > 0){
        this.targetedEmail.addToDone(recordedMessageIds2)
        this.idtabledata.rewrite(this.targetedEmail)
        this.idtabledata.updateRow(this.targetedEmail)
      }
      // 切り詰めたメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList2.length > 0 ){
        GmailSave.saveData(store, messageDataList2)
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within2.threads) !== "undefined" && within2.threads.length > 0){
      within2.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        queryInfo.pairLabel.endLabel.addToThreads(thread)
      })
    }
  
    const array = [newLastDateTime1, newLastDateTime2, lastDateTime]
    // YKLiblog.Log.debug(`GAS-Gmail|gmail|get_mail_list_base array=${array}`)
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    store.set('new_last_date_time', latestDateTime)
    // YKLiblog.Log.debug(`#################============== 0 lastDateTime=${lastDateTime} latestDateTime=${latestDateTime}`)
    if( YKLiba.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      // YKLiblog.Log.debug(`#################============== 1 lastDateTime=${lastDateTime} latestDateTime=${latestDateTime}`)
      store.set('last_date_time', latestDateTime)
      // YKLiblog.Log.debug(`#################============== 2 lastDateTime=${store.get('last_date_time')}`)
    }
  }
}