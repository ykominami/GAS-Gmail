/**
 * ターゲットメールのリストを管理するクラス
 */
class TargetedEmailList {
  /**
   * ターゲットメールリストのコンストラクタ
   * 初期化時に必要なプロパティを設定する
   */
  constructor(){
    this.backupRootFolderConf = null;
    this.searchConf = null;
    this.searchStatus = null;
    this.keySet = new Set();
    this.targetedEmailByKey = {};
    //
    this.keySetX = new Set();
    this.targetedEmailXByKey = {};
  }
  
  /**
   * すべてのターゲットメールのNth値が指定された値以上かどうかをチェックする
   * @param {number} value - 比較する値
   * @returns {boolean} すべてのNth値が指定された値以上の場合true、そうでなければfalse
   */
  areAllNthValueMoreThanOrEqual(value){
    const targetedEmails = Object.values(this.targetedEmailByKey)
    const nthes = [ ...targetedEmails ].map( targetedEmail => targetedEmail.getNth() )
    const [max, min] = YKLiba.Arrayx.getMaxAndMin( nthes )
    return (min >= value)
  }
  
  /**
   * バックアップルートフォルダの設定を設定する
   * @param {Object} backupRootFolderConf - バックアップルートフォルダの設定オブジェクト
   */
  setBackupRootFolderConf(backupRootFolderConf){
    this.backupRootFolderConf = backupRootFolderConf
  }
  
  /**
   * 検索設定を設定する
   * @param {Object} searchConf - 検索設定オブジェクト
   */
  setSearchConf(searchConf){
    this.searchConf = searchConf
  }
  
  /**
   * 検索ステータスを設定する
   * @param {Object} searchStatus - 検索ステータスオブジェクト
   */
  setSearchStatus(searchStatus){
    this.searchStatus = searchStatus
  }
  
  /**
   * ターゲットメールを追加する
   * 重複するキーが存在しない場合のみ追加される
   * @param {number} i - インデックス
   * @param {Array} item - メールアイテムの配列
   * @param {Object} rowRange - 行範囲オブジェクト
   */
  addTargetedEmail(i, item, rowRange){
    const targetedEmail = new TargetedEmail(i, item, this.searchConf, rowRange);
    const key = targetedEmail.getName()
    if(!this.keySet.has(key)){
      this.targetedEmailByKey[key] = targetedEmail;
      const keySet = this.keySet
      this.keySet.add(key);
      const keys = this.getKeys()
      YKLiblog.Log.debug(`TargetedEmailList addTargetedEmail keys=${keys}`)
      YKLiblog.Log.debug(`TargetedEmailList addTargetedEmail key=${key}`)
      const keys2 = Object.keys(this.targetedEmailByKey)
      YKLiblog.Log.debug(`TargetedEmailList addTargetedEmail keys2=${keys2}`)
    }
  }
  
  /**
   * ターゲットメールを追加する
   * 重複するキーが存在しない場合のみ追加される
   * @param {number} i - インデックス
   * @param {Array} item - メールアイテムの配列
   * @param {Object} rowRange - 行範囲オブジェクト
   */
  addTargetedEmailX(i, item, rowRange){
    const key = item[1];
    if(key && !this.keySetX.has(key)){
      const targetedEmailX = new TargetedEmail(i, item, this.searchConf, rowRange);
      this.targetedEmailXByKey[key] = targetedEmailX;
      this.keySetX.add(key);
    }
  }
  
  /**
   * ターゲットメールのキー一覧を取得する
   * @returns {Array<string>} キーの配列
   */
  getKeys(){
    const keys = Object.keys(this.targetedEmailByKey);
    return keys
  }

  /**
   * 指定されたキーに対応するターゲットメールを取得する
   * @param {string} key - ターゲットメールのキー
   * @returns {TargetedEmail|null} 対応するターゲットメール、存在しない場合はnull
   */
  getTargetedEmailByKey(key){
    let value = this.targetedEmailByKey[key];
    if( typeof(value) === "undefined" ){
      value = null
    }
    return value
  }
}
