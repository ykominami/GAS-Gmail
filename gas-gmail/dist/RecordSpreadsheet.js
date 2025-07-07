class RecordSpreadsheet {
  constructor(spreadsheet, config){
    this.config = config
  
    this.spreadsheet = spreadsheet
    this.registeredEmailList = new RegisteredEmailList(spreadsheet, config)
  }
  getRegisteredEmailList(){
    return this.registeredEmailList
  }
  addConfigSpreadsheet(configSpreadsheet){
    this.configSpreadsheet = configSpreadsheet
    this.targetedEmailList = configSpreadsheet.getTargetedEmailList()
    this.registeredEmailList.addTargetedEmailList(this.targetedEmailList)
    this.registeredEmailList.addRegisteredEmailFromTargetedEmailList()
  }
    // 1個の検索対象は、1個のキー(文字列)と対応する
    // クラスTargetedEmailは、1個の検索対象を表す。
    // クラスTargetedEmailListは、全ての検索対象を表す。
    // idワークシートには、検索対象の記録済みメッセージIDを登録する
    // クラスIdTabldataは、idワークシート（とidワークシートの属するスプレッドシート）を表す。
    // クラスTargetedEmailIdsは、idワークシートに記録された1個の検索対象の記録済みメッセージIDを表す
    // クラスTargetedEmailIdsListは、idワークシートに記録された全ての、検索対象の記録済みメッセージIDを表す
    // クラスTargetedEmailListは全ての検索対象を表し、設定情報ワークシートに対応する。
    // クラスTabledataは、設定情報ワークシートと(設定情報ワークシートの属するスプレッドシート)を表す。
    // クラスTargetedEmailは1個の検索対象を表し、その設定情報は、設定情報ワークシートに設定される（対応するキーを持つ行)
    // 検索対象を検索した結果を記録ワークシートに保存する（メッセージIDが重複しないように記録する）
    // クラスRegisteredEmailは、記録ワークシートを表す(ワークシート名は、対応する検索対象のキーと同一)
    // クラスRegisteredEmailListは、すべての記録ワークシートを表す
    // すべての記録ワークシートは、idワークシートの属するスプレッドシートに属する
    // 同一のキーを持つ設定情報と検索対象、検索結果記録は対応する
    // 各ワークシートはすべて同一のスプレッドシートに属するとは限らない。少なくとも、idワークシートと、設定情報ワークシートは、それぞれ異なるスプレッドシートに属する。
    // メソッドkeysは、現在のクラスRegisteredEmailListのもつキーを返す
    //    update()を実行する前は、現在のクラスRegisteredEmailListの状態が、idワークシート上の状態が一致しない可能性がある。
    //    update()を実行した後は、現在のクラスRegisteredEmailListの状態と、idワークシート上の状態は一致する。
    // 検索対象に対応する全てのキーを返す
    // const existingKeys = this.targetedEmailIdsList.keys()
    // idワークシート上の重複しない検索対象のキー
    // idワークシートに重複したキーが存在する場合は、最初に現れたキーを持つ行が有効になる
    // const existingKeySet = new Set(existingKeys)
    // YKLiblog.Log.debug(`IdTabledata adjust 1-1 existingKeys=${[...existingKeys]}`)
    // idワークシート上の既存の検索対象に含まれない、追加用の検索対象を表すキーを選び出す
    // const nonExistingKeys = additionalKeys.filter(el => !existingKeySet.has(el));
    // YKLiblog.Log.debug(`IdTabledata adjust 1-2 nonExistingKeys=${nonExistingKeys}`)
    // idワークシート上の検索対象が記録された（重複したキーを持つ行を含めてすべての）領域の高さ、幅
    //const [height, width] = this.targetedEmailIdsList.getHeightAndWidth()

}