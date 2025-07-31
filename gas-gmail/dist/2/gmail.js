function __A(){}

/**
 * Gmail操作を管理するクラス
 * 設定スプレッドシートとレコードスプレッドシートを使用してGmailの検索・保存・ラベル管理を行う
 */
class Gmail{
  /**
   * Gmailクラスのコンストラクタ
   * @param {number} limitx - 処理制限数
   * @param {Object} configSpreadsheet - 設定スプレッドシートオブジェクト
   * @param {Object} recordSpreadsheet - レコードスプレッドシートオブジェクト
   * @param {Object} config - 設定オブジェクト
   */
  constructor(limitx, configSpreadsheet, recordSpreadsheet, config){
    this.limitx = limitx;
    this.configSpreadsheet = configSpreadsheet;
    this.configTable = this.getConfigTable()
    this.targetedEmailList = this.configTable.getTargetedEmailList()
    this.searchConf = this.configTable.getSearchConf()
    this.searchStatus = this.configTable.getSearchStatus()
    this.nth = this.searchStatus.getNth()

    this.recordSpreadsheet = recordSpreadsheet;
    this.recordSpreadsheet.addConfigSpreadsheet(this.configSpreadsheet)
    this.bTable = this.getBTable()
    this.config = config
  }
  
  getLimix(){
    return this.limitx
  }

  getConfigTable(){
    return this.configSpreadsheet.getConfigTable()
  }

  /**
   * Bテーブルを取得する
   * @returns {Object} Bテーブルオブジェクト
   */
  getBTable(){
    return this.recordSpreadsheet.getBTable()
  }

  /**
   * Aテーブルを取得する
   * @returns {Object} Aテーブルオブジェクト
   */
  getATable(){
    return this.recordSpreadsheet.getATable()
  }

  /**
   * 全てのターゲットメールのnth値が指定値以上かどうかをチェックする
   * @param {number} value - 比較する値
   * @returns {boolean} 全てのnth値が指定値以上の場合true
   */
  areAllNthValueMoreThanOrEqual(value){
    return this.targetedEmailList.areAllNthValueMoreThanOrEqual(value)
  }

  /**
   * 指定されたキーに対応するターゲットメールを取得する
   * @param {string} key - ターゲットメールのキー
   * @returns {Object} ターゲットメールオブジェクト
   */
  getTargetedEmail(key){
    const configTable = this.configSpreadsheet.getConfigTable()
    const targetedEmailList = configTable.getTargetedEmailList()
    const temail = targetedEmailList.getTargetedEmailByKey(key)
    return temail
  }

  /**
   * 指定されたキーに対応する登録済みメールを取得する
   * @param {string} key - 登録済みメールのキー
   * @returns {Object} 登録済みメールオブジェクト
   */
  getRegisteredEmail(key){
    const registeredEmailList = this.recordSpreadsheet.getRegisteredEmailList()
    const remail = registeredEmailList.getRegisteredEmailByKey(key)
    return remail
  }
  getKeysOfRegisteredEmail(){
    const registeredEmailList = this.recordSpreadsheet.getRegisteredEmailList()
    const keys = registeredEmailList.getKeys()
    return keys
  }

  /**
   * 設定スプレッドシートからキー一覧を取得する
   * @returns {Array} キーの配列
   */
  getKeys(){
    const configSpreadsheet = this.configSpreadsheet
    const keys = configSpreadsheet.getKeys();
    return keys
  }

  /**
   * 検索設定を取得する
   * @returns {Object} 検索設定オブジェクト
   */
  getSearchConf(){
    const searchConf = this.configTable.getSearchConf()
    return searchConf
  }

  /**
   * 検索ステータスを取得する
   * @returns {Object} 検索ステータスオブジェクト
   */
  getSearchStatus(){
    const searchStatus = this.configTable.getSearchStatus()
    return searchStatus
  }

