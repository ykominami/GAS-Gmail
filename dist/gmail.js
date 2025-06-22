function __A(){}

class Gmail{
  constructor(tabledata, makeindexFlag = 0){
    this.parentFolderInfo = tabledata.parentFolderInfo
    this.folderConf = tabledata.folderConf
    this.tabledata = tabledata

    this.op = YKLiba.Config.addUnderRow()
    const keyList = tabledata.keys()
    Logger.log(`## keyList=${keyList}`)
    this.keyList = keyList
    if( makeindexFlag == 0){
      const [startIndex, limit] = this.makeIndexes(keyList)
      this.startIndex = startIndex
      this.limit = limit
    }
    else{
      // const [startIndex, limit] = this.makeIndexes3(keyList, 29)
      const [startIndex, limit] = this.makeIndexes3(keyList)
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
    Logger.log(`array0=${array0}`)
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
    const targetedEmail = this.tabledata.getTargetedEmail(key);
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(targetedEmail);
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
    const targetedEmail = this.tabledata.getTargetedEmail(key);

    targetedEmail.setMaxSearchesAvailable(this.folderConf.maxSearchesAvailable);
    targetedEmail.setMaxThreads(this.folderConf.maxThreads);
    const folder = targetedEmail.getOrCreateFolderUnderDocsFolder(this.parentFolderInfo);
    targetedEmail.backup();
    this.tabledata.rewrite(targetedEmail);

    const gmailList = new GmailList(targetedEmail, this.tabledata)
    const store = gmailList.get_mail_list_x(targetedEmail, op, arg_store);
    targetedEmail.setNth(this.folderConf.nth);
    targetedEmail.lastDateTime = store.get('last_date_time');
    this.tabledata.rewrite(targetedEmail);
  }
}

