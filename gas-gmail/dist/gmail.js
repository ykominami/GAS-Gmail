function __A(){}

class Gmail{
  constructor(limitx, tabledata, idtabledata, makeindexFlag = 0){
    YKLiblog.Log.debug(`Gmail constructor limitx=${limitx}`)
    this.parentFolderInfo = tabledata.parentFolderInfo
    this.backupFolderInfo = tabledata.backupFolderInfo

    this.folderConf = tabledata.folderConf
    YKLiblog.Log.debug(`Gmail constructor this.folderConf=${this.folderConf}}`)
    this.tabledata = tabledata
    this.idtabledata = idtabledata

    this.op = YKLiba.Config.addUnderRow()
    const keyList = tabledata.keys()
    YKLiblog.Log.debug(`## keyList=${keyList}`)
    this.keyList = keyList
    if( makeindexFlag == 0 ){
      const [startIndex, limit] = this.makeIndexes(keyList)
      this.startIndex = startIndex
      this.limitx = limitx
    }
    else{
      // const [startIndex, limit] = this.makeIndexes3(keyList, 29)
      const [startIndex, limit] = this.makeIndexes3(keyList)
      this.startIndex = startIndex
      this.limitx = limitx
    }
    YKLiblog.Log.debug(`Gmail constructor this.limit=${this.limitx}`)
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

    // YKLiblog.Log.debug(`endIndex=${endIndex}|`)
    // YKLiblog.Log.debug(`tabledata.folderConf.maxItems=${tabledata.folderConf.maxItems}|`)
    // YKLiblog.Log.debug(`keyList.length=${keyList.length}|`)
    // const [_max, limit] =  getMaxAndMin([endIndex, tabledata.folderConf.maxItems , keyList.length])
    const array0 = [endIndex, keyList.length]
    YKLiblog.Log.debug(`array0=${array0}`)
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
  getMailList(key, op, arg_store){
    YKLiblog.Log.debug(`key=${key}`)
    const targetedEmail = this.tabledata.getTargetedEmail(key);

    targetedEmail.setMaxSearchesAvailable(this.folderConf.maxSearchesAvailable);
    targetedEmail.setMaxThreads(this.folderConf.maxThreads);
    const folder = targetedEmail.getOrCreateFolderUnderDocsFolder(this.parentFolderInfo);
    targetedEmail.backup();
    this.tabledata.rewrite(targetedEmail);

    YKLiblog.Log.debug(`Gmail getMailList this.idtabledata=${this.idtabledata}`)
    const gmailList = new GmailList(targetedEmail, this.idtabledata, this.limit)
    const store = gmailList.getMailListX(op, arg_store);
    targetedEmail.setNth(this.folderConf.nth);
    targetedEmail.lastDateTime = store.get('last_date_time');
    this.tabledata.rewrite(targetedEmail);
  }
  removeLavel(key){
    YKLiblog.Log.debug(`key=${key}`)
    const targetedEmail = this.tabledata.getTargetedEmail(key);
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(targetedEmail);
    this.removeLabelFromEmails(pairLabel.targetLabelName, pairLabel.targetLabel)
    this.removeLabelFromEmails(pairLabel.endLabelName, pairLabel.endLabel)
    YKLiblog.Log.debug(pairLabel)
    YKLiblog.Log.debug(queryInfo)
  }
  removeLabelAll(){
    YKLiba.Config.setNoop(false)

    // let numOfItems = 0
    // YKLiblog.Log.debug(`=A`)
    // YKLiblog.Log.debug(`this.startIndex=${this.startIndex}`)
    // YKLiblog.Log.debug(`this.limit=${this.limit}`)
    for(let i=0; i < this.limit; i++){
      YKLiblog.Log.debug(`i=${i}`)

      const key = this.keyList[i]
      this.removeLavel(key)
    }
    // YKLiblog.Log.debug(`END i=${i}`)
  }
}

