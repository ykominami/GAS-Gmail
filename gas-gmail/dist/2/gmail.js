function __A(){}

class Gmail{
  constructor(limitx, configSpreadsheet, recordSpreadsheet, config, makeindexFlag = 0){
    this.limitx = limitx;
    this.configSpreadsheet = configSpreadsheet;
    this.configTable = this.configSpreadsheet.getConfigTable()
    this.targetedEmailList = this.configTable.getTargetedEmailList()
    this.searchConf = this.configTable.getSearchConf()
    this.searchStatus = this.configTable.getSearchStatus()
    this.nth = this.searchStatus.getNth()

    this.recordSpreadsheet = recordSpreadsheet;
    this.recordSpreadsheet.addConfigSpreadsheet(this.configSpreadsheet)
    this.config = config
    this.makeindexFlag = makeindexFlag;

    // 必要に応じて他のプロパティも初期化
  }
  areAllNthValueMoreThanOrEqual(value){
    return this.targetedEmailList.areAllNthValueMoreThanOrEqual(value)
  }
  getTargetedEmail(key){
    const configTable = this.configSpreadsheet.getConfigTable()
    const targetedEmailList = configTable.getTargetedEmailList()
    return targetedEmailList.getTargetedEmailByKey(key)
  }
  getRegisteredEmail(key){
    const registeredEmailList = this.recordSpreadsheet.getRegisteredEmailList()
    return registeredEmailList.getRegisteredEmailByKey(key)
  }
  getConfigSpreadsheet(){
    return this.configSpreadsheet
  }
  getRecordSpreadsheet(){
    return this.recordSpreadsheet
  }
  setLimitx(limitx){
    this.limitx = limitx;
  }
  getLimitx(){
    return this.limitx;
  }
  getByKey(key){
    return this.configSpreadsheet.getTargetedEmail(key);
  }
  getKeys(){
    const configSpreadsheet = this.configSpreadsheet
    const keys = configSpreadsheet.getKeys();
    return keys
  }
  getSearchConf(){
    const searchConf = this.configTable.getSearchConf()
    return searchConf
  }
  getSearchStatus(){
    const searchStatus = this.configTable.getSearchStatus()
    return searchStatus
  }
  getBackupRootFolderConf(){
    const backupRootFolderConf = this.configTable.getBackupRootFolderConf()
    return backupRootFolderConf
  }
  isBiggerThanMaxItems(numOfItems){
    const searchConf = this.getSearchConf()
    return searchConf.isBiggerThanMaxItems(numOfItems)
  }
  /**
   * 指定したラベルを持つメールからラベルを削除する
   *
   * @param {label} label 削除したいラベル
   */
  removeLabelFromEmails(labelName, label) {
    // ラベルが存在しない場合は処理を終了
    if (!label) {
      YKLiblog.Log.debug("指定されたラベルが見つかりませんでした: " + labelName);
      return;
    }
    // 指定されたラベルを持つスレッドを検索
    let threads = label.getThreads();
    // 各スレッドに対してラベルを削除
    for (var i = 0; i < threads.length; i++) {
      threads[i].removeLabel(label);
    }
    YKLiblog.Log.debug(threads.length + "件のスレッドからラベル '" + labelName + "' を削除しました。");
  }
  prepareForTargetedEmail(targetedEmail){
    const backupRootFolderConf = this.getBackupRootFolderConf()
    targetedEmail.prepareForSearch(backupRootFolderConf)
    
    YKLiblog.Log.debug(`name=${targetedEmail.getName()} nth=${targetedEmail.getNth()} searchStatus.nth=${this.searchStatus.getNth()}`)

    targetedEmail.setMaxSearchesAvailable(this.searchConf.getMaxSearchesAvailable());
    targetedEmail.setMaxThreads(this.searchConf.getMaxThreads());
  }
  getLimitedAccessRange(startIndex, endIndex){
    // return [0,1]
    return [startIndex, endIndex]
  }

