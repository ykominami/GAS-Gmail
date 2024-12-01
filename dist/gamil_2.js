
function get_mail_threads(store, base_name){
  const last_date = store.get('last_date')
  const [targetlabel_name, endlabel_name] = make_two_names(base_name)
  const [targetlabel, endlabel] = get_or_create_two_labels(targetlabel_name, endlabel_name)
  const start = 0
  const max = 100
  
  const query = `label:${targetlabel_name} -label:${endlabel_name}`
  const threads = get_mail_list_with_query(query, start, max)
  return threads
/*
  const [targetlabel_name, endlabel_name] = make_two_names(base_name)
  const [targetlabel, endlabel] = get_or_create_two_labels(targetlabel_name, endlabel_name)

  const query = `label:${targetlabel_name} -label:${endlabel_name}`
  const [threads_1, new_last_date_1] = search_and_register_and_save_data(store, query, 0, 100, base_name,last_date)
  endlabel.addToThreads(threads_1)
*?
/*
  const query2 = `from: ${base_name} -label:${targetlabel_name}`
  const [threads_2, new_last_date_2] = search_and_register_and_save_data(store, query2, 0, 100, base_name, last_date)
  endlabel.addToThreads(threads_2)
  targetlabel.addToThreads(threads_2)
*/
}
function search_and_register_and_save_data(store, query, start, max, base_name,last_date){
  let new_last_date = null
  const threads = get_mail_list_with_query(query, start, max)
  if( threads.length > 0 ){
    new_last_date = register_and_save_data(store, base_name, threads, last_date)
  }
  return [threads, new_last_date]
}
