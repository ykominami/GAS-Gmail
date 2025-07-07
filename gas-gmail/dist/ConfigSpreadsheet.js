class ConfigSpreadsheet {
  constructor(spreadsheet, config) {
    // this.spreadsheet = spreadsheet; // 必要なら保存
    // this.config = config;           // 必要なら保存
    this.configTable = null;
    if (spreadsheet && config) {
      this.configTable = new ConfigTable(spreadsheet, config);
    }
  }

  getConfigTable() {
    if (!this.configTable) {
      throw new Error('ConfigTable is not initialized.');
    }
    return this.configTable;
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