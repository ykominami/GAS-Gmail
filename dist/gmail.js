function __A(){}

class Gmail{
  constructor(tabledata, makeindexFlag = 0){
    this.parentFolderInfo = tabledata.parentFolderInfo
    this.folderConf = tabledata.folderConf
    this.tabledata = tabledata

    this.op = YKLiba.Config.addUnderRow()
    const keyList = tabledata.keys()
    this.keyList = keyList
    if( makeindexFlag == 0){
      const [startIndex, limit] = this.makeIndexes(keyList)
      this.startIndex = startIndex
      this.limit = limit
    }
    else{
      const [startIndex, limit] = this.makeIndexes3(keyList, 29)
      this.startIndex = startIndex
      this.limit = limit
    }
  }
  
  makeIndexes(keyList){
    const startIndex = 10
    const endIndex = keyList.length
    const array0 = [endIndex, keyList.length]
    const [_max, limit] =  YKLiba.Arrayx.getMaxAndMin(array0)

    return [startIndex, limit]
  }
  makeIndexes3(keyList, startIndex=11){
    // const startIndex = 0
    // const startIndex = 11
    // const endIndex = keyList.length
    const endIndex = startIndex + 3

    // Logger.log(`endIndex=${endIndex}|`)
    // Logger.log(`tabledata.folderConf.maxItems=${tabledata.folderConf.maxItems}|`)
    // Logger.log(`keyList.length=${keyList.length}|`)
    // const [_max, limit] =  getMaxAndMin([endIndex, tabledata.folderConf.maxItems , keyList.length])
    const array0 = [endIndex, keyList.length]
    // Logger.log(`array0=${array0}`)
    const [_max, limit] =  YKLiba.Arrayx.getMaxAndMin(array0)

    return [startIndex, limit]
  }

  /**
   * 指定したラベルを持つメールからラベルを削除する
   *
   * @param {label} label 削除したいラベル
   */
  removeLabelFromEmails(labelName, label) {
    // ラベルが存在しない場合は処理を終了
    if (!label) {
      Logger.log("指定されたラベルが見つかりませんでした: " + labelName);
      return;
    }

    // 指定されたラベルを持つスレッドを検索
    let threads = label.getThreads();

    // 各スレッドに対してラベルを削除
    for (var i = 0; i < threads.length; i++) {
      threads[i].removeLabel(label);
    }

    Logger.log(threads.length + "件のスレッドからラベル '" + labelName + "' を削除しました。");
  }
  removeLavel(key){
    Logger.log(`key=${key}`)
    const folderInfo = this.tabledata.getFolderInfo(key);
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(folderInfo);
    removeLabelFromEmails(pairLabel.targetLabelName, pairLabel.targetLabel)
    removeLabelFromEmails(pairLabel.endLabelName, pairLabel.endLabel)
    Logger.log(pairLabel)
    Logger.log(queryInfo)
  }
  removeLabelAll(){
    CONFIG.setNoop(false)

    // let numOfItems = 0
    // Logger.log(`=A`)
    // Logger.log(`this.startIndex=${this.startIndex}`)
    // Logger.log(`this.limit=${this.limit}`)
    for(let i=0; i < this.limit; i++){
      Logger.log(`i=${i}`)

      const key = this.keyList[i]
      this.removeLavel(key)
    }
    // Logger.log(`END i=${i}`)
  }
  getMailList(key, op, arg_store){
    Logger.log(`key=${key}`)
    const folderInfo = this.tabledata.getFolderInfo(key);

    folderInfo.setMaxSearchesAvailable(this.tabledata.folderConf.maxSearchesAvailable);
    folderInfo.setMaxThreads(this.tabledata.folderConf.maxThreads);
    const folder = folderInfo.getOrCreateFolderUnderDocsFolder(this.parentFolderInfo);
    info.backup();
    this.tabledata.rewrite(info);

    const store = this.get_mail_list_x(info, op, arg_store);
    info.setNth(this.folderConf.nth);
    info.lastDateTime = store.get('last_date_time');
    this.tabledata.rewrite(info);
  }
  getMailListAll(op, arg_store = null){
    YKLiba.Log.setLogLevel(YKLiba.Log.DEBUG())
    CONFIG.setNoop(false)
    const keyList = this.tabledata.keys()

    const [startIndex, limit] = makeIndexes2(keyList)

    let numOfItems = 0
    let key
    for(let i=0; i < limit; i++){
      key = keyList[i]
      this.getMailList(key, op, arg_store)

      numOfItems = numOfItems + 1
      if( numOfItems >= this.tabledata.folderConf.maxItems){
        break
      }
    }
    // Logger.log("=======================")
    this.tabledata.update();
  }
  get_mail_list_x(folderInfo, op, arg_store = null){
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(folderInfo)
    return this.get_mail_list(folderInfo, op, queryInfo, arg_store)
  }

