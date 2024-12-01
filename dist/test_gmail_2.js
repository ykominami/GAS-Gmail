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

