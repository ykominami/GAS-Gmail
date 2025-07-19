class Top {
  /**
   * Topクラスのコンストラクタ
   * @param {Object} config - 設定オブジェクト
   * @param {number} limitx - 処理制限数
   * @param {number} maxIndexFlag - 最大インデックスフラグ（デフォルト: 3）
   */
  constructor(config, limitx, maxIndexFlag = 3){
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.UNKNOWN())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.FAULT())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.ERROR())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.WARN())
    YKLiblog.Log.setLogLevel(YKLiblog.Log.INFO())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.DEBUG())
    // YKLiblog.Log.initLogDebug()
    this.config = config
    // this.config.setClearFlag(true)

    this.makeIndexFlag = maxIndexFlag
    YKLiblog.Log.debug(`this.makeindexFlag=${this.makeIndexFlag}`)

    this.limitx = limitx
    this.numOfItems = 0
    this.gmail = null
    this.setup(config)
  }
  
  /**
   * アイテム数を設定する
   * @param {number} value - 設定するアイテム数
   */
  setNumOfItems(value){
    this.numOfItems = value
  }
  
  /**
   * 設定とスプレッドシートの初期化を行う
   * @param {Object} config - 設定オブジェクト
   */
  setup(config){
    const [spreadsheet, _worksheet] = config.getSpreadsheetForConfigSpreadsheet()
    const configSpreadsheet = new ConfigSpreadsheet(spreadsheet, config)
    const [spreadsheet2, _worksheet2] = config.getSpreadsheetForRecordSpreadsheet()
    const recordSpreadsheet = new RecordSpreadsheet(spreadsheet2, config)
    recordSpreadsheet.addConfigSpreadsheet(configSpreadsheet)

    this.gmail = new Gmail(this.limitx, configSpreadsheet, recordSpreadsheet, config, this.makeIndexFlag)
    YKLiblog.Log.debug(`Top setup this.limitx=${this.limitx}`)
  }
  
  /**
   * Gmailの探索処理を実行する
   * @param {number} startInitIndex - 開始インデックス
   * @param {number} endInitIndex - 終了インデックス
   */
  execute(startInitIndex, endInitIndex){
    if (!this.gmail) {
      YKLiblog.Log.debug('Top start: gmail is not initialized')
      return
    }
    YKLiblog.Log.debug(`Top setup this.gmail.limitx=${this.gmail.limitx}`)
    // 必要ならthis.numOfItemsに反映
    this.numOfItems = this.gmail.explore(startInitIndex, endInitIndex, this.numOfItems, YKLiba.Config.ADDUNDERROW())
  }
  
  /**
   * すべてのラベルを削除する
   * @param {number} startInitIndex - 開始インデックス
   * @param {number} endInitIndex - 終了インデックス
   */
  removeLabelAllx(startInitIndex, endInitIndex){
    if (!this.gmail) {
      YKLiblog.Log.debug('Top start: gmail is not initialized')
      return
    }
    YKLiblog.Log.debug(`Top setup this.gmail.limitx=${this.gmail.limitx}`)
    // 必要ならthis.numOfItemsに反映
    this.numOfItems = this.gmail.removeLabelAllx(startInitIndex, endInitIndex)
  }
  /**
   * 指定されたラベルを削除する
   * @param {number} startInitIndex - 開始インデックス
   * @param {number} endInitIndex - 終了インデックス
   */
  removeLabelx(startInitIndex, endInitIndex){
    if (!this.gmail) {
      YKLiblog.Log.debug('Top start: gmail is not initialized')
      return
    }
    YKLiblog.Log.debug(`Top setup this.gmail.limitx=${this.gmail.limitx}`)
    // 必要ならthis.numOfItemsに反映
    this.numOfItems = this.gmail.removeLabelx(startInitIndex, endInitIndex)
  }
}

/**
 * 設定オブジェクトを初期化して返す
 * @returns {Object} 初期化された設定オブジェクト
 */
function setupConfig(){
  const config = new Config()
  // configSpreadsheet = config.setConfigInfoType(Config.CONFIG_INFO())
  config.setConfigInfoType(Config.CONFIG_INFO())
  // config.setConfigInfoType(Config.CONFIG_INFO2())
  // config.setConfigInfoType(Config.CONFIG_INFOX())
  return config
}

/**
 * Topオブジェクトとインデックスを初期化して返す
 * @param {Object} config - 設定オブジェクト
 * @returns {Array} [top, startIndex, endIndex] の配列
 */
function setupTop(config){
  const top = new Top(config, 10000)
  top.setNumOfItems(0)
  const [startIndex, endIndex] = UtilGmail.makeIndex(0, 100, 0)
  return [top, startIndex, endIndex]
}

/**
 * Gmail処理を開始する
 */
function start(){
  const config = setupConfig()
  const [top, startIndex, endIndex] = setupTop(config)

  top.execute(startIndex, endIndex)
}

/**
 * すべてのラベルを削除する処理を開始する
 */
function remoteLabelAll(){
  const config = setupConfig()
  const [top, startIndex, endIndex] = setupTop(config)

  top.removeLabelAllx(startIndex, endIndex)
}

/**
 * 指定されたラベルを削除する処理を開始する
 */
function removeLabels(){
  const config = setupConfig()
  const [top, startIndex, endIndex] = setupTop(config)

  top.removeLabelx(startIndex, endIndex)
}

/**
 * 指定した名前のシートのURLを取得し、メッセージボックスに表示します。
 */
function showUrlOfSheetByName() {
  // ★★★ ここにURLを取得したいシートの名前を入力してください ★★★
  const sheetName = 'シート2'; 

  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  // 名前でシートオブジェクトを取得します。
  const targetSheet = spreadsheet.getSheetByName(sheetName);

  // targetSheetが存在するか（指定した名前のシートが見つかったか）を確認します。
  if (targetSheet) {
    // シートが見つかった場合の処理
    const spreadsheetUrl = spreadsheet.getUrl();
    const sheetId = targetSheet.getSheetId();
    const sheetUrl = `${spreadsheetUrl}#gid=${sheetId}`;
    
    SpreadsheetApp.getUi().alert(`'${sheetName}' のURL:\n${sheetUrl}`);
    
  } else {
    // シートが見つからなかった場合の処理
    SpreadsheetApp.getUi().alert(`エラー: '${sheetName}' という名前のシートは見つかりませんでした。`);
  }
}