  explore(startIndex, endIndex, numOfItems, op){
    YKLiblog.Log.debug(`Top explore numOfItems=${numOfItems}`)
 
    const [start, end] = this.getLimitedAccessRange(startIndex, endIndex)
    const keys = this.getKeys()
    YKLiblog.Log.debug(`Gmail explore keys=${keys}`)
    YKLiblog.Log.debug(`Gmail explore start=${start} end=${end} keys.length=${keys.length}`)
    const endx = keys.length - 1
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([end, endx])

    const end2 = min

    for(let i=start; i <= end2; i++){
      if( this.isBiggerThanMaxItems(numOfItems) ){
        YKLiblog.Log.debug(`Gmail explore break numOfItems=${numOfItems} this.searchConf.maxItems=${this.searchConf.maxItems}`)
        break;
      }
      const key = keys[i]
      YKLiblog.Log.debug(`Gmail explore i=${i} key=${key}`)
      numOfItems = this.searchAndStore(key, numOfItems, this.nth, op)

      if( this.areAllNthValueMoreThanOrEqual(this.nth) ){
        this.searchStatus.incrementNth()
        this.searchStatus.rewrite()
        this.searchStatus.update()
        // this.configTable.rewriteSearchStatus(this.searchStatus)
      }
      // this.update( this.configTable.getValues() )
    }
    YKLiblog.Log.debug(`Gmail explore END`)
    return numOfItems
  }

  searchAndStore(key, numOfItems, nth, op){
    YKLiblog.Log.debug(`searchAndStore key=${key}`)
    if(typeof(key) === "undefined"){
      YKLiblog.Log.debug(`Gmail searchAndStore  key=undefined`)
      return numOfItems
    }

    const registeredEmail = this.getRegisteredEmail(key);
    if(typeof(registeredEmail) === "undefined" ){
      return numOfItems
    }  

    const targetedEmail = this.getTargetedEmail(key);
    if(typeof(targetedEmail) === "undefined" ){
      YKLiblog.Log.debug(`Gmail searchAndStore  targetedEmail=undefined`)
      return numOfItems
    }
    if( targetedEmail.getNth() >= nth ){
      YKLiblog.Log.debug(`Gmail searchAndStore  targetedEmail.getNth()=${targetedEmail.getNth()} <= this.searchStatus.getNth()=${this.searchStatus.getNth()}`)
      return numOfItems
    }

    this.prepareForTargetedEmail(targetedEmail)

    const emailFetcherAndStorer = new EmailFetcherAndStorer(targetedEmail, registeredEmail, this.limitx, op, nth, this.config);
    const [_pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo()
    emailFetcherAndStorer.searchAndRegister(queryInfo)

    targetedEmail.setNth( nth )
    targetedEmail.rewrite();
    targetedEmail.update();
    // this.configTable.rewrite(targetedEmail);
    // this.configTable.update();

    numOfItems += 1
    return numOfItems
  }
  removeLabel(key){
    YKLiblog.Log.debug(`key=${key}`);
    const targetedEmail = this.tabledata.getTargetedEmail(key);
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(targetedEmail);
    this.removeLabelFromEmails(pairLabel.targetLabelName, pairLabel.targetLabel);
    this.removeLabelFromEmails(pairLabel.endLabelName, pairLabel.endLabel);
    YKLiblog.Log.debug(pairLabel);
    YKLiblog.Log.debug(queryInfo);
  }
  removeLabelAll(){
    if (typeof this.config !== 'undefined' && this.config.setNoop) {
      this.config.setNoop(false);
    }
    const keys = this.getKeys();
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([keys.length, this.limitx]);
    for(let i=0; i < min; i++){
      YKLiblog.Log.debug(`i=${i}`);
      const key = keys[i];
      this.removeLabel(key);
    }
    // YKLiblog.Log.debug(`END i=${i}`)
  }
  /*
  update(values){
    this.configTable.update(values)
  }
  */
}

