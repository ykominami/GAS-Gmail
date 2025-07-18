/**
 * Gmailメッセージのバックアップファイルを管理するクラス
 * Google Driveのフォルダ内でGoogle Docsファイルとしてメッセージデータを保存・管理する
 */
class BackupFile {
  /**
   * BackupFileクラスのコンストラクタ
   * @param {Folder} folder - バックアップファイルを保存するGoogle Driveフォルダ
   */
  constructor(folder){
    this.folder = folder
    this.filenameSet = new Set()
    this.fileArrayByKey = null
  }
  
  /**
   * フォルダ内のGoogle Docsファイルを列挙し、ファイル名とファイルオブジェクトのマッピングを作成する
   * 既に列挙済みの場合は何もしない
   */
  listup(){
    YKLiblog.Log.debug(`listup 1 ##############`)
    if( this.fileArrayByKey !== null ){
      YKLiblog.Log.debug(`listup 2 ##############`)
      return
    }
    YKLiblog.Log.debug(`listup 3 ##############`)
    this.fileArrayByKey = {}
    const files = this.folder.getFilesByType(MimeType.GOOGLE_DOCS);
    // const files = this.folder.getFiles()
    while (files.hasNext()) {
      const file = files.next();
      const filename = file.getName()
      YKLiblog.Log.debug(`listup 4 filename=${filename}`)
      if( !this.filenameSet.has(filename) ){
        this.filenameSet.add(filename)
        this.fileArrayByKey[filename] = file
        YKLiblog.Log.debug(`listup 5 add filename=${filename}`)
      }
    }
  }
  
  /**
   * バックアップフォルダのURLを取得する
   * @returns {string} フォルダのURL
   */
  getUrl(){
    return this.folder.getUrl()
  }
  
  /**
   * メッセージデータのリストをバックアップファイルとして保存する
   * @param {Array} messageDataList - 保存するメッセージデータの配列
   * @throws {Error} messageDataListが未定義の場合にエラーを投げる
   */
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
  
  /**
   * メッセージデータの配列を順次処理して、各メッセージを個別のファイルとして出力する
   * @param {Array} messageDataList - 処理するメッセージデータの配列
   */
  outputSupplementaryFileFromArray(messageDataList){
    for(let i=0; i<messageDataList.length; i++){
      this.outputSupplementaryFile(messageDataList[i])
    } 
  }
  
  /**
   * 単一のメッセージデータからバックアップファイルを作成する
   * ファイル名は日時と件名から自動生成される
   * @param {Object} messageData - 保存するメッセージデータ
   */
  outputSupplementaryFile(messageData){
    const filename = `${ YKLiba.formatDateTimeManual(messageData.original.date) }_${messageData.original.subject}.json`
    // const rawcontent = messageData.msg.getRawContent()
    const rawcontent = messageData.original.plainBody
    this.getOrCreateFile(filename, rawcontent)
  }
  
  /**
   * 指定されたファイル名でファイルを取得または作成し、内容を更新する
   * ファイルが存在しない場合は新規作成し、存在する場合は内容を上書きする
   * @param {string} filename - ファイル名
   * @param {string} content - ファイルに保存する内容
   */
  getOrCreateFile(filename, content){
    let file
    this.listup()
    YKLiblog.Log.debug(`11 ############## filenameSet=${ JSON.stringify( [...this.filenameSet] ) }`)

    if( !this.filenameSet.has(filename) ){
      YKLiblog.Log.debug(`12 ############## filenameSet=${ JSON.stringify( [...this.filenameSet] ) }`)
      YKLiblog.Log.debug(`13 ############## filename=${ filename }`)
      const doc = DocumentApp.create(filename)
      YKLiblog.Log.debug(`14-0A ############## doc=${ doc }`)
      const docId = doc.getId()
      YKLiblog.Log.debug(`14-0B ############## docId=${ docId }`)
      file = DriveApp.getFileById(docId)
      file.moveTo(this.folder)
      YKLiblog.Log.debug(`14-0C ############## file=${ file }`)
      const fileId = file.getId()
      YKLiblog.Log.debug(`14-0D ############## fileId=${ fileId }`)
      const mimeType = file.getMimeType()
      YKLiblog.Log.debug(`14-1 ############## mimeType=${ mimeType }`)

      this.fileArrayByKey[filename] = file
    }
    else{
      file = this.fileArrayByKey[filename]
      const mimeType = file.getMimeType()
      YKLiblog.Log.debug(`14-2 ############## filename=${ mimeType }`)
    }
    YKLiblog.Log.debug(`01 ############## filename=${ filename }`)
    YKLiblog.Log.debug(`00 ############## file=${ file }`)
    const fileId = file.getId()
    YKLiblog.Log.debug(`02 ############## fileId=${ fileId }`)
    const doc = DocumentApp.openById(fileId)
    const body = doc.getBody();
    body.clear(); // この1行が、テキスト、画像、表などすべてを消去します
    body.appendParagraph(content);
    doc.saveAndClose();
  }
}
