function __A(){}

class Gmail{
  constructor(tabledata, makeindexFlag = 0){
    this.parentFolderInfo = tabledata.parentFolderInfo
    this.folderConf = tabledata.folderConf
    this.tabledata = tabledata

    this.op = YKLiba.Config.addUnderRow()
    const keyList = tabledata.keys()
    YKLiba.Log.debug(`## keyList=${keyList}`)
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

    // YKLiba.Log.debug(`endIndex=${endIndex}|`)
    // YKLiba.Log.debug(`tabledata.folderConf.maxItems=${tabledata.folderConf.maxItems}|`)
    // YKLiba.Log.debug(`keyList.length=${keyList.length}|`)
    // const [_max, limit] =  getMaxAndMin([endIndex, tabledata.folderConf.maxItems , keyList.length])
    const array0 = [endIndex, keyList.length]
    YKLiba.Log.debug(`array0=${array0}`)
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
      YKLiba.Log.debug("指定されたラベルが見つかりませんでした: " + labelName);
      return;
    }

    // 指定されたラベルを持つスレッドを検索
    let threads = label.getThreads();

    // 各スレッドに対してラベルを削除
    for (var i = 0; i < threads.length; i++) {
      threads[i].removeLabel(label);
    }

    YKLiba.Log.debug(threads.length + "件のスレッドからラベル '" + labelName + "' を削除しました。");
  }
  removeLavel(key){
    YKLiba.Log.debug(`key=${key}`)
    const targetedEmail = this.tabledata.getTargetedEmail(key);
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(targetedEmail);
    removeLabelFromEmails(pairLabel.targetLabelName, pairLabel.targetLabel)
    removeLabelFromEmails(pairLabel.endLabelName, pairLabel.endLabel)
    YKLiba.Log.debug(pairLabel)
    YKLiba.Log.debug(queryInfo)
  }
  removeLabelAll(){
    CONFIG.setNoop(false)

    // let numOfItems = 0
    // YKLiba.Log.debug(`=A`)
    // YKLiba.Log.debug(`this.startIndex=${this.startIndex}`)
    // YKLiba.Log.debug(`this.limit=${this.limit}`)
    for(let i=0; i < this.limit; i++){
      YKLiba.Log.debug(`i=${i}`)

      const key = this.keyList[i]
      this.removeLavel(key)
    }
    // YKLiba.Log.debug(`END i=${i}`)
  }
  getMailList(key, op, arg_store){
    YKLiba.Log.debug(`key=${key}`)
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

