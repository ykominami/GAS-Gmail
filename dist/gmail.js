function __A(){}

function execute_Test_gmail_x(){
  execute_Test_gmail()
}

function setup_for_gmail(base_name, arg_store=null){
  // YKLiba.Log.debug(`setup_for_gmail base_name=${base_name}`)
  // YKLiba.Log.debug(`setup_for_gmail arg_store=${arg_store}`)
  // const store = Store.get_valid_store(arg_store, base_name)
  const store = get_valid_store( base_name, arg_store )
  // YKLiba.Log.debug(`setup_for_gmail store.index=${store.index}`)
  // YKLiba.Log.debug(`setup_for_gmail store.base_name=${store.base_name}`)
  // YKLiba.Log.debug(`v=${v}`)
  // YKLiba.setup_folder_info(store, base_name)

  return store
}

// The Hotwire Club
function get_mail_list_from_Hotwire_Club(arg_store = null){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())

  const base_name = 'The Hotwire Club'
  // YKLiba.Log.debug(`base_name=${base_name}`)
  // YKLiba.Log.debug(`arg_store=${arg_store}`)
  const store = get_valid_store(base_name, arg_store)
  // YKLiba.Log.debug(`store.index=${store.index}`)
  // YKLiba.Log.debug(`store.base_namex=${store.base_name}`)
  // YKLiba.Log.debug(`Store.index()=${Store.index()}`)
  store.set('KEY', 'Value')
  setup_for_gmail(base_name, store)
  get_mail_list_base(store, base_name)
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
  const [targetlabel_name, endlabel_name] = make_two_names(base_name)
  const [targetlabel, endlabel] = get_or_create_two_labels(targetlabel_name, endlabel_name)

  // const threads_1 = get_mail_list_with_query(`label:${targetlabel_name}`, 0, 100)
  const threads_1 = get_mail_list_with_query(`label:${targetlabel_name} -label:${endlabel_name}`, 0, 100)
  if( threads_1.length > 0 ){
    [filtered_msgs, filtered_rawcontents, new_last_date_1] = threads_op(store, threads_1, last_date)
    if( filtered_msgs.length > 0){
      register_data(store, filtered_msgs, base_name)
      const folder = store.get('folder')
      output_supplementary_file_from_array(filtered_rawcontents, folder)
    }
  
    endlabel.addToThreads(threads_1)
  }

  // const threads_2 = get_mail_list_with_query(`label:${targetlabel_name}`, 0, 100)
  const threads_2 = get_mail_list_with_query(`from: ${base_name} -label:${targetlabel_name}`, 0, 100)
  if( threads_2.length > 0 ){
    [filtered_msgs_2, filtered_rawcontents_2, new_last_date_2] = threads_op(store, threads_2, last_date)
    if( filtered_msgs_2.length > 0){
      register_data(store, filtered_msgs_2, base_name)
      const folder = store.get('folder')
      output_supplementary_file_from_array(filtered_rawcontents_2, folder)
    }
    targetlabel.addToThreads(threads_2)
    endlabel.addToThreads(threads_2)
  }

  const array = [new_last_date_1, new_last_date_2, last_date]
  const latest_date = YKLiba.get_max(array)
  store.set('new_last_date', latest_date)
  if( YKLiba.isAfterDate(last_date, latest_date) ){
    YKLiba.update_folder_info_list_at_last_date(range_values, base_name, latest_date)
  }
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
function get_mail_list_from_Frontend_Focus(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const base_name = 'Frontend Focus'
  get_mail_list_base(base_name)
}

// Hotwire Weekly
function get_mail_list_from_hotwire_weekly(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  const base_name = 'Hotwire Weekly'
  get_mail_list_base(base_name)
}

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
  [targetlabel, endlabel] = make_labels(base_name)

  const threads = targetlabel.getThreads()
  targetlabel.removeFromThreads(threads)

  const threads2 = endlabel.getThreads()
  endlabel.removeFromThreads(threads2)
}

