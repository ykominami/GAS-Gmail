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
    this.startIndex = 0
    this.limitx = 0
    this.op = YKLiba.Config.addUnderRow()
  }
  getStartIndex(){
    return this.startIndex
  }
  setStartIndex(startIndex){
    this.startIndex = startIndex
  }
  setLimitx(limitx){
    this.limitx = limitx
  }
  getLimitx(){
    return this.limitx
  }
  getLimitedAccessRange(){
    const keys = this.getKeys()
    const keysLength = keys.length
    const [max, min] = YKLiba.Arrayx.getMaxAndMin( [keysLength, this.getLimitx()] )
    return [this.getStartIndex(), min]
  }
  getByKey(key){
    return this.tabledata.getTargetedEmail(key)
  }
  getKeys(){
    return this.tabledata.keys()
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
    const folder = targetedEmail.getOrCreateFolderUnderSpecifiedFolder(this.parentFolderInfo);
    targetedEmail.backup();
    this.tabledata.rewrite(targetedEmail);

    YKLiblog.Log.debug(`Gmail getMailList this.idtabledata=${this.idtabledata}`)
    YKLiblog.Log.debug(`Gmail getMailList this.idtabledata.targetedEmailIdsList=${this.idtabledata.targetedEmailIdsList}`)
    const gmailList = new GmailList(targetedEmail, this.idtabledata, this.limit)
    const store = gmailList.getMailListX(op, arg_store);
    targetedEmail.setNth(this.folderConf.nth);
    targetedEmail.setLastDateTime(store.get('last_date_time'));
    this.tabledata.rewrite(targetedEmail);
  }
  removeLavel(key){
    YKLiblog.Log.debug(`key=${key}`)
    const targetedEmail = this.tabledata.getTargetedEmail(key);
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(targetedEmail);
    removeLabelFromEmails(pairLabel.targetLabelName, pairLabel.targetLabel)
    removeLabelFromEmails(pairLabel.endLabelName, pairLabel.endLabel)
    YKLiblog.Log.debug(pairLabel)
    YKLiblog.Log.debug(queryInfo)
  }
  removeLabelAll(){
    CONFIG.setNoop(false)

    const keys = this.getKeys()
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([keys.length, this.limitx])
    for(let i=0; i < min; i++){
      YKLiblog.Log.debug(`i=${i}`)

      const key = keys[i]
      this.removeLavel(key)
    }
    // YKLiblog.Log.debug(`END i=${i}`)
  }
}