  /**
   * バックアップルートフォルダ設定を取得する
   * @returns {Object} バックアップルートフォルダ設定オブジェクト
   */
  getBackupRootFolderConf(){
    const backupRootFolderConf = this.configTable.getBackupRootFolderConf()
    return backupRootFolderConf
  }

  /**
   * 指定されたアイテム数が最大アイテム数を超えているかチェックする
   * @param {number} numOfItems - チェックするアイテム数
   * @returns {boolean} 最大アイテム数を超えている場合true
   */
  isBiggerThanMaxItems(numOfItems){
    const searchConf = this.getSearchConf()
    return searchConf.isBiggerThanMaxItems(numOfItems)
  }

  /**
   * ターゲットメールの検索準備を行う
   * バックアップルートフォルダ設定の適用と検索設定の設定を行う
   * @param {Object} targetedEmail - ターゲットメールオブジェクト
   */
  prepareForTargetedEmail(targetedEmail){
    const backupRootFolderConf = this.getBackupRootFolderConf()
    targetedEmail.prepareForSearch(backupRootFolderConf)
    
    YKLiblog.Log.debug(`name=${targetedEmail.getName()} nth=${targetedEmail.getNth()} searchStatus.nth=${this.searchStatus.getNth()}`)
  }

  /**
   * アクセス範囲を制限して返す
   * @param {number} startIndex - 開始インデックス
   * @param {number} endIndex - 終了インデックス
   * @returns {Array} [開始インデックス, 終了インデックス]の配列
   */
  getLimitedAccessRange(startIndex, endIndex){
    return [startIndex, endIndex]
  }

  /**
   * 指定された範囲でメールの探索・検索・保存を実行する
   * @param {number} startIndex - 開始インデックス
   * @param {number} endIndex - 終了インデックス
   * @param {number} numOfItems - 現在のアイテム数
   * @param {Object} op - 操作オブジェクト
   * @returns {number} 更新されたアイテム数
   */
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
      if (this.isBiggerThanMaxItems(numOfItems)) {
        const maxItems = this.searchConf.getMaxItems();
        YKLiblog.Log.debug(`Gmail explore break numOfItems=${numOfItems} maxItems=${maxItems}`);
        break;
      }
      const key = keys[i]
      YKLiblog.Log.debug(`Gmail explore i=${i} key=${key}`)
      numOfItems = this.searchAndStore(key, numOfItems, this.nth, op)

