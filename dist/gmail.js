const ENV = new Env();

function __A(){}

function getMailThreadList(){
  let array = [];
  const values = YKLiba.get_values_from_config_sheet_y();
  // Logger.log(values);
  values.map( (item) => {
    // array = item[0].match(/([^\s]*)\s*(<[^>]>)/);
    // Logger.log(item[0])
    // array = item[0].match(/\s*(<[^>]>)/);
    // array = item[0].match(/<[^>]>/);
    const array = /<[^>]*>/.exec(item[0])
    if( array.length > 0 ){

    }
    else{
      Logger.log(item[0]);
    }
    // Logger.log(array);
  })
}

function getMailListAll(arg_store = null){
  let info;
  const sheet = YKLiba.get_config_sheet()
  const [header, values, dataRange] = YKLibb.setupSpreadsheetX(sheet)
  const tabledata = new Tabledata(header, values, dataRange);
  const op = YKLiba.configADD_UNDER_ROW()
  let store;
  let key = tabledata.keys()[11];

  CONFIG.setNoop(false)

  Logger.log(`tabledata.folderInfoList.folderConf=${ JSON.stringify(tabledata.folderInfolist.folderConf) }`)
/*
  const keyList = tabledata.keys()
  for(let i=0; i<keyList.length; i++){
    key = keyList[i]  
    info = tabledata.getInfo(key);
    info.setMaxSearchesAvailable(10);
    info.setMaxThreads(100);
    info.getOrCreateFolderUnderDocsFolder(ENV);
    info.backup();
    tabledata.rewrite(info);

    store = get_mail_list_x(info, op, arg_store);
    info.last_date = store.get('last_date');
    tabledata.rewrite(info);
  }
  tabledata.update();
  */
}

// The Hotwire Club
function get_mail_list_from_Hotwire_Club(arg_store = null){
  const basename = Store.THE_HOTWIRE_CLUB()
  // remove_labels(basename)
  const op = YKLiba.configADD_UNDER_ROW()
  return get_mail_list_x(basename, op, arg_store)
}

function get_mail_list_from_Frontend_Focus(arg_store = null){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const basename = Store.FRONTEND_FOCUS()
  // remove_labels(basename)
  const op = YKLiba.configADD_UNDER_ROW()
  // const op = YKLiba.Config.REWRITE()
  get_mail_list_x(basename, op, arg_store)
}

// Hotwire Weekly
function get_mail_list_from_hotwire_weekly(arg_store = null){
  const basename = Store.HOTWIRE_WEEKLY()
  const op = YKLiba.configADD_UNDER_ROW()
  get_mail_list_x(basename, op, arg_store)
}

function get_mail_list_x(info, op, arg_store = null){
  const pairLabel = new PairLabel(info.name)
  const queryInfo = new QueryInfo(info.condition, pairLabel, info.maxThreads, info.maxSearchesAvailable)
  return get_mail_list(info, op, queryInfo, arg_store)
}

function get_mail_list(info, op, queryInfo, arg_store=null){
  const store = setup_for_gmail(info.name);

  store.set("name", info.name );
  store.set("condition", info.condition );
  store.set("id", info.id );
  store.set("url", info.url );
  store.set("last_date", info.last_date );
  store.set("folder", info.folder );

  get_mail_list_base(store, info, op, queryInfo)

  return store;
}

function setup_for_gmail(base_name, arg_store=null){
  const store = get_valid_store( base_name, arg_store )
  return store
}

function get_mail_list_base(store, info, op, queryInfo){
  let start = queryInfo.start
  let maxTreads = queryInfo.maxThreads
  let maxSearchesAvailable = queryInfo.maxSearchesAvailable
  let new_last_date = null

  let last_date = store.get('last_date')
  YKLiba.Log.debug(`last_date=${last_date}`)
  if( YKLiba.is_undefined(last_date) ){
    // throw new Error(`last_date is undefined`)
    last_date = new Date(1970, 0, 1).getTime();
  }
  else{
    last_date = new Date(last_date).getTime();
  }

  const targetLabel = queryInfo.pairLabel.targetLabel
  const endLabel = queryInfo.pairLabel.endLabel
  
  const firstQuery = queryInfo.getQuery0()
  const [threads, msgs, count] = get_threads_and_messages(firstQuery, start, maxTreads, maxSearchesAvailable)
  info.setCount(count)
  const [[filtered_msgs, rawcontents], new_last_date_1] = get_latest_date_and_valid_messages_from_message_array(msgs, last_date)
  register_and_save_data(store, info.name, op, filtered_msgs, rawcontents)
  endLabel.addToThreads(threads)
  /********************************** */
  const secondQuery = queryInfo.getQuery1()
  const [threads_2, msgs_2, count_2] = get_threads_and_messages(secondQuery, start, maxTreads, maxSearchesAvailable)
  info.setCount2(count_2)
  const [[filtered_msgs_2, rawcontents_2], new_last_date_2] = get_latest_date_and_valid_messages_from_message_array(msgs_2, last_date)
  if( Config.isNoop() ){
    Logger.log(`${info.name} filtered_msgs_2=${ filtered_msgs_2.length }`)
  }
  else{
    register_and_save_data(store, info.name, op, filtered_msgs_2, rawcontents_2)
  }
  targetLabel.addToThreads(threads_2)
  endLabel.addToThreads(threads_2)

  const array = [new_last_date_1, new_last_date_2, last_date]
  const [latest_date, earlist_date] = YKLiba.getMaxAndMin(array)
  store.set('new_last_date', latest_date)
  Logger.log(`last_date=${last_date} latest_date=${latest_date}`)
  if( YKLiba.isAfterDate(last_date, latest_date) ){
    store.set('last_date', latest_date)
    // YKLiba.update_last_date_of_folder_info_list(store, info.name, latest_date)
  }
}

