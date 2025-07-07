function __A(){}

class Gmail{
  constructor(limitx, tabledata, idtabledata, makeindexFlag = 0){
    YKLiblog.Log.debug(`Gmail constructor limitx=${limitx}`)
    this.parentFolderInfo = tabledata.parentFolderInfo
    this.backupFolderInfo = tabledata.backupFolderInfo

    this.folderConf = tabledata.folderConf
    YKLiblog.Log.debug(`Gmail constructor this.folderConf=${this.folderConf}`)
    idtabledata.addTabledata(tabledata)
    const keys = tabledata.keys()
    idtabledata.adjust(keys)

    this.tabledata = tabledata
    this.idtabledata = idtabledata
    this.idtabledata.addTabledata(tabledata)

    this.startIndex = 0
    this.limitx = limitx
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
   * @param {string} labelName ラベル名
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
  
  /**
   * ペアラベルとクエリ情報を作成する
   * @param {Object} targetedEmail 対象メール
   * @returns {Array} [pairLabel, queryInfo]
   */
  makePairLabelAndQueryInfo(targetedEmail) {
    try {
      // 実際の実装では、targetedEmailからラベル情報を取得する必要があります
      const pairLabel = {
        targetLabelName: targetedEmail.getTargetLabelName ? targetedEmail.getTargetLabelName() : '',
        targetLabel: targetedEmail.getTargetLabel ? targetedEmail.getTargetLabel() : null,
        endLabelName: targetedEmail.getEndLabelName ? targetedEmail.getEndLabelName() : '',
        endLabel: targetedEmail.getEndLabel ? targetedEmail.getEndLabel() : null
      };
      
      const queryInfo = {
        query: targetedEmail.getQuery ? targetedEmail.getQuery() : '',
        searchCriteria: targetedEmail.getSearchCriteria ? targetedEmail.getSearchCriteria() : {}
      };
      
      return [pairLabel, queryInfo];
    } catch (error) {
      YKLiblog.Log.debug("makePairLabelAndQueryInfo error: " + error.message);
      return [{}, {}];
    }
  }
  
  getMailList(key, op, arg_store){
    YKLiblog.Log.debug(`key=${key}`)
    const targetedEmail = this.tabledata.getTargetedEmail(key);

    if (!targetedEmail) {
      YKLiblog.Log.debug(`targetedEmail not found for key: ${key}`);
      return;
    }

    targetedEmail.setMaxSearchesAvailable(this.folderConf.maxSearchesAvailable);
    targetedEmail.setMaxThreads(this.folderConf.maxThreads);
    const folder = targetedEmail.getOrCreateFolderUnderSpecifiedFolder(this.parentFolderInfo);
    targetedEmail.backup();
    this.tabledata.rewrite(targetedEmail);

    YKLiblog.Log.debug(`Gmail getMailList this.idtabledata=${this.idtabledata}`)
    YKLiblog.Log.debug(`Gmail getMailList this.idtabledata.targetedEmailIdsList=${this.idtabledata.targetedEmailIdsList}`)
    
    // GmailListクラスが存在するかチェック
    if (typeof GmailList !== 'undefined') {
      const gmailList = new GmailList(targetedEmail, this.idtabledata, this.limitx);
      const store = gmailList.getMailListX(op, arg_store);
      
      if (store && typeof store.get === 'function') {
        const lastDateTime = store.get('last_date_time');
        if (lastDateTime) {
          targetedEmail.setLastDateTime(lastDateTime);
        }
      }
    } else {
      YKLiblog.Log.debug("GmailList class is not defined");
    }
    
    targetedEmail.setNth(this.folderConf.nth);
    this.tabledata.rewrite(targetedEmail);
  }
  
  removeLavel(key){
    YKLiblog.Log.debug(`key=${key}`)
    const targetedEmail = this.tabledata.getTargetedEmail(key);
    
    if (!targetedEmail) {
      YKLiblog.Log.debug(`targetedEmail not found for key: ${key}`);
      return;
    }
    
    const [pairLabel, queryInfo] = this.makePairLabelAndQueryInfo(targetedEmail);
    
    if (pairLabel.targetLabelName && pairLabel.targetLabel) {
      this.removeLabelFromEmails(pairLabel.targetLabelName, pairLabel.targetLabel);
    }
    
    if (pairLabel.endLabelName && pairLabel.endLabel) {
      this.removeLabelFromEmails(pairLabel.endLabelName, pairLabel.endLabel);
    }
    
    YKLiblog.Log.debug(pairLabel);
    YKLiblog.Log.debug(queryInfo);
  }
  
  removeLabelAll(){
    YKLiba.Config.setNoop(false);

    const keys = this.getKeys();
    if (!keys || keys.length === 0) {
      YKLiblog.Log.debug("No keys found for removeLabelAll");
      return;
    }
    
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([keys.length, this.limitx]);
    for(let i = 0; i < min; i++){
      YKLiblog.Log.debug(`i=${i}`);

      const key = keys[i];
      if (key) {
        this.removeLavel(key);
      }
    }
    // YKLiblog.Log.debug(`END i=${i}`)
  }
}

