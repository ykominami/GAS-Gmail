/**
 * Gmailラベルのペアを管理するクラス
 * ターゲットラベルとエンドラベル（ターゲットラベル名に"_"を付けたもの）をペアで扱う
 */
class PairLabel {
  /**
   * 指定された名前のラベルを取得する。存在しない場合は新規作成する
   * @param {string} labelName - ラベル名
   * @returns {GmailLabel} Gmailラベルオブジェクト
   */
  static getOrCreateLabel(labelName){
    let label = GmailApp.getUserLabelByName(labelName) 
    if (label === null){
      label = GmailApp.createLabel(labelName)
    }
    return label
  }
  
  /**
   * PairLabelクラスのコンストラクタ
   * ターゲットラベルとエンドラベルを初期化する
   * @param {string} name - ターゲットラベル名
   */
  constructor(name){
    this.targetLabelName = name
    this.endLabelName = this.makeEndLabelName(name)
    this.targetLabel = PairLabel.getOrCreateLabel(this.targetLabelName) 
    this.endLabel = PairLabel.getOrCreateLabel(this.endLabelName) 
  }
  
  /**
   * 指定された名前からエンドラベル名を生成する
   * @param {string} name - 元のラベル名
   * @returns {string} エンドラベル名（元の名前 + "_"）
   */
  makeEndLabelName(name){
    return name + "_"
  }
  
  /**
   * ターゲットラベルを取得する
   * @returns {GmailLabel} ターゲットラベルオブジェクト
   */
  getTargetLabel(){
    return this.targetLabel
  }
  
  /**
   * エンドラベルを取得する
   * @returns {GmailLabel} エンドラベルオブジェクト
   */
  getEndLabel(){
    return this.endLabel
  }
  
  /**
   * ターゲットラベル名を取得する
   * @returns {string} ターゲットラベル名
   */
  getTargetLabelName(){
    return this.targetLabelName
  }
  
  /**
   * エンドラベル名を取得する
   * @returns {string} エンドラベル名
   */
  getEndLabelName(){
    return this.endLabelName
  }
  
  /**
   * ターゲットラベルを持つメールからターゲットラベルを削除する
   */
  removeTargetLabelFromEmails(){
    this.removeLabelFromEmails(this.targetLabelName, this.targetLabel)
  }
  
  /**
   * エンドラベルを持つメールからエンドラベルを削除する
   */
  removeEndLabelFromEmails(){
    const endLabelName = this.endLabelName
    const endLabel = this.endLabel
    this.removeLabelFromEmails(this.endLabelName, this.endLabel)
  }
  
  /**
   * 指定したラベルを持つメールからラベルを削除する
   *
   * @param {string} labelName - 削除したいラベル名
   * @param {GmailLabel} label - 削除したいラベルオブジェクト
   */
  removeLabelFromEmails(labelName, label) {
    YKLiblog.Log.debug(`Gmail removeLabelFromEmails labelName=${labelName}`)
    // ラベルが存在しない場合は処理を終了
    if (!label) {
      YKLiblog.Log.debug("指定されたラベルが見つかりませんでした: " + labelName);
      return;
    }
    // 指定されたラベルを持つスレッドを検索
    let threads = label.getThreads();
    // 各スレッドに対してラベルを削除
    for (var i = 0; i < threads.length; i++) {
      try{
        YKLiblog.Log.debug(`Gmail removeLabelFromEmails i=${i} label=${label}`)
        threads[i].removeLabel(label);
      }
      catch(e){
        YKLiblog.Log.unknown(`i=${i} label=${label}`)
        YKLiblog.Log.unknown(e.name)
        YKLiblog.Log.unknown(e.message)
        YKLiblog.Log.unknown(e.stack)
      }
    }
    YKLiblog.Log.debug(threads.length + "件のスレッドからラベル '" + labelName + "' を削除しました。");
  }

  /**
   * スレッドをラベルに追加する
   * 検索方法に応じてターゲットラベルまたはエンドラベルを追加する
   * @param {Object} within - スレッドとメッセージデータを含むオブジェクト
   * @param {string} way - 検索方法（EmailFetcherAndStorer.SearchWithTargetLabel() または EmailFetcherAndStorer.SearchWithFrom()）
   */
  addThreadToLabel(within, way){
    if( within.msgCount > 0 ){
      YKLiblog.Log.debug(`PairLabel addTreadToLabel 4`)
      within.array.map( threadAndMessagedataarray => {
        const thread = threadAndMessagedataarray.thread
        if( typeof(thread) === "undefined"){
          throw new Error(`addThreadToLabel threadAndMessagedataarray=${threadAndMessagedataarray} threadAndMessagedataarray.constuctor=${ threadAndMessagedataarray.constructor }`)
        }
        YKLiblog.Log.debug(`PairLabel addTreadToLabel 5`)
        if( way === EmailFetcherAndStorer.SearchWithTargetLabel() ){
          YKLiblog.Log.debug(`PairLabel addTreadToLabel 6 add Label`)
          try{
            thread.addLabel(this.endLabel)
          }
          catch(e){
            YKLiblog.Log.unknown(`${e.name}`)
            YKLiblog.Log.unknown(`${e.message}`)
            YKLiblog.Log.unknown(`${e.stack}`)
          }
          // throw new Error(`PairLabel addTreadToLabel SearchWithTargetLabel`)
        }
        else if(way === EmailFetcherAndStorer.SearchWithFrom()){
          YKLiblog.Log.debug(`PairLabel addTreadToLabel 7 add Label`)
          try{
            thread.addLabel(this.targetLabel)
          }
          catch(e){
            YKLiblog.Log.unknown(`${e.name}`)
            YKLiblog.Log.unknown(`${e.message}`)
            YKLiblog.Log.unknown(`${e.stack}`)
          }
          try{
            thread.addLabel(this.endLabel)
          }
          catch(e){
            YKLiblog.Log.unknown(`${e.name}`)
            YKLiblog.Log.unknown(`${e.message}`)
            YKLiblog.Log.unknown(`${e.stack}`)
          }
        }
      })
    }
    else{
      if(within.msgCount != 0){
        throw new Error(`PairLabel addTreadToLabel within.msgCount within.msgCount=${within.msgCount}`)
      }
    }
  }
}

/**
 * 指定された名前のラベルを取得する。存在しない場合は新規作成する
 * @param {string} labelName - ラベル名
 * @returns {GmailLabel} Gmailラベルオブジェクト
 */
function getOrCreateLabel(labelName){
  let label = GmailApp.getUserLabelByName(labelName) 
  if (label === null){
    label = GmailApp.createLabel(labelName)
  }
  return label
}
