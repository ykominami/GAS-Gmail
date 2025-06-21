function saveData(store, messageDataList ){
  // Logger.log(`1 gmailsave|saveData|messagedata=${ JSON.stringify(messageDataList).slice(0,100) }`)
  if( typeof(messageDataList) !== "undefined" ){
    // Logger.log(`gmailsave|saveData|messageDataList= 1`)
    const folder = store.get('folder')
    output_supplementary_file_from_array(messageDataList, folder)
  }
  else{
    // throw Error(`SearchWithBase 3`)
    // Logger.log(`#### 2 messagedata=${JSON.stringify(messageDataList).slice(0,100) }`)
  }
  // throw Error(`under saveData 3`)

}

function output_supplementary_file_from_array(messageDataList, folder){
  for(let i=0; i<messageDataList.length; i++){
    output_supplementary_file(messageDataList[i], folder)
  } 
}

function output_supplementary_file(messageData, folder){
  const filename = `${ YKLiba.formatDateTimeManual(messageData.original.date) }_${messageData.original.subject}`
  // const rawcontent = messageData.msg.getRawContent()
  const rawcontent = messageData.original.plainBody

  YKLiba.Log.debug(`=============== filename=${filename} rawcontent.length=${rawcontent.length}`)
  YKLiba.output_file_under_folder(folder, filename, rawcontent)
}
