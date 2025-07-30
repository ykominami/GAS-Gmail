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

    this.gmail = new Gmail(this.limitx, configSpreadsheet, recordSpreadsheet, config)
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

    return this.numOfItems
  }

  execute2(startInitIndex, endInitIndex){
    const atable = this.gmail.getATable()
    atable.clearAndReset()

    const spreadsheetId = atable.getSpreadsheetId()
    const sheetNames = YKLibb.Gssx.getAllWorksheetNames(spreadsheetId)
    const exceptNames=  ["GAS-Gmail","_B","_A","Clasp-ts-etc","_config"]
    const names = sheetNames.filter( name => !exceptNames.includes(name))
    YKLiblog.Log.debug(`names=${ JSON.stringify(names)}`)

    // const keys = this.gmail.getKeys()
    const keys = this.gmail.getKeysOfRegisteredEmail()
    YKLiblog.Log.debug(`keys=${ JSON.stringify(keys)}`)

    const filteredKeys = keys.filter( name => !exceptNames.includes(name))
    let dataArray
    let dataArray2
    YKLiblog.Log.debug(`filteredKeys=${ JSON.stringify(filteredKeys)}`)

    dataArray = this.em(filteredKeys)
    YKLiblog.Log.debug(`dataArray=${ JSON.stringify(dataArray)}`)

    dataArray2 = this.sort(dataArray)
    dataArray2.map( data => atable.addDataRowsAndUpdate(data) )
    YKLiblog.Log.unknown(`dataArray2=${ JSON.stringify(dataArray2)}`)

    const dataArray3 = dataArray2.filter( data => {
      return parseInt(data[1], 10) !== 0
    } )
    YKLiblog.Log.unknown(`dataArray3=${ JSON.stringify(dataArray3)}`)
    const xnames = dataArray3.map( item => item[0] )
    YKLiblog.Log.unknown(`xnames=${ JSON.stringify(xnames)}`)

    const dataArray4 = this.em2(xnames)
    dataArray4.map( ([remail, temail]) => {
      YKLiblog.Log.unknown(`temail=${ temail }`)
      temail.setCategory("folder-x")
      temail.rewrite()
      temail.update()
    } )
  }
  sort(array){
    const indexCount = 1
    return array.sort( (a,b) => {
      return a[indexCount] - b[indexCount]
    })
  }
  em(names){
    const dataArray = names.map( name => {
      const remail = this.gmail.getRegisteredEmail(name)
      const temail = this.gmail.getTargetedEmail(name)
      if( typeof(remail) === "undefined") {
        return [name, "undefined"]      
      }
      else{
        return [name, remail.getIdsSize(), temail.getCondition(), remail.getSheetUrl() ]  
      }
    })
    return dataArray
  }
  em2(names){
    const dataArray = names.map( name => {
      const remail = this.gmail.getRegisteredEmail(name)
      const temail = this.gmail.getTargetedEmail(name)
      return [remail, temail]
    })
    return dataArray
  }
  search(queryInfo, registeredEmail, way){
    const gmailSearch = new GmailSearch()
    return gmailSearch.searchAndClassify(queryInfo, registeredEmail, way, this.config)
  }

  execute3(startInitIndex, endInitIndex){
    const configTable = this.gmail.getConfigTable()
    const targetedEmailList = configTable.getTargetedEmailList()

    const keys = targetedEmailList.getKeys()
    YKLiblog.Log.debug(`keys=${ JSON.stringify(keys)}`)
    // return

    const gmailSearch = new GmailSearch()
    keys.map( key => {
      // const targetedEmail = targetedEmailList.getTargetedEmailByKey(key)
      const registeredEmail = this.gmail.getRegisteredEmail(key)
      const targetedEmail = registeredEmail.targetedEmail
      const [pairLabel, queryInfo] = targetedEmail.makePairLabelAndQueryInfo()
      const maxYearsAgo = targetedEmail.getMaxYearsAgo()
      const maxThreads = targetedEmail.getMaxThreads()

      const mcount=targetedEmail.getMcount()
      YKLiblog.Log.debug(`key=${key} mcount=${mcount}`)
      if(targetedEmail.isOverMessages()){
        const way = EmailFetcherAndStorer.From()
        const dateRangeQueryList = new DateRangeQueryList(way, maxYearsAgo)
        dateRangeQueryList.collectThreads(gmailSearch, queryInfo, maxThreads)
        YKLiblog.Log.debug(`dateRangeQueryList=${ JSON.stringify(dateRangeQueryList) }`)

        const array = this.search(queryInfo, registeredEmail, way)
        YKLiblog.Log.debug(`queryInfo.queryResultList=${ JSON.stringify(queryInfo.queryResultList)}`)
        // YKLiblog.Log.debug(`array.length=${ array.length }`)
      }

      return mcount
    })
  }
}

/**
 * 設定オブジェクトを初期化して返す
 * @returns {Object} 初期化された設定オブジェクト
 */
function setupConfig(){
  let key
   key = Config.CONFIG_INFO()
  // key = Config.CONFIG_INFO1()
  // key = Config.CONFIG_INFO2()
  // key = Config.CONFIG_INFOX()
  // key = Config.CONFIG_INFO4()

  const config = new Config()

  const ret = config.setConfigInfoType(key)
  if( ret ){
    return config
  }
  else{
    return null
  }
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

function start2(){
  const config = setupConfig()
  const [top, startIndex, endIndex] = setupTop(config)

  top.execute2(startIndex, endIndex)
}

function start3(){
  const config = setupConfig()
  const [top, startIndex, endIndex] = setupTop(config)

  top.execute3(startIndex, endIndex)
}