//  const firstQuery = queryInfo.getQuery0()
function get_threads_and_messages(query, start, maxTreads, maxSearchesAvailable){
  YKLiba.Log.debug(`################## query=${query}`)
  const threads = get_mail_list_with_query(query, start, maxTreads)
  const msgs = getMessages(threads)
  return [threads, msgs.slice(0, maxSearchesAvailable), msgs.length]
}
function get_mail_list_with_query(query, start, max){
  YKLiba.Log.debug(`### get_mail_list_with_query 0 query=${query} start=${start} max=${max}`)
  const [ret, threads] = gmail_search(query, start, max)
  if( ret ){
    YKLiba.Log.debug(`### get_mail_list_with_query 1 threads.length=${threads.length}`)
    return threads
  }
  else{
    YKLiba.Log.debug(`### get_mail_list_with_query 2 threads.length=${threads.length}`)
    return []
  }
}

function gmail_search(query, start, max){
  threads = GmailApp.search(query, start, max);
  // 取得したスレッドを日付の古い順にソート
  threads.sort(function(a, b) {
    return a.getLastMessageDate().getTime() - b.getLastMessageDate().getTime();
  });

  return [true, threads];
}

function getMessages(threads){
  const msgs = threads.map( (thread) => {
      const messages = thread.getMessages()
      return messages
  } ).flat(3)

  return msgs
}

function get_latest_date_and_valid_messages_from_message_array(msgs, new_last_date){
  const filtered_msgs = msgs
    .filter( msg => {
      const ret = YKLiba.isAfterDate(new_last_date, msg.getDate())
      YKLiba.Log.debug(`ret=${ret} msg.getDate()=${msg.getDate()}`)
      return ret
    } )

  const ret = filtered_msgs
    .reduce( (accumulator, msg) => {
      let date = null
      let msgdata = null
      try{
        date = msg.getDate()
        msgdata = make_message(msg, date)
        rawcontent = {date: date, subject: msg.getSubject(), rawcontent:msg.getRawContent()}
      }
      catch(error){
        YKLiba.Log.unknown(error.name)
        YKLiba.Log.unknown(error.message)
        YKLiba.Log.unknown(error.stack)
      }

      if(msgdata !== null){
        accumulator[0][0].push(msgdata)
        accumulator[0][1].push(rawcontent)
      }

      if( date !== null && (YKLiba.isNullOrWhitespace(accumulator[1]) || accumulator[1] < date) ){
        accumulator[1] = date
      }
      return accumulator
    }, [[[],[]], new_last_date] )

  return ret
}

function make_message(msg, arg_date = null){
  let date

  if( arg_date !== null){
    date = arg_date
  }
  else{
    try{
      date = msg.getDate()
    }
    catch(error){
      YKLiba.Log.unknown(error)
      return null
    }
  }
  const date_str = YKLiba.make_date_string(date)
  //break
  const msgdata = [
    msg.getId(),
    msg.getFrom(),
    msg.getSubject(),
    date_str,
    msg.getPlainBody(),
  ]
  return msgdata
}

function register_and_save_data(store, base_name, op, msgs, rawcontents){
  register_data(store, op, msgs, base_name)
  const folder = store.get('folder')
  output_supplementary_file_from_array(rawcontents, folder)
}

function register_data(store, op, result, sheetname){
  if( result.length === 0 ){
    return
  }
  const last_date = store.get('last_date')

  const ss_id = YKLiba.get_ss_id()
  let [ss, sheet] = YKLiba.get_spreadsheet(ss_id, sheetname)
  if(sheet === null){
    sheet = ss.insertSheet(sheetname)
  }
  const [values, dataRange] = YKLibb.getValuesFromSheet(sheet);
  let range = dataRange;
  let range2;
  if( op === YKLiba.configREWRITE() ){
    range2 = range;
    range2.deleteCells(SpreadsheetApp.Dimension.ROWS);
  }
  else{
    // YKLiba.Config.ADD_UNDER_ROW
    // 既存のrangeの最後のROWの直下から追加する
    const rangeShape = YKLiba.getRangeShape(range)
    range2 = range.offset(rangeShape.h, 0, rangeShape.h, rangeShape.w)
  }

  YKLiba.Log.debug(`result`)
  YKLiba.Log.debug(result)

  const height = result.length
  const width = result[0].length
  // YKLiba.Log.debug(`register_data height=${height} width=${width}`)
  Logger.log(`register_data height=${height} width=${width}`)

  const range3 = YKLiba.transformRange2(range2, height, width)
  range3.setValues( result );
}

function output_supplementary_file_from_array(rawcontents, folder){
  rawcontents.map( rawcontent => output_supplementary_file(rawcontent, folder) )
}

function output_supplementary_file(rawcontent, folder){


  const filename = `${ YKLiba.formatDateTimeManual(rawcontent.date) }_${rawcontent.subject}`
  YKLiba.Log.debug(`filename=${filename}`)
  YKLiba.output_file_under_folder(folder, filename, rawcontent.rawcontent)
}

function remove_labels(base_name){
  pairLabel = new PairLabel(base_name)

  const threads = pairLabel.targetLabel.getThreads()
  pairLabel.targetLabel.removeFromThreads(threads)

  const threads2 = pairLabel.endLabel.getThreads()
  pairLabel.endLabel.removeFromThreads(threads2)
}

function clear_sheet(sheetname){
  const sheet = YKLiba.get_sheet(sheetname)
  YKLiba.clear_sheet(sheet)
}