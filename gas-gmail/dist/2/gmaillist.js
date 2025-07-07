class GmailList{
  constructor(targetedEmail, idtabledata, limitx){
    YKLiblog.Log.debug(`GmailList constructor targetedEmail.getName()=${targetedEmail.getName()} idtabledata=${ JSON.stringify(idtabledata.constructor)}`)
    this.targetedEmail =  targetedEmail;
    this.idtabledata = idtabledata;
    this.targetedEmailIds = this.idtabledata.getTargetedEmailIdsByKey(targetedEmail.getName())
    const x = this.targetedEmail.getBackupFolder()
    
    // GmailSaveクラスの存在チェック
    if (typeof GmailSave !== 'undefined') {
      this.gmailsave = new GmailSave( this.targetedEmail.getBackupFolder() )
    } else {
      YKLiblog.Log.debug("GmailSave class is not defined");
      this.gmailsave = null;
    }
    
    YKLiblog.Log.debug(`GmailList constructor idtabledata=${ JSON.stringify(idtabledata.constructor)}`)
    const key = targetedEmail.getName()
    const targetedEmailIds = idtabledata.getTargetedEmailIdsByKey(key)
    this.targetedEmailIds = targetedEmailIds
    YKLiblog.Log.debug(`GmailList constructor idtabledata=${idtabledata}`)
    YKLiblog.Log.debug(`GmailList constructor idtabledata.targetedEmailIdsList=${idtabledata.targetedEmailIdsList}`)

    // GmailSearchクラスの存在チェック
    if (typeof GmailSearch !== 'undefined') {
      this.gmailSearch = new GmailSearch( targetedEmailIds )
    } else {
      YKLiblog.Log.debug("GmailSearch class is not defined");
      this.gmailSearch = null;
    }
    
    this.limitx = limitx;
    const name = targetedEmail.getName()
    this.registeredEmail = idtabledata.getRegisteredEmailByKey(name);
    this.registeredEmail.add(targetedEmail)
  }

  makePairLabelAndQueryInfo(){
    // PairLabelクラスの存在チェック
    if (typeof PairLabel === 'undefined') {
      YKLiblog.Log.debug("PairLabel class is not defined");
      return [null, null];
    }
    
    const pairLabel = new PairLabel(this.targetedEmail.getName())
    if(this.targetedEmail.getMaxThreads() < 0 ){
      throw Error(`info.maxThreads=${this.targetedEmail.getMaxThreads()}`)
    }
    YKLiblog.Log.debug(`GmailList makePairLabelAndQueryInfo typeof(this.targetedEmail.getMaxSearchesAvailable())=${ typeof(this.targetedEmail.getMaxSearchesAvailable()) }`)
    
    // QueryInfoクラスの存在チェック
    if (typeof QueryInfo === 'undefined') {
      YKLiblog.Log.debug("QueryInfo class is not defined");
      return [pairLabel, null];
    }
    
    const queryInfo = new QueryInfo(this.targetedEmail.getCondition(), pairLabel, this.targetedEmail.getMaxThreads(), this.targetedEmail.getMaxSearchesAvailable())
    return [pairLabel, queryInfo]
  }

  getMailListX(op, arg_store = null){
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo()
    if (!queryInfo) {
      YKLiblog.Log.debug("queryInfo is null, cannot proceed with getMailList");
      return null;
    }
    return this.getMailList(op, queryInfo, arg_store)
  }

  getMailList(op, queryInfo, arg_store=null){
    if( queryInfo.maxThreads <= 0 ){
      throw Error(`queryInfo.maxThreads=${queryInfo.maxThreads}`)
    }
    
    // Storeクラスの存在チェック
    if (typeof Store === 'undefined') {
      YKLiblog.Log.debug("Store class is not defined");
      return null;
    }
    
    const store = Store.getValidStore( this.targetedEmail.getName(), arg_store );
/*
    store.set("name", this.targetedEmail.getName() );
    store.set("condition", this.targetedEmail.getCondition() );
    store.set("id", this.targetedEmail.getId() );
    store.set("url", this.targetedEmail.getUrl() );
    store.set("last_date_time", this.targetedEmail.lastDateTime );
    store.set("lastDate", this.targetedEmail.getLastDate() );
    store.set("folder", this.targetedEmail.getBackupFolder() );
*/
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
    // GmailSearchが存在しない場合は処理をスキップ
    if (!this.gmailSearch) {
      YKLiblog.Log.debug("GmailSearch is not available, skipping SearchWithTargetLabel");
      return [null];
    }
    
    // within1はスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearrayである。
    // 以後within1のみを処理対象とする
    const [newLastDateTime1, within1, remain1] = this.gmailSearch.SearchWithTargetLabel(queryInfo, this.targetedEmail, start, maxThreads, maxSearchesAvailable)
    YKLiblog.Log.debug(`GmailList getMailListBaseSub2 this.targetedEmail.name=${this.targetedEmail.getName()} within1.msgCount=${within1.msgCount} newLastDateTime1=${newLastDateTime1}`)
    if( within1.msgCount > 0 ){
      const [recordedMessageIds, messageDataList] = this.registeredEmail.registerData(within1, op, this.limitx, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds.length > 0){
        YKLiblog.Log.debug(`getMailListBaseSub2 recordedMessageIds.length=${recordedMessageIds.length}`)
        this.targetedEmailIds.addToDone(recordedMessageIds)
        this.idtabledata.rewrite(this.targetedEmailIds)
        this.idtabledata.updateRow(this.targetedEmailIds)
      }
      // 切り詰めメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList.length > 0 ){
        YKLiblog.Log.debug(`getMailListBaseSub2 messageDataList.length=${messageDataList.length}`)
        if (this.gmailsave && typeof this.gmailsave.saveData === 'function') {
          this.gmailsave.saveData(messageDataList)
        }
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within1.threads) !== "undefined" && within1.threads.length > 0 ){
      YKLiblog.Log.debug(`getMailListBaseSub2 threadAndMsgs.length=${within1.array.length}`)
      within1.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        if (queryInfo.pairLabel && queryInfo.pairLabel.targetLabel && typeof queryInfo.pairLabel.targetLabel.addToThreads === 'function') {
          queryInfo.pairLabel.targetLabel.addToThreads(thread)
        }
        if (queryInfo.pairLabel && queryInfo.pairLabel.endLabel && typeof queryInfo.pairLabel.endLabel.addToThreads === 'function') {
          queryInfo.pairLabel.endLabel.addToThreads(thread)
        }
      })
    }
    return [newLastDateTime1]
  }
  getMailListBaseSub3(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op){
    // GmailSearchが存在しない場合は処理をスキップ
    if (!this.gmailSearch) {
      YKLiblog.Log.debug("GmailSearch is not available, skipping SearchWithFrom");
      return [null];
    }
    
    /***********************************/
    // within2はスレッド総数、メッセージ総数が指定された制限値を超えないスレッド、メッセージをもつMessagearraである。
    // 以後within2のみを処理対象とする
    const [newLastDateTime2, within2, remain2] = this.gmailSearch.SearchWithFrom(queryInfo, this.targetedEmail, start, maxThreads, maxSearchesAvailable)
    YKLiblog.Log.debug(`GmailList getMailListBaseSub3 this.targetedEmail.name=${this.targetedEmail.getName()} within2.msgCount=${within2.msgCount} newLastDateTime2=${newLastDateTime2}`)
    
    if( within2.msgCount > 0 ){
      YKLiblog.Log.debug(`GmailList getMailListBaseSub3 within2.msgCount=${within2.msgCount}`)
      const [recordedMessageIds2, messageDataList2] = this.registeredEmail.registerData(within2, op, this.limitx, lastDate)
      // 記録済みになったメッセージのIDを処理済みIDテーブルに追加
      if(recordedMessageIds2.length > 0){
        YKLiblog.Log.debug(`getMailListBaseSub3 (recoreded IDs) recordedMessageIds2.length=${recordedMessageIds2.length}`)
        this.targetedEmailIds.addToDone(recordedMessageIds2)
        this.idtabledata.rewrite(this.targetedEmailIds)
        this.idtabledata.updateRow(this.targetedEmailIds)
      }
      // 切り詰めたメッセージが1個以上であれば、Google Docsファイルとして保存する
      if(  messageDataList2.length > 0 ){
        YKLiblog.Log.debug(`getMailListBaseSub3 (Google Docs) messageDataList.length=${messageDataList2.length}`)
        if (this.gmailsave && typeof this.gmailsave.saveData === 'function') {
          this.gmailsave.saveData(store, messageDataList2)
        }
      }
      // throw Error(`under saveData`)
    }
    if( typeof(within2.threads) !== "undefined" && within2.threads.length > 0){
      YKLiblog.Log.debug(`getMailListBaseSub3 4 threadAndMsgs.length=${within2.array.length}`)
      within2.array.map( threadAndMsgs => {
        const thread = threadAndMsgs[0]
        if (queryInfo.pairLabel && queryInfo.pairLabel.endLabel && typeof queryInfo.pairLabel.endLabel.addToThreads === 'function') {
          queryInfo.pairLabel.endLabel.addToThreads(thread)
        }
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
    const [newLastDateTime1] = this.getMailListBaseSub2(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op)
    const [newLastDateTime2] = this.getMailListBaseSub3(start, maxThreads, store, lastDate, queryInfo, maxSearchesAvailable, op)
    YKLiblog.Log.debug(`GmailList getMailListBaseSub newLastDateTime2=${newLastDateTime2}`)
    this.getMailListBaseSub4(newLastDateTime1, newLastDateTime2, lastDateTime, store)
  }
}