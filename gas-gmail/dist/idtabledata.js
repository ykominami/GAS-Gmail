class IdTabledata {
  constructor(spreadsheet, config){
    this.config = config
    const [worksheet, header, values, headerRange, dataRowsRange, totalRange] = config.getRecordIds(spreadsheet)

    YKLiblog.Log.debug(`IdTabledata constructor header=${header} values=${values}`)
    this.spreadsheet = spreadsheet
    this.worksheet =  worksheet 
    // worksheetの四辺から連続した空白行、空白列を取り除いた長方形領域の最初の行に含まれるセルの値の配列
    this.header = header;
    // worksheetの四辺から連続した空白行、空白列を取り除いた長方形領域の第2行以降の行に含まれるセルの値の2次元配列
    this.values = values;
    this.totalRange = totalRange
    this.headerRange = headerRange
    this.dataRowsRange = dataRowsRange;
    if( this.dataRowsRange != null ){
      this.dataRowsRangeShape = YKLiba.Range.getRangeShape(this.dataRowsRange)
    }

    const targetedEmailIdsList = new TargetedEmailIdsList(values, config);
    this.targetedEmailIdsList = targetedEmailIdsList;
    YKLiblog.Log.debug(`============================== IdTabledata constructor this.targetedEmailIdsList=${this.targetedEmailIdsList}`)
  }
  addTabledata(tabledata){
    this.registeredEmailList.addTabledata(tabledata)
  }
  getKeys(){
    return this.targetedEmailIdsList.keys()
  }
  getTargetedEmailIdsByKey(key){
    return this.targetedEmailIdsList.getTargetedEmailIdsByKey(key);
  }
  getTargetedEmailIdsByIndex(index){
    return this.targetedEmailIdsList.getTargetedEmailIdsByIndex(index);
  }
  getRegisteredEmailByKey(key){
    return this.registeredEmailList.getRegisteredEmailByKey(key);
  }
  addRegisteredEmails(keys){
    keys.map( key => this.registeredEmailList.addRegisteredEmail(key))
  }

  adjust(additionalKeys){
    YKLiblog.Log.debug(`IdTabledata adjust S`)
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
    const existingKeys = this.targetedEmailIdsList.keys()
    // idワークシート上の重複しない検索対象のキー
    // idワークシートに重複したキーが存在する場合は、最初に現れたキーを持つ行が有効になる
    const existingKeySet = new Set(existingKeys)
    YKLiblog.Log.debug(`IdTabledata adjust 1-1 existingKeys=${[...existingKeys]}`)
    // idワークシート上の既存の検索対象に含まれない、追加用の検索対象を表すキーを選び出す
    const nonExistingKeys = additionalKeys.filter(el => !existingKeySet.has(el));
    YKLiblog.Log.debug(`IdTabledata adjust 1-2 nonExistingKeys=${nonExistingKeys}`)
    // idワークシート上の検索対象が記録された（重複したキーを持つ行を含めてすべての）領域の高さ、幅
    const [height, width] = this.targetedEmailIdsList.getHeightAndWidth()

    // idワークシートに存在しないキーに対応するクラスTargetedEmailIdsのインスタンスを、追加する
    if( nonExistingKeys.length > 0 ){
      YKLiblog.Log.debug(`IdTabledata adjust 2`)
      for( let i=0; i < nonExistingKeys.length; i++){
        const key = nonExistingKeys[i]
        // 既存のキーが存在する領域の直下に追加させるため、行番号を計算する
        const index = (height + 1) + i
        YKLiblog.Log.debug(`IdTabledata adjust 4 index=${index} key=${key}`)
        this.targetedEmailIdsList.addTargetedIds(index, [key])
      }
      // クラスTargetedEmailIdsListの状態を、対応するidワークシートに反映する
      this.update()
    }
    // 検索対象を表す全キー
    const keys = this.getKeys()
    // 検索対象と対応する検索結果記録を取得または作成する
    this.addRegisteredEmails(keys)
    YKLiblog.Log.debug(`IdTabledata adjust E`)
    // 検索対象メールまたは登録済みメールを表す、全てのキーを返す
    return keys
  }
  // 登録済みメールに対応するrowに対応する配列の値を書き換える
  rewrite(targetedEmailIds){
    const item = targetedEmailIds
    // this.values[item.index] = [item.name].concat(item.getDoneAsArray())
    this.values[item.index] = item.getDoneAsArray()
  }
  update(){
    // "_id"ワークシート上の、検索対象の記録済みメッセージIDと対応する領域の高さ、幅
    const [height, width] = this.targetedEmailIdsList.getHeightAndWidth()
    YKLiblog.Log.debug( `IdTabledata update height=${height} width=${width}` )
    // "_id"ワークシート上の、ヘッダーを除いたデータ領域のRange
    const dataRangeShape = YKLiba.Range.getRangeShape(this.dataRange)

    // 左端の列セルを除いた領域(書き替え前、書換え後のうち、大きい方の高さ、幅をもつ)をクリア
    if(width > 0){
      const idsRange = this.worksheet.getRange(dataRangeShape.r + 1, dataRangeShape.c + 1, height, width)
      idsRange.clear()
    }
 
    const rowsRange = this.worksheet.getRange(dataRangeShape.r + 1, dataRangeShape.c, height + 1, width + 1)
    const rowsRangeShape = YKLiba.Range.getRangeShape(rowsRange)
    
    YKLiblog.Log.debug( `IdTabledata update rowsRangeShape=${ JSON.stringify(rowsRangeShape) }` )
    const rows = rowsRange.getValues()
    const w = rows[0].length
    for(let h = 0; h < rowsRangeShape.h; h++){
      // 検索結果を記録したrowの場合は、そのデータのみを含む配列を返す
      // 検索結果を記録したrowでない場合は、そのrowの幅分の空白の配列を返す
      const srcValues = this.targetedEmailIdsList.getRowArray(h, width)
      // const srcValues = this.targetedEmailIdsList.getValueArray(h, width)
      const srcWidth = srcValues.length
      const[_maxW, minW] = YKLiba.Arrayx.getMaxAndMin([w, srcWidth])

      for(let i = 1; i < minW; i++){
        rows[h][i - 1] = srcValues[i]
      }
      YKLiblog.Log.debug( `IdTabledata update rows[${h}]=${rows[h]} }` )
    }
    YKLiblog.Log.debug( `IdTabledata update rows=${ JSON.stringify(rows) } }` )
    rowsRange.setValues(  rows )
  }
  updateRow(targetedEmailIds){
    // 
    const srcValues = targetedEmailIds.getDoneAsArray()
    const width = srcValues.length
    if( width === 0 ){
      return
    }
    YKLiblog.Log.debug(`IdTabledata updateRow width=${width}`)
    const dataRangeShape = YKLiba.Range.getRangeShape(this.dataRange)
    const [maxWidth, minWidth] = YKLiba.Arrayx.getMaxAndMin([dataRangeShape.w, width])
    // 左端の列セルを除いたtargetedEmailIdsの領域(書き込み前、書き込み後で、幅が長い方を指定する)をクリア
    const targetRange = this.worksheet.getRange(dataRangeShape.r + 1 + targetedEmailIds.index, dataRangeShape.c + 1, 1, maxWidth)
    targetRange.clear()

    const targetRangeShape = YKLiba.getRangeShape(targetRange)
    YKLiblog.Log.debug( `IdTabledata update targetRangeShape=${ JSON.stringify(targetRangeShape)} }` )
    YKLiblog.Log.debug( `IdTabledata update width=${ width } }` )

    // const targetValues = targetRange.getValues()
    const targetValues = Array(targetRangeShape.w - 1).fill('')
    YKLiblog.Log.debug( `IdTabledata update INIT targetValues.length=${targetValues.length}` )

    YKLiblog.Log.debug( `IdTabledata update BEFORE targetValues.length=${targetValues.length}` )
    for(let i = 0; i < width; i++){
      targetValues[i] = srcValues[i]
      // targetValuesx[i] = srcValues[i]
      YKLiblog.Log.debug( `IdTabledata update i=${i} targetValues.length=${targetValues.length}` )
    }
    YKLiblog.Log.debug( `IdTabledata update targetValues.length=${targetValues.length}` )
    const name = targetedEmailIds.getName()
    targetValues[0] = name
    const values = targetValues
    // const values = [name, ...targetValues]
    // targetValuesx[0] = name
    YKLiblog.Log.debug( `IdTabledata update values.length=${values.length}` )
    YKLiblog.Log.debug( `IdTabledata update JSON.stringify(values.length)=${  JSON.stringify(values) }` )
    // YKLiblog.Log.debug( `IdTabledata update JSON.stringify(valuesx.length)=${  JSON.stringify(valuesx) }` )

    targetRange.setValues(  [values] )
  }
}