  get_mail_list(folderInfo, op, queryInfo, arg_store=null){
    if( queryInfo.maxThreads <= 0 ){
      throw Error(`ueryInfo.maxThreads=${queryInfo.maxThreads}`)
    }
    const store = Store.get_valid_store( base_name, arg_store );

    store.set("name", folderInfo.name );
    store.set("condition", folderInfo.condition );
    store.set("id", folderInfo.id );
    store.set("url", folderInfo.url );
    store.set("last_date_time", folderInfo.lastDateTime );
    store.set("lastDate", folderInfo.lastDate );
    store.set("folder", folderInfo.folder );

    this.get_mail_list_base(store, folderInfo, op, queryInfo)

    return store;
  }

  makePairLabelAndQueryInfo(info){
    const pairLabel = new PairLabel(info.name)
    if(info.maxThreads < 0 ){
      throw Error(`info.maxThreads=${info.maxThreads}`)
    }
    const queryInfo = new QueryInfo(info.condition, pairLabel, info.maxThreads, info.maxSearchesAvailable)
    return [pairLabel, queryInfo]
  }

  get_mail_list_base(store, info, op, queryInfo){
    // Logger.log(JSON.stringify(queryInfo).slice(0, 100))

    let start = queryInfo.start
    let maxThreads = queryInfo.maxThreads
    if( maxThreads <= 0 ){
      throw Error(`maxThreads=${maxThreads}`)
    }

    let maxSearchesAvailable = queryInfo.maxSearchesAvailable

    let lastDateTime = store.get('last_date_time')
    let lastDate = new Date(lastDateTime)
    // let lastDateTime = lastDate.getTime()
    YKLiba.Log.debug(`lastDateTime=${lastDateTime}`)
    if( YKLiba.is_undefined(lastDateTime) ){
      lastDate = new Date(0);
      lastDateTime = lastDate.getTime();
    }
    else{
      lastDate = new Date(lastDateTime);
      lastDateTime = lastDate.getTime();
    }
    // Logger.log(`##=== gmail|get_mail_list_base|lastDate=${lastDate}`)
    const limit = PropertiesService.getUserProperties().getProperty('CELL_CONTENT_LIMIT') - 1;
    let threadAndMessagedataArray

    const [newLastDateTime_1, within1, remain1] = GmailSearch.SearchWithTargetLabel(queryInfo, store, info, op, start, maxThreads, maxSearchesAvailable, lastDate, limit)
    // Logger.log(`gmail|get_mail_list_base|queryInfo=${ JSON.stringify(queryInfo)}`)
    // Logger.log(`gmail|get_mail_list_base|within1=${ JSON.stringify(within1).slice(0, 200)}`)
    if( within1.msgCount > 0 ){
      messageDataList = Dataregister.registerData(within1, info.name, op, limit, lastDate)
      if(  messageDataList.length > 0 ){
        saveData(store, messageDataList)
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
    const [newLastDateTime_2, within2, remain2] = GmailSearch.SearchWithFrom(queryInfo, store, info, op, start, maxThreads, maxSearchesAvailable, lastDate, limit)
    if( within2.msgCount > 0 ){
      Logger.log(`get_mail_list_base info.name=${info.name}`)
      Logger.log(`within2=${JSON.stringify(within2)}`)

      const messageDataList = Dataregister.registerData(within2, info.name, op, limit, lastDate)
      if(  messageDataList.length > 0 ){
        saveData(store, messageDataList)
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
    // Logger.log(`GAS-Gmail|gmail|get_mail_list_base array=${array}`)
    const [latestDateTime, earlistDate] = YKLiba.Arrayx.getMaxAndMin(array)
    store.set('new_last_date_time', latestDateTime)
    // Logger.log(`#################============== 0 lastDateTime=${lastDateTime} latestDateTime=${latestDateTime}`)
    if( YKLiba.Utils.isAfterDate(lastDateTime, latestDateTime) ){
      // Logger.log(`#################============== 1 lastDateTime=${lastDateTime} latestDateTime=${latestDateTime}`)
      store.set('last_date_time', latestDateTime)
      // Logger.log(`#################============== 2 lastDateTime=${store.get('last_date_time')}`)
    }
  }
}

function testa(){
  const testdata = Util.makeTabledata()
  const gmail = new Gmail(testdata)
  Logger.log(`gamil startIndex=${gmail["startIndex"]}`)
  Logger.log(`gamil limit=${gmail.limit}`)
  gmail.removeLabelAll()
  Logger.log(`====`)
  const op = YKLiba.Arrayx.addUnderRow()
  gmail.getMailListAll(op)
  Logger.log(`====`)
}

///////////////////////////////
// The Hotwire Club
function get_mail_list_from_Hotwire_Club(arg_store = null){
  const basename = Store.THE_HOTWIRE_CLUB()
  // remove_labels(basename)
  const op = YKLiba.Config.addUnderRow()
  const testdata = Util.makeTabledata()
  const gmail = new Gmail(testdata)
  Logger.log(`basename=${basename}`)
  return gmail.getMailList(basename, op, arg_store)
  // return gmail.get_mail_list_x(basename, op, arg_store)
}

function get_mail_list_from_Frontend_Focus(arg_store = null){
  YKLiba.Log.setLogLevel(YKLiba.Log.DEBUG())
  const basename = Store.FRONTEND_FOCUS()
  // remove_labels(basename)
  const op = YKLiba.Config.addUnderRow()
  // const op = YKLiba.Config.REWRITE()
  const testdata = Util.makeTabledata()
  const gmail = new Gmail(testdata)
  return gmail.getMailList(basename, op, arg_store)
  // return gmail.get_mail_list_x(basename, op, arg_store)
}

// Hotwire Weekly
function get_mail_list_from_hotwire_weekly(arg_store = null){
  const basename = Store.HOTWIRE_WEEKLY()
  const testdata = Util.makeTabledata()
  const gmail = new Gmail(testdata)
  const op = YKLiba.Confg.addUnderRow()
  return gmail.getMailList(basename, op, arg_store)
  // return gmail.get_mail_list_x(basename, op, arg_store)
}

function getMailList_3(){
  get_mail_list_from_Hotwire_Club()
  get_mail_list_from_Frontend_Focus()
  get_mail_list_from_hotwire_weekly()
}

function remove_labels(base_name){
  pairLabel = new PairLabel(base_name)

  const threads = pairLabel.targetLabel.getThreads()
  pairLabel.targetLabel.removeFromThreads(threads)

  const threads2 = pairLabel.endLabel.getThreads()
  pairLabel.endLabel.removeFromThreads(threads2)
}

function clear_sheet(sheetname){
  const sheet = YKLiba.Arrayx.getSheetByName(sheetname)
  YKLiba.clear_sheet(sheet)
}