class Top {
  constructor(config, limitx, maxIndexFlag = 3){
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.UNKNOWN())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.FAULT())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.ERROR())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.WARN())
     YKLiblog.Log.setLogLevel(YKLiblog.Log.INFO())
    // YKLiblog.Log.setLogLevel(YKLiblog.Log.DEBUG())
    // YKLiblog.Log.initLogDebug()
    this.config = config
    this.makeIndexFlag = maxIndexFlag
    YKLiblog.Log.debug(`this.makeindexFlag=${this.makeIndexFlag}`)

    this.limitx = limitx
    this.numOfItems = 0
    this.gmail = null
    this.setup(config)
  }
  setNumOfItems(value){
    this.numOfItems = value
  }
  setup(config){
    const [spreadsheet, _worksheet] = config.getSpreadsheetForConfigSpreadsheet()
    const configSpreadsheet = new ConfigSpreadsheet(spreadsheet, config)
    const [spreadsheet2, _worksheet2] = config.getSpreadsheetForRecordSpreadsheet()
    const recordSpreadsheet = new RecordSpreadsheet(spreadsheet2, config)
    recordSpreadsheet.addConfigSpreadsheet(configSpreadsheet)

    this.gmail = new Gmail(this.limitx, configSpreadsheet, recordSpreadsheet, config, this.makeIndexFlag)
    YKLiblog.Log.debug(`Top setup this.limitx=${this.limitx}`)
  }
  
  execute(startInitIndex, endInitIndex){
    if (!this.gmail) {
      YKLiblog.Log.debug('Top start: gmail is not initialized')
      return
    }
    YKLiblog.Log.debug(`Top setup this.gmail.limitx=${this.gmail.limitx}`)
    // 必要ならthis.numOfItemsに反映
    this.numOfItems = this.gmail.explore(startInitIndex, endInitIndex, this.numOfItems, YKLiba.Config.ADDUNDERROW())
  }
}
function start(){
  const config = new Config()
  // configSpreadsheet = config.setConfigInfoType(Config.CONFIG_INFO())
  config.setConfigInfoType(Config.CONFIG_INFO())
  // config.setConfigInfoType(Config.CONFIG_INFO2())
  // config.setConfigInfoType(Config.CONFIG_INFOX())
  
  const top = new Top(config, 10000)
  top.setNumOfItems(0)
  const [startIndex, endIndex] = UtilGmail.makeIndex(0, 100, 0)
  top.execute(startIndex, endIndex)
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


