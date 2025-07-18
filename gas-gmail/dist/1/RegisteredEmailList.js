/**
 * 登録済みメールリストを管理するクラス
 * スプレッドシートから登録済みメール情報を読み込み、管理する
 */
class RegisteredEmailList {
  /**
   * コンストラクタ
   * @param {Spreadsheet} spreadsheet - 対象のスプレッドシート
   * @param {Config} config - 設定オブジェクト
   * @description 登録済みメールリストの初期化を行い、必要な設定とデータ構造を準備する
   */
  constructor(spreadsheet, config){
    this.config = config
    this.clearFlag = config.getClearFlag()
    this.spreadsheet = spreadsheet
    this.registeredEmailByKey = {}
    this.tabledata = null
    this.keySet = new Set()
    const tableDef = config.getRegisteredEmailTableDef()
    this.tableDef = tableDef
    this.sourceHeader = tableDef.getHeader()
    this.yklibbConfig = new YKLibb.Config(this.sourceHeader.length, this.sourceHeader, YKLibb.Config.COMPLETE())
    this.targetedEmailList = null
  }
  
  /**
   * 登録済みメールのキー一覧を取得
   * @returns {Array<string>} 登録済みメールのキー配列
   * @description 現在登録されているメールのキーを配列形式で返す
   */
  getKeys(){
    return Object.keys(this.registeredEmailByKey)
  }
  
  /**
   * 指定されたキーに対応する登録済みメールを取得
   * @param {string} key - メールのキー
   * @returns {RegisteredEmail|null} 登録済みメールオブジェクト、存在しない場合はnull
   * @description キーに対応する登録済みメールオブジェクトを返す
   */
  getRegisteredEmailByKey(key){
    return this.registeredEmailByKey[key]
  }
  
  /**
   * ターゲットメールリストから登録済みメールを追加
   * @description ターゲットメールリストが設定されている場合、そのリストの全キーに対して登録済みメールを追加する
   */
  addRegisteredEmailFromTargetedEmailList(){
    if (this.targetedEmailList) {
      const keys = this.targetedEmailList.getKeys()
      keys.forEach(key => this.addRegisteredEmail(key, this.clearFlag))
    }
  }
  
  /**
   * 指定されたキーで登録済みメールを追加
   * @param {string} key - メールのキー
   * @param {boolean} clearFlag - クリアフラグ（デフォルト: false）
   * @description 指定されたキーで登録済みメールを追加する。既に存在する場合は何もしない
   */
  addRegisteredEmail(key, clearFlag = false){
    if(this.keySet.has(key)){
      return
    }
    let targetedEmail = null
    if (this.targetedEmailList) {
      targetedEmail = this.targetedEmailList.getTargetedEmailByKey(key)
    }
    
    if (targetedEmail) {
      const registeredEmail = new RegisteredEmail(targetedEmail, this.spreadsheet, key, this.config, this.tableDef, this.yklibbConfig, clearFlag)
      this.registeredEmailByKey[key] = registeredEmail
      this.keySet.add(key)
    }
  }
  
  /**
   * ターゲットメールリストを設定
   * @param {TargetedEmailList} targetedEmailList - ターゲットメールリスト
   * @description 登録済みメールの追加元となるターゲットメールリストを設定する
   */
  addTargetedEmailList(targetedEmailList){
    this.targetedEmailList = targetedEmailList
  }
}