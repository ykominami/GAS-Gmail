class GmailSave {
  constructor(folder){
    folder.x
    this.folder = folder
  }

  saveData(messageDataList){
    YKLiblog.Log.debug(`1 gmailsave|saveData|messagedata=${ JSON.stringify(messageDataList).slice(0,100) }`)
    if( typeof(messageDataList) !== "undefined" ){
      YKLiblog.Log.debug(`GmailSave.saveData 1`)
      // const folder = store.get('folder')
      YKLiblog.Log.debug(`GmailSave.saveData folder url=${this.folder.getUrl()}`)
      this.outputSupplementaryFileFromArray(messageDataList, this.folder)
    }
    else{
      throw Error(`GmailSave.saveData 3`)
      YKLiblog.Log.debug(`#### 2 messagedata=${JSON.stringify(messageDataList).slice(0,100) }`)
    }
    // throw Error(`under saveData 3`)
  }
  
  outputSupplementaryFileFromArray(messageDataList, folder){
    for(let i=0; i<messageDataList.length; i++){
      this.outputSupplementaryFile(messageDataList[i], folder)
    } 
  }
  
  outputSupplementaryFile(messageData, folder){
    const filename = `${ YKLiba.formatDateTimeManual(messageData.original.date) }_${messageData.original.subject}`
    // const rawcontent = messageData.msg.getRawContent()
    const rawcontent = messageData.original.plainBody
  
    YKLiblog.Log.debug(`===============folder=${folder.getUrl()} filename=${filename} rawcontent.length=${rawcontent.length}`)
    YKLibb.Googleapi.outputFileUnderFolder(folder, filename, rawcontent)
  }
}
