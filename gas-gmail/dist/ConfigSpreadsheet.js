class ConfigSpreadsheet {
  constructor(spreadsheet, config) {
    // this.spreadsheet = spreadsheet; // 必要なら保存
    // this.config = config;           // 必要なら保存
    this.configTable = null;
    if (spreadsheet && config) {
      const [worksheet, values, totalRange] = config.getConfigInfo(spreadsheet)
      const totalRangeShape = YKLiba.Range.getRangeShape(totalRange)
      this.configTable = new ConfigTable(values, totalRange);
    }
  }
  getSearchConf(){
    return this.configTable.getSearchConf()
  }
  getConfigTable() {
    if (!this.configTable) {
      throw new Error('ConfigTable is not initialized.');
    }
    return this.configTable;
  }
  getBackupRootFolderInfo(){
    return this.configTable.getBackupRootFolderInfo();
  }
  getKeys(){
    const targetedEmailList = this.getTargetedEmailList() 
    const keys = targetedEmailList.getKeys()
    return keys
  }
  getTargetedEmailList() {
    if (!this.configTable) {
      throw new Error('ConfigTable is not initialized.');
    }
    return this.configTable.getTargetedEmailList();
  }

  getTargetedEmailByKey(key) {
    const targetedEmailList = this.getTargetedEmailList();
    if (!targetedEmailList) {
      throw new Error('TargetedEmailList is not available.');
    }
    return targetedEmailList.getTargetedEmailByKey(key);
  }
}