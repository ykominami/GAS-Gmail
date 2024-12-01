function test_label() {
  const base_name = "The Hotwire Club"
  const targetlabel_name = base_name
  const endabel_name = base_name + "_"
  let targetlabel = GmailApp.getUserLabelByName(targetlabel_name)
  let endlabel = GmailApp.getUserLabelByName(endabel_name)

  const threads = targetlabel.getThreads()
  const len = threads.length
  YKLiba.Log.display_log("display_log # of messages in your Priority Inbox: " + len );
  let msgs = test_thread(threads[0])
  test_message(msgs[0])
}
function test_thread(thread){
  const msgs = thread.getMessages()
  YKLiba.Log.display_log(`# msgs.length=${ msgs.length }` );
  return msgs
}
function test_message(msg){
  YKLiba.Log.display_log(`# msgs.id=${ msg.getId() }` );
  YKLiba.Log.display_log(`# msgs.date=${ msg.getDate() }` );
}

function test_priority_inbox() {
  const threads = GmailApp.getPriorityInboxThreads()
  const len = threads.length
  YKLiba.Log.debug("debug # of messages in your Priority Inbox: " + len );
  YKLiba.Log.info("info # of messages in your Priority Inbox: " + len );
  YKLiba.Log.warn("warn # of messages in your Priority Inbox: " + len );
  YKLiba.Log.error("error # of messages in your Priority Inbox: " + len );
  YKLiba.Log.fault("fault # of messages in your Priority Inbox: " + len );
  YKLiba.Log.unknown("unknown # of messages in your Priority Inbox: " + len );
  YKLiba.Log.display_log("display_log # of messages in your Priority Inbox: " + len );
}

function test_remove_labels(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  let base_name 
  base_name = Store.THE_HOTWIRE_CLUB()
  remove_labels(base_name)
  base_name = Store.FRONTEND_FOCUS()
  remove_labels(base_name)
  base_name = Store.HOTWIRE_WEEKLY() 
  remove_labels(base_name)
}
function test_get_mail_threads(){
  base_name = Store.THE_HOTWIRE_CLUB()
  const store = get_valid_store(base_name, null)
  const threads = get_mail_threads(store, base_name)
  return threads
}
function test_threads_op_x(){
  YKLiba.Log.set_log_level(YKLiba.Log.DEBUG())
  let last_date = null
  base_name = Store.THE_HOTWIRE_CLUB()
  test_threads_op(base_name, last_date)
  base_name = Store.FRONTEND_FOCUS()
  test_threads_op(base_name, last_date)
  base_name = Store.HOTWIRE_WEEKLY() 
  test_threads_op(base_name, last_date)
}
function test_threads_op(base_name, last_date){
  const store = get_valid_store(base_name, null)
  const threads = get_mail_threads(store, base_name)
  const [filtered_msgs, filtered_rawcontents, new_last_date] = threads_op(store, threads, last_date)
  YKLiba.Log.debug(`filtered_msgs.length=${filtered_msgs.length}`)
}

