function __A(){}

function execute_Test_gmail_x(){
  execute_Test_gmail()
}

// The Hotwire Club
function get_mail_list_from_Hotwire_Club(arg_store = null){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())

  const base_name = Store.THE_HOTWIRE_CLUB()
  get_mail_list(base_name, arg_store)
}

function get_mail_list_from_Frontend_Focus(arg_store = null){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const base_name = Store.FRONTEND_FOCUS()
  get_mail_list(base_name, arg_store)
}

// Hotwire Weekly
function get_mail_list_from_hotwire_weekly(arg_store = null){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const base_name = Store.HOTWIRE_WEEKLY()
  get_mail_list(base_name, arg_store)
}

function get_mail_list(base_name, arg_store){
  const store = get_valid_store(base_name, arg_store)
  setup_for_gmail(base_name, store)
  get_mail_list_base(store, base_name)
}

function setup_for_gmail(base_name, arg_store=null){
  const store = get_valid_store( base_name, arg_store )
  YKLiba.setup_folder_info(store, base_name)

  return store
}

function get_lastest_date_and_valid_messages_from_message_array(store, msgs, new_last_date){
  YKLiba.Log.debug(`get_lastest_date_and_valid_messages_from_message_array msgs.length=${msgs.length}`)

  const filtered_msgs = msgs
    .filter( msg => YKLiba.isAfterDate(new_last_date, msg.getDate()) )
     // YKLiba.Log.debug(`get_lastest_date_and_valid_messages_from_message_array`)
     // YKLiba.Log.debug( filtered_msgs )

  return filtered_msgs
    .reduce( (accumulator, msg) => {
      let date = null
      let msgdata = null
      try{
        date = msg.getDate()
        msgdata = register_message(store, msg, date)
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

      if( date !== null && (YKLiba.is_null_or_whitespace(accumulator[1]) || accumulator[1] < date) ){
        accumulator[1] = date
      }
      return accumulator
    }, [[[],[]], new_last_date] )
}

function threads_op(store, threads, last_date){
  const msgs = threads.map( (thread) => {
      return thread.getMessages()
    } ).flat(3)
  if( msgs.length === 9){
    return [[], last_date ]
  }
  YKLiba.Log.debug(`thread_op msgs.length=${msgs.length}`)
  const [[filtered_msgs, rawcontents], new_last_date_1] = get_lastest_date_and_valid_messages_from_message_array(store, msgs, last_date)

  YKLiba.Log.debug(`thread_op filtered_msgs.length=${filtered_msgs.length}`)

  return [filtered_msgs, rawcontents, new_last_date_1]
}

function get_mail_list_base(store, base_name){
  const last_date = store.get('last_date')
  const [targetlabel_name, endlabel_name] = make_two_names(base_name)
  const [targetlabel, endlabel] = get_or_create_two_labels(targetlabel_name, endlabel_name)

  // const threads_1 = get_mail_list_with_query(`label:${targetlabel_name}`, 0, 100)
  const query = `label:${targetlabel_name} -label:${endlabel_name}`
  const [threads_1, new_last_date_1] = search_and_register_and_save_data(store, query, 0, 100, base_name,last_date)
  endlabel.addToThreads(threads_1)

  const query2 = `from: ${base_name} -label:${targetlabel_name}`
  const [threads_2, new_last_date_2] = search_and_register_and_save_data(store, query2, 0, 100, base_name, last_date)
  endlabel.addToThreads(threads_2)
  targetlabel.addToThreads(threads_2)

  const array = [new_last_date_1, new_last_date_2, last_date]
  const latest_date = YKLiba.get_max(array)
  store.set('new_last_date', latest_date)
  if( YKLiba.isAfterDate(last_date, latest_date) ){
    YKLiba.update_last_date_of_folder_info_list(store, base_name, latest_date)
  }
}
// `label:${targetlabel_name} -label:${endlabel_name}`
// start 0
// max 100
function search_and_register_and_save_data(store, query, start, max, base_name,last_date){
  let new_last_date = null
  const threads = get_mail_list_with_query(query, start, max)
  if( threads.length > 0 ){
    new_last_date = register_and_save_data(store, base_name, threads, last_date)
  }
  return [threads, new_last_date]
}

function register_and_save_data(store, base_name, threads, last_date){
  [filtered_msgs, filtered_rawcontents, new_last_date] = threads_op(store, threads, last_date)
  if( filtered_msgs.length > 0){
    register_data(store, filtered_msgs, base_name)
    const folder = store.get('folder')
    output_supplementary_file_from_array(filtered_rawcontents, folder)
  }
  return new_last_date
}

function output_supplementary_file_from_array(rawcontents, folder){
  rawcontents.map( rawcontent => output_supplementary_file(rawcontent, folder) )
}

function output_supplementary_file(rawcontent, folder){
  const filename = `${rawcontent.date}_${rawcontent.subject}`
  YKLiba.Log.debug(`filename=${filename}`)
  YKLiba.output_file_under_folder(folder, filename, rawcontent.rawcontent)
}

function test_make_msgdata(){
  const msgdata = [
    "xid2234",
    "ykominami@gmail.com",
    "subject",
    "2024-11-29",
    "body"
  ]
  return msgdata
}
function test_make_msgdata_2(){
  const msgdata = [
    "xid2235",
    "ykominami@nifty.com",
    "subject2",
    "2024-11-28",
    "body2"
  ]
  return msgdata
}

function test_register_data(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  // Store.init()
  const sheetname = "Frontend Focus"
  let result = []
  const store = new Store()

  register_data(store, result, sheetname)

  const msgdata = test_make_msgdata()
  result.push(msgdata)
  register_data(store, result, sheetname)
/*
  const msgdata2 = test_make_msgdata_2()
  result.push(msgdata2)
  register_data(store, result, sheetname)
*/
}

function register_data(store, result, sheetname){
  YKLiba.Log.debug(`register_data sheetName=${sheetname}`)
  if( result.length === 0 ){
    return
  }
  const last_date = store.get('last_date')

  const ss_id = YKLiba.get_ss_id()
  let [ss, sheet] = YKLiba.get_spreadsheet(ss_id, sheetname)
  if(sheet === null){
    sheet = ss.insertSheet(sheetname)
  }
  const [range, values] = YKLiba.get_range_and_values(sheet)
  // range.getLastColumn()
  // range.deleteCells(SpreadsheetApp.Dimension.COLUMNS);
  range.deleteCells(SpreadsheetApp.Dimension.ROWS);

  YKLiba.Log.debug(`result`)
  YKLiba.Log.debug(result)

  const height = result.length
  const width = result[0].length
  YKLiba.Log.debug(`height=${height} width=${width}`)

  const new_range = YKLiba.transform_range(range, height, width)
  new_range.setValues( result )
  //  Logger.log( result )
}
// Frontend Focus
function gmail_search(query, start, max){
  threads = GmailApp.search(query, start, max);
  return [true, threads];
}

function get_or_create_two_labels(targetlabel_name, endlabel_name){
  let targetlabel = GmailApp.getUserLabelByName(targetlabel_name)
  if (targetlabel === null){
    targetlabel = GmailApp.createLabel(targetlabel_name)
  }
  let endlabel = GmailApp.getUserLabelByName(endlabel_name)
  if( endlabel === null){
    endlabel = GmailApp.createLabel(endlabel_name)
  }

  return [targetlabel, endlabel]
}

function make_two_names(base_name, post_fix='_'){
  const targetlabel_name = base_name
  const endlabel_name = targetlabel_name + post_fix

  return [targetlabel_name, endlabel_name]
}

function get_mail_list_with_query(query, start, max){
  const [ret, threads] = gmail_search(query, start, max)
  if( ret ){
    return threads
  }
  else{
    return []
  }
}

// "Frontend Focus"
function register_message(store, msg, arg_date = null){
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
  const folder = store.get('folder')
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

function remove_labels(base_name){
  const [targetlabel_name, endlabel_name] = make_two_names(base_name)
  const [targetlabel, endlabel] = get_or_create_two_labels(targetlabel_name, endlabel_name)

  const threads = targetlabel.getThreads()
  targetlabel.removeFromThreads(threads)

  const threads2 = endlabel.getThreads()
  endlabel.removeFromThreads(threads2)
}

