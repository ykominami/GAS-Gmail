class ConfigTable {
  constructor(spreadsheet, config){
    this.config = config

    const [worksheet, values, totalRange] = config.getConfigInfo(spreadsheet)
    YKLiblog.Log.debug(`values=${values}`)

    const targetedEmailList = new TargetedEmailList(spreadsheet, values, config)
    YKLiblog.Log.debug(`targetedEmailList.getKeys()=${targetedEmailList.getKeys()}`)

    this.spreadsheet = spreadsheet; 
    this.worksheet = worksheet; 
    this.values = values;
    this.totalRange = totalRange

    this.backupFolderInfo = targetedEmailList.backupFolderInfo;
    YKLiblog.Log.debug(`ConfigTable constructor targetedEmailList.folderConf=${targetedEmailList.folderConf}`)
    this.folderConf = targetedEmailList.folderConf;
    YKLiblog.Log.debug(`Tabledata constructor this.folderConf=${this.folderConf}`)
    this.targetedEmailList = targetedEmailList;
  }
  getTargetedEmailList(){
    return this.targetedEmailList
  }
}