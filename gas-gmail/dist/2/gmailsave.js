class GmailSave {
  constructor(folder){
    this.folder = folder
  }
  saveData(messageDataList){
    YKLiblog.Log.debug(`1 gmailsave|saveData|messagedata=${ JSON.stringify(messageDataList).slice(0,100) }`)
    if( typeof(messageDataList) !== "undefined" ){
      YKLiblog.Log.debug(`GmailSave.saveData 1`)
      // const folder = store.get('folder')
      
      // this.folder.getUrl()の存在チェック
      if (this.folder && typeof this.folder.getUrl === 'function') {
        YKLiblog.Log.debug(`GmailSave.saveData folder url=${this.folder.getUrl()}`)
      } else {
        YKLiblog.Log.debug("GmailSave.saveData: folder.getUrl() is not available")
      }
      
      this.outputSupplementaryFileFromArray(messageDataList, this.folder)
    }
    else{
      YKLiblog.Log.debug(`#### 2 messagedata=${JSON.stringify(messageDataList).slice(0,100) }`)
      throw Error(`GmailSave.saveData 3`)
    }
    // throw Error(`under saveData 3`)
  
  }
  
  outputSupplementaryFileFromArray(messageDataList, folder){
    if (!messageDataList || !Array.isArray(messageDataList)) {
      YKLiblog.Log.debug("outputSupplementaryFileFromArray: messageDataList is not a valid array");
      return;
    }
    
    for(let i=0; i<messageDataList.length; i++){
      this.outputSupplementaryFile(messageDataList[i], folder)
    } 
  }
  
  outputSupplementaryFile(messageData, folder){
    // messageDataとそのプロパティの存在チェック
    if (!messageData || !messageData.original) {
      YKLiblog.Log.debug("outputSupplementaryFile: messageData or messageData.original is not available");
      return;
    }
    
    // YKLiba.formatDateTimeManualの存在チェック
    if (typeof YKLiba === 'undefined' || typeof YKLiba.formatDateTimeManual !== 'function') {
      YKLiblog.Log.debug("outputSupplementaryFile: YKLiba.formatDateTimeManual is not available");
      return;
    }
    
    // 必要なプロパティの存在チェック
    const date = messageData.original.date || new Date();
    const subject = messageData.original.subject || 'no_subject';
    const filename = `${ YKLiba.formatDateTimeManual(date) }_${subject}`
    
    // const rawcontent = messageData.msg.getRawContent()
    const rawcontent = messageData.original.plainBody || ''
  
    // folder.getUrl()の存在チェック
    if (folder && typeof folder.getUrl === 'function') {
      YKLiblog.Log.debug(`===============folder=${folder.getUrl()} filename=${filename} rawcontent.length=${rawcontent.length}`)
    } else {
      YKLiblog.Log.debug(`===============folder=not_available filename=${filename} rawcontent.length=${rawcontent.length}`)
    }
    
    // YKLibb.Googleapi.outputFileUnderFolderの存在チェック
    if (typeof YKLibb !== 'undefined' && YKLibb.Googleapi && typeof YKLibb.Googleapi.outputFileUnderFolder === 'function') {
      YKLibb.Googleapi.outputFileUnderFolder(folder, filename, rawcontent)
    } else {
      YKLiblog.Log.debug("outputSupplementaryFile: YKLibb.Googleapi.outputFileUnderFolder is not available");
    }
  }
}