      if( this.areAllNthValueMoreThanOrEqual(this.nth) ){
        this.searchStatus.incrementNth()
        this.searchStatus.rewrite()
        this.searchStatus.update()
      }
    }
    YKLiblog.Log.debug(`Gmail explore END`)
    return numOfItems
  }

  /**
   * 指定された範囲で全てのラベルを削除する（拡張版）
   * @param {number} startIndex - 開始インデックス
   * @param {number} endIndex - 終了インデックス
   */
  removeLabelAllx(startIndex, endIndex){
    YKLiblog.Log.debug(`Top removeLabelAllx`)
    this.removeLabelAll()
  }

  /**
   * 指定された範囲でラベルを削除する（拡張版）
   * @param {number} startIndex - 開始インデックス
   * @param {number} endIndex - 終了インデックス
   */
  removeLabelx(startIndex, endIndex){
    YKLiblog.Log.debug(`Top removeLabelx`)
    const [start, end] = this.getLimitedAccessRange(startIndex, endIndex)
    const keys = this.getKeys()
    YKLiblog.Log.debug(`Gmail explore keys=${keys}`)
    YKLiblog.Log.debug(`Gmail explore start=${start} end=${end} keys.length=${keys.length}`)
    const endx = keys.length - 1
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([end, endx])

    const end2 = min

    for(let i=start; i <= end2; i++){
      const key = keys[i]
      this.clearRegisteredEmail(key)
    }
  }

  /**
   * 指定されたキーの登録済みメールをクリアする
   * ターゲットラベルとエンドラベルを削除し、登録済みメールの内容をクリアする
   * @param {string} key - クリアするメールのキー
   * @returns {number} アイテム数（エラー時）
   */
  clearRegisteredEmail(key){
    YKLiblog.Log.debug(`clearRegisteredEmail key=${key}`)
    if(typeof(key) === "undefined"){
      YKLiblog.Log.debug(`Gmail clearRegisteredEmail key=undefined`)
      return numOfItems
    }

    const registeredEmail = this.getRegisteredEmail(key);
    if(typeof(registeredEmail) === "undefined" ){
      return numOfItems
    }  

    const targetedEmail = this.getTargetedEmail(key);
    if(typeof(targetedEmail) === "undefined" ){
      YKLiblog.Log.debug(`Gmail clearRegisteredEmail targetedEmail=undefined`)
      return numOfItems
    }
    const [pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo()
    pairLabel.removeTargetLabelFromEmails();
    pairLabel.removeEndLabelFromEmails();
    registeredEmail.clear()
  }

  /**
   * 指定されたキーでメールを検索して保存する
   * @param {string} key - 検索するメールのキー
   * @param {number} numOfItems - 現在のアイテム数
   * @param {number} nth - 検索回数
   * @param {Object} op - 操作オブジェクト
   * @returns {number} 更新されたアイテム数
   */
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

    // const targetedEmail = this.getTargetedEmail(key);
    const targetedEmail = registeredEmail.targetedEmail
    if(typeof(targetedEmail) === "undefined" ){
      YKLiblog.Log.debug(`Gmail searchAndStore  targetedEmail=undefined`)
      return numOfItems
    }
    if( targetedEmail.getNth() >= nth ){
      YKLiblog.Log.debug(`Gmail searchAndStore  targetedEmail.getNth()=${targetedEmail.getNth()} <= this.searchStatus.getNth()=${this.searchStatus.getNth()}`)
      return numOfItems
    }

    this.prepareForTargetedEmail(targetedEmail)

    const [pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo()
    const emailFetcherAndStorer = new EmailFetcherAndStorer(targetedEmail, registeredEmail, this.limitx, op, nth, this.config, this.bTable) 
    if( emailFetcherAndStorer.existYears() ){
      const dateRangeQueryList = emailFetcherAndStorer.getDateRangeQueryList()
      const max = dateRangeQueryList.getYearsSize()
      // let dateRangeQuery
      for(let i=0; i<max && emailFetcherAndStorer.isBigMessageNumber(); i++){
        const dateRangeQuery = dateRangeQueryList.getDateRangeQueryByIndex(i)
        queryInfo.setAdditonalQueryString(dateRangeQuery.dateRangeCondition)
        emailFetcherAndStorer.searchAndRegisterLastDateTime(queryInfo)
        targetedEmail.decrementMcount(dateRangeQuery.length)
      }
      queryInfo.clearAdditionalQueryString()
    }
    else{
      emailFetcherAndStorer.searchAndRegisterLastDateTime(queryInfo)
    }

    targetedEmail.setNth( nth )
    targetedEmail.rewrite();
    targetedEmail.update();

    numOfItems += 1
    return numOfItems
  }

  /**
   * 指定されたキーのラベルを削除する
   * @param {string} key - ラベルを削除するメールのキー
   */
  removeLabel(key){
    const targetedEmail = this.getTargetedEmail(key);
    const [pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo();
    this.removeLabelFromEmails(pairLabel.targetLabelName, pairLabel.targetLabel);
    this.removeLabelFromEmails(pairLabel.endLabelName, pairLabel.endLabel);
  }

  /**
   * 全てのキーに対してラベルを削除する
   * 制限数まで処理を実行する
   */
  removeLabelAll(){
    if (typeof this.config !== 'undefined' && this.config.setNoop) {
      this.config.setNoop(false);
    }
    const keys = this.getKeys();
    const [max, min] = YKLiba.Arrayx.getMaxAndMin([keys.length, this.limitx]);
    for(let i=0; i < min; i++){
      const key = keys[i];
      YKLiblog.Log.debug(`Gmail removeLabelAll i=${i} key=${key}`);
      this.removeLabel(key);
    }
  }
}

