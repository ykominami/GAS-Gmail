class Top {
  constructor(limitx, maxIndexFlag = 3){
    if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.initLogDebug === 'function') {
      YKLiblog.Log.initLogDebug();
    } else {
      console.log('[Top] YKLiblog.Log.initLogDebug is not available');
    }
    this.makeIndexFlag = maxIndexFlag;
    if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
      YKLiblog.Log.debug(`this.makeindexFlag=${this.makeIndexFlag}`);
    } else {
      console.log(`[Top] this.makeindexFlag=${this.makeIndexFlag}`);
    }
    this.limitx = limitx;
    this.setup();
  }
  setup(){
    if (typeof UtilGmail === 'undefined' || typeof UtilGmail.makeTabledata2 !== 'function' || typeof UtilGmail.makeIdTabledata !== 'function') {
      this.safeLogDebug('setup: UtilGmail.makeTabledata2 or makeIdTabledata is not available');
      this.tabledata = null;
      this.idtabledata = null;
      return;
    }
    const tabledata = UtilGmail.makeTabledata2();
    this.tabledata = tabledata;
    const idtabledata = UtilGmail.makeIdTabledata();
    this.idtabledata = idtabledata;
    this.safeLogDebug(`Top setup this.idtabledata.targetedEmailIdsList=${this.idtabledata && this.idtabledata.targetedEmailIdsList}`);
    if (typeof Gmail !== 'function') {
      this.safeLogDebug('setup: Gmail constructor is not available');
      this.gmail = null;
      return;
    }
    const gmail = new Gmail(this.limitx, tabledata, idtabledata, this.makeIndexFlag);
    this.gmail = gmail;
    this.numOfItems = 0;
    this.safeLogDebug(`Top setup this.limitx=${this.limitx}`);
  }
  start(){
    if (!this.gmail) {
      this.safeLogDebug('start: this.gmail is not available');
      return;
    }
    this.safeLogDebug(`Top setup this.gmail.limitx=${this.gmail.limitx}`);
    const startInitIndex = 0;
    const endInitIndex = 1;
    if (typeof this.gmail.getKeys !== 'function') {
      this.safeLogDebug('start: this.gmail.getKeys is not available');
      return;
    }
    const keys = this.gmail.getKeys();
    if (!Array.isArray(keys) || keys.length < 2) {
      this.safeLogDebug('start: keys is not a valid array or too short');
      return;
    }
    const keya = [keys[1]];
    if (typeof UtilGmail === 'undefined' || typeof UtilGmail.makeIndex !== 'function') {
      this.safeLogDebug('start: UtilGmail.makeIndex is not available');
      return;
    }
    const [startIndex, limitx] = UtilGmail.makeIndex(startInitIndex, endInitIndex, 0);
    this.safeLogDebug(`startIndex=${startIndex} limitx=${limitx}`);
    if (typeof this.gmail.setStartIndex === 'function') {
      this.gmail.setStartIndex(startIndex);
    }
    if (typeof this.gmail.setLimitx === 'function') {
      this.gmail.setLimitx(limitx);
    }
    this.explore(this.gmail, this.numOfItems);
  }
  explore(gmail, numOfItems){
    this.safeLogDebug(`gmail`);
    if (!gmail) {
      this.safeLogDebug('explore: gmail is not available');
      return;
    }
    this.safeLogDebug(`explore gmail.limitx=${gmail.limitx}`);
    if (typeof gmail.getLimitedAccessRange !== 'function') {
      this.safeLogDebug('explore: gmail.getLimitedAccessRange is not available');
      return;
    }
    const range = gmail.getLimitedAccessRange();
    if (!Array.isArray(range) || range.length < 2) {
      this.safeLogDebug('explore: getLimitedAccessRange did not return valid [start, end]');
      return;
    }
    const [start, end] = range;
    this.safeLogDebug(`Top explore start=${start} end=${end}`);
    const endPlusOne = end + 1;
    if (typeof gmail.getKeys !== 'function') {
      this.safeLogDebug('explore: gmail.getKeys is not available');
      return;
    }
    const keys = gmail.getKeys();
    this.safeLogDebug(`keys=${keys}`);
    if (!gmail.tabledata || typeof gmail.tabledata !== 'object' || !gmail.tabledata.folderConf) {
      this.safeLogDebug('explore: gmail.tabledata.folderConf is not available');
      return;
    }
    const folderConf = gmail.tabledata.folderConf;
    for(let i=start; i < endPlusOne; i++){
      if( numOfItems >= folderConf.maxItems){
        this.safeLogDebug(`top break numOfItems=${numOfItems} gmail.folderConf.maxItems=${gmail.folderConf.maxItems}`);
        break;
      }
      if (!Array.isArray(keys) || i < 0 || i >= keys.length) {
        this.safeLogDebug(`explore: keys[${i}] is out of bounds`);
        continue;
      }
      const key = keys[i];
      this.safeLogDebug(`i=${i} key=${key}`);
      numOfItems = this.processOneTargetedEmail(gmail, key, numOfItems);
    }
    this.safeLogDebug(`explore END`);
  }
  processOneTargetedEmail(gmail, key, numOfItems = 0){
    this.safeLogDebug(`getOneTargetedEmail key=${key}`);
    if (!gmail || !gmail.tabledata || typeof gmail.tabledata.getTargetedEmail !== 'function') {
      this.safeLogDebug('processOneTargetedEmail: gmail.tabledata.getTargetedEmail is not available');
      return numOfItems;
    }
    const targetedEmail = gmail.tabledata.getTargetedEmail(key);
    if( typeof(targetedEmail) === "undefined" || !targetedEmail ){
      return numOfItems;
    }
    if (!gmail.folderConf) {
      this.safeLogDebug('processOneTargetedEmail: gmail.folderConf is not available');
      return numOfItems;
    }
    const folderConf = gmail.folderConf;
    if(targetedEmail.old_nth != folderConf.nth ){
      this.safeLogDebug(`getOneTargetedEmail key=${key} 1`);
    }
    else{
      this.safeLogDebug(`getOneTargetedEmail key=${key} 2`);
    }
    if (typeof targetedEmail.setMaxSearchesAvailable === 'function') {
      targetedEmail.setMaxSearchesAvailable(folderConf.maxSearchesAvailable);
    }
    if (typeof targetedEmail.setMaxThreads === 'function') {
      targetedEmail.setMaxThreads(folderConf.maxThreads);
    }
    if (typeof targetedEmail.backup === 'function') {
      targetedEmail.backup();
    }
    if (gmail.tabledata && typeof gmail.tabledata.rewrite === 'function') {
      gmail.tabledata.rewrite(targetedEmail);
    }
    if (gmail.tabledata && typeof gmail.tabledata.update === 'function') {
      gmail.tabledata.update();
    }
    this.safeLogDebug(`Top processOneTargetedEmail gmail.tabledata=${gmail.tabledata}`);
    this.safeLogDebug(`Top processOneTargetedEmail gmail.idtabledata=${gmail.idtabledata}`);
    this.safeLogDebug(`Top processOneTargetedEmail gmail.idtabledata.targetedEmailIdsList=${gmail.idtabledata && gmail.idtabledata.targetedEmailIdsList}`);
    if (typeof GmailList !== 'function') {
      this.safeLogDebug('processOneTargetedEmail: GmailList constructor is not available');
      return numOfItems;
    }
    const gmailList = new GmailList(targetedEmail, gmail.idtabledata, this.limitx);
    if (typeof gmailList.getMailListX !== 'function') {
      this.safeLogDebug('processOneTargetedEmail: gmailList.getMailListX is not available');
      return numOfItems;
    }
    const store = gmailList.getMailListX(gmail.op);
    if (typeof targetedEmail.setNth === 'function') {
      targetedEmail.setNth(folderConf.nth);
    }
    if (typeof store.get === 'function') {
      targetedEmail.setLastDateTime(store.get('last_date_time'));
    }
    if (gmail.tabledata && typeof gmail.tabledata.rewrite === 'function') {
      gmail.tabledata.rewrite(targetedEmail);
    }
    if (gmail.tabledata && typeof gmail.tabledata.update === 'function') {
      gmail.tabledata.update();
    }
    numOfItems += 1;
    return numOfItems;
  }
  safeLogDebug(message) {
    try {
      if (typeof YKLiblog !== 'undefined' && YKLiblog.Log && typeof YKLiblog.Log.debug === 'function') {
        YKLiblog.Log.debug(message);
      } else {
        console.log(`[Top] ${message}`);
      }
    } catch (error) {
      console.log(`[Top] Log error: ${error.message}`);
    }
  }
}
function start(){
  const top = new Top(3)
  top.start()
}



