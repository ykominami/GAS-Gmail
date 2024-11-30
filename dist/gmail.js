  function execute_Test_gmail_x(){
  execute_Test_gmail()
}

// The Hotwire Club
function get_mail_list_from_Hotwire_Club(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG)
  const base_name = 'The Hotwire Club'
  get_mail_list_base(base_name)
}

// Frontend Focus
function get_mail_list_from_Frontend_Focus(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG)
  const base_name = 'Frontend Focus'
  get_mail_list_base(base_name)
}

// Hotwire Weekly
function get_mail_list_from_hotwire_weekli(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG)
  const base_name = 'Hotwire Weekly'
  get_mail_list_base(base_name)
}

function gmail_search(query, start, max){
  threads = GmailApp.search(query, start, max);
  return [true, threads];
}

function get_all_messages(threads){
  const array = []
  for(let i=0; i<other_threads.length; i++ ){
    messages = threads[i].getMessages()
    array = [...array, ...messages]
  }
  return array
}

function remove_labels(base_name){
  [targetlabel, endlabel] = make_labels(base_name)

  const threads = targetlabel.getThreads()
  targetlabel.removeFromThreads(threads)

  const threads2 = endlabel.getThreads()
  endlabel.removeFromThreads(threads2)
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


function get_mail_list_base(base_name){
  //from: Frontend Focus 
  const [targetlabel_name, endlabel_name] = make_two_names(base_name)
  const [targetlabel, endlabel] = get_or_create_two_labels(targetlabel_name, endlabel_name)

  Store.init()
  Store.set('sheetname', base_name)

  const sheet = YKLiba.get_config_sheet()
  const range = YKLiba.get_simple_rows_range(sheet)
  const values = range.getValues()
  const folder_info_hash = YKLiba.get_folder_info_hash(values)

  const folder = YKLiba.get_folder_by_key(base_name, folder_info_hash)
  const last_date = YKLiba.get_last_date_by_key(base_name, folder_info_hash)

  Store.set('folder', folder)
  Store.set('last_date', last_date)
  Store.set('new_last_date', last_date)

  const threads1 = get_mail_list_with_query(`label:${targetlabel_name} -label:${endlabel_name}`, 0, 100)
  YKLiba.Log.display(threads1)
  new_last_date_1 = get_lastest_date_and_register_messages_from_thread(threads1, base_name)
  endlabel.addToThreads(threads1)
  const threads2 = get_mail_list_with_query(`from: ${base_name} -label:${targetlabel_name}`, 0, 100)
  new_last_date_2 = get_lastest_date_and_register_messages_from_thread(threads2, base_name)
  targetlabel.addToThreads(threads2)
  endlabel.addToThreads(threads2)

  let latest_date = new_last_date;
  if( YKLiba.diff_date(new_last_date_1, lastest_date) > 0){
    latest_date = new_last_date_1
  }
  if( YKLiba.diff_date(new_last_date_2, lastest_date) > 0){
    latest_date = new_last_date_2
  }
  Store.set('new_last_date', latest_date)
  YKLiba.update_folder_info_list_at_last_date(values, base_name, latest_date)
  range.setValues(values)
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
function register_message(msg, arg_date = null){
  let date

  if( arg_date === null){
    date = msg.getDate()
  }
  else{
    date = arg_date
  }
  const date_str = YKLiba.make_date_string(date)
  const folder = Store.get('folder')
  output_supplementary_file(msg, date_str, folder)
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

function isAfterDate(last_date, date){
  return (last_date !== null && YKLiba.diff_date(date, last_date) >= 0 )
}

function get_lastest_date_and_register_messages_from_message_array(msgs, last_date){
  return msgs
    .filter( msg => isAfterDate(msg.getDate(), last_date) )
    .reduce( (accumulator, msg) => {
      const date = msg.getDate()
      const msgdata = register_message(msg, date)

      accmulator[0].push(msgdata)

      if( isAfterDate(accumulator, date) ){
        accmulator[1] = date
      }

      return accmulator
    }, [[], new_last_date] )
}
function get_lastest_date_and_register_messages_from_thread(thread){
  const last_date = Store.get('last_date')
  const new_last_date = Store.get('new_last_date')

  YKLiba.Log.display(`get_lastest_date_and_register_messages_from_thread thread=${thread}`)
  const msgs = thread.getMessages()

  const msg = msgs[0]
  const date = msg.getDate()
  if( isAfterDate(date, last_date) ){
    return get_lastest_date_and_register_messages_from_message_array([msg], last_date, new_last_date)
  }
  else{
    return [[], new_last_date]
  }
}

function get_lastest_date_and_register_messages(threads){
  const result = threads.map( thread => get_messages_and_register_from_thread(thread) )
  const array = result.reduce( (accumlator, item) => [...accumlator, ...item[0]], [])
  if(array.length > 0){
    register_data(array)
  }
  return result[1]
}

function get_messages_and_register_0(threads){
  const result = []
  const folder = Store.get('folder')
  const sheetname = Store.get('sheetname')

  for(let i=0; i<threads.length; i++){
    const msgs = threads[i].getMessages();
    if( msgs === null ){
      break
    }
    for(let j=0; j<msgs.length; j++){
      const msg = msgs[j]
      //  msg.getRawContent() 
      date = msg.getDate()
      // YKLiba.Log.debug(`msg.getDate()=${date}`)
      const date_str = YKLiba.make_date_string(date)
      // YKLiba.Log.debug(`date_str=${date_str}`)
      output_supplementary_file(msg, date_str, folder)
      //break
      const msgdata = [
        msg.getId(),
        msg.getFrom(),
        msg.getSubject(),
        date_str,
        msg.getPlainBody(),
      ]
      result.push(msgdata)
    }
  }
  if(result.length === 0){
    result.push([])
  }
  register_data(result, sheetname)
}

function output_supplementary_file(msg, date_str, folder){
  const filename = `${date_str}_${msg.getSubject()}`
  YKLiba.Log.debug(`filename=${filename}`)
  // YKLiba.output_file_under_folder(folder, filename, msg.getRawContent())
}

function register_data(result, sheetname){
  YKLiba.Log.debug(`register_data sheetName=${sheetname}`)
  const last_date = Store.get('last_date')

  const ss_id = YKLiba.get_ss_id()
  let [ss, sheet] = YKLiba.get_spreadsheet(ss_id, sheetname)
  if(sheet === null){
    sheet = ss.insertSheet(sheetname)
  }
  const [range, values] = YKLiba.get_range_and_values(sheet)
  // range.getLastColumn()
  range.deleteCells(SpreadsheetApp.Dimension.COLUMNS);

  const height = result.length
  const width = result[0].length
  YKLiba.Log.debug(`height=${height} width=${width}`)
  let new_range = null 

  if (height > 0){
    if(width > 0){
      new_range = range.offset(
        0, 
        0, 
        height, 
        width
      )
    }
    else{
      return
    }
  }
  else{
    if(width > 0){
      new_range = range.offset(
        0, 
        0,
        0,
        width,
      )
    }
    else{
      return
    }
  }
  new_range.setValues( result )
  //  Logger.log( result )
}

function get_mail_list_0(query, key, targetlabel, endlabel, start, max){
  //from: Frontend Focus 
  const [ret, threads] = gmail_search(query, start, max)
  if (ret){
    const folder = YKLiba.get_folder_by_key(key)
    const result = []
    // Logger.log(`treads.length=${treads.length}`)
    for(let i=0; i<treads.length; i++){
      const msgs = threads[i].getMessages();
      if( msgs === null ){
        break
      }
      // Logger.log(`msgs.length=${msgs.length}`)
      for(let j=0; j<msgs.length; j++){
        const msg = msgs[j]
        //  msg.getRawContent() 
        YKLiba.output_file_under_folder(folder, msg.getSubject(), msg.getRawContent())
 
        const msgdata = [
          msg.getId(),
          msg.getFrom(),
          msg.getSubject(),
          msg.getDate(),
          msg.getPlainBody(),
        ]
        result.push(msgdata)
      }
    }
    const ss_id = YKLiba.get_ss_id()
    let [ss, sheet] = YKLiba.get_spreadsheet(ss_id, sheetName)
    if(sheet === null){
      sheet = ss.insertSheet(sheetName)
    }
    const [range, values] = YKLiba.get_range_and_values(sheet)
    const new_range = range.offset(0, 0, result.length, result[0].length)
    new_range.setValues( [[]] )
    new_range.setValues( result )
   //  Logger.log( result )
  }
}
function get_mail_list_from_hotwire_weekli_0(){
  let date_str = ""
  const ret = gmail_search('from: "Hotwire Weekly', 0, 100)
  if (ret[0] ){
    const result = []
    const treads = ret[1]
    // Logger.log(`treads.length=${treads.length}`)
    for(let i=0; i<treads.length; i++){
      const msgs = threads[i].getMessages();
      if( msgs === null ){
        break
      }
      // Logger.log(`msgs.length=${msgs.length}`)
      for(let j=0; j<msgs.length; j++){
        const msg = msgs[j]
        /*
        const msgdata = [
          msg.getFrom(),
          msg.getSubject(),
          msg.getDate().toLocalString(),
          msg.getMessages()
        ]
        */
        date_str = make_date_string(msg.getDate())
        const msgdata = [
          msg.getId(),
          msg.getFrom(),
          msg.getSubject(),
          date_str,
          msg.getPlainBody(),
          msg.getRawContent() 
        ]
        result.push(msgdata)
      }
    }
    const ss_id = YKLiba.get_ss_id()
    const [ss, sheet] = YKLiba.get_spreadsheet(ss_id, "Sheet1")
    const [range, values] = YKLiba.get_range_and_values(sheet)
    const new_range = range.offset(0, 0, result.length, result[0].length)
    new_range.setValues( result )
    Logger.log( result )
  }
}