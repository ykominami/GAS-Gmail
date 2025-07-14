class TargetedEmailList {
  constructor(){
    this.backupRootFolderConf = null;
    this.searchConf = null;
    this.searchStatus = null;
    this.keySet = new Set();
    this.targetedEmailByKey = {};
  }
  areAllNthValueMoreThanOrEqual(value){
    const targetedEmails = Object.values(this.targetedEmailByKey)
    const nthes = [ ...targetedEmails ].map( targetedEmail => targetedEmail.getNth() )
    const [max, min] = YKLiba.Arrayx.getMaxAndMin( nthes )
    return (min >= value)
  }
  setBackupRootFolderConf(backupRootFolderConf){
    this.backupRootFolderConf = backupRootFolderConf
  }
  setSearchConf(searchConf){
    this.searchConf = searchConf
  }
  setSearchStatus(searchStatus){
    this.searchStatus = searchStatus
  }
  addTargetedEmail(i, item, rowRange){
    const key = item[1];
    if(key && !this.keySet.has(key)){
      const targetedEmail = new TargetedEmail(i, item, this.searchConf, rowRange);
      this.targetedEmailByKey[key] = targetedEmail;
      this.keySet.add(key);
    }
  }
  getKeys(){
    return Object.keys(this.targetedEmailByKey);
  }
  getTargetedEmailByKey(key){
    return this.targetedEmailByKey[key];
  }
}
