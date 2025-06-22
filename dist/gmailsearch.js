class GmailSearch {
  static SearchWithTargetLabel(queryInfo, store, info, op, start, maxThreads, maxSearchesAvailable, lastDate, limit){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }
    return GmailSearch.SearchWithBase(queryInfo.pairLabel, queryInfo.getQuery0(), store, info, op, start, maxThreads, maxSearchesAvailable, lastDate, limit)
  }
  static SearchWithFrom(queryInfo, store, info, op, start, maxThreads, maxSearchesAvailable, lastDate, limit){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }
    return GmailSearch.SearchWithBase(queryInfo.pairLabel, queryInfo.getQuery1(), store, info, op, start, maxThreads, maxSearchesAvailable, lastDate, limit)
  }
  static SearchWithBase(pairLabel, query, store, info, op, start, maxThreads, maxSearchesAvailable, lastDate, limit){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}`)
    }

    const [within, remain] = GmailSearch.getThreadsAndMessagedataArray(query, start, maxThreads, maxSearchesAvailable)
    info.setCount( within.msgCount )
    // YKLiba.Log.debug(`SearchWithBase query=${JSON.stringify(query)} within=${ JSON.stringify(within).slice(0, 100) }`)

    const newLastDateTime = within.lastDate.getTime()

    return [newLastDateTime, within, remain]
  }
  //  const firstQuery = queryInfo.getQuery0()
  static getThreadsAndMessagedataArray(query, start, maxThreads, maxSearchesAvailable){
    YKLiba.Log.debug(`################## query=${query}`)
    const initialValue = [
      new Messagearray(),
      new Messagearray(),
    ]
    initialValue[0].maxSearchesAvailable = maxSearchesAvailable
    initialValue[0].maxThreads = maxThreads
  
    let msgsStatus = true

    if( maxThreads <= 0){
      throw Error(`maxTreads=${maxTreads}`)
    }
    const threads = GmailSearch.get_mail_list_with_query(query, start, maxThreads)

    if( threads !== null ){
      const threadAndMessagedataarrayList = threads.map( (thread) => {
        YKLiba.Log.debug(`GmailSearch.getThreadsAndMessagedataArray thread=${JSON.stringify(thread)} thread=${thread}`)
        const messages = thread.getMessages()
        const messagedataArray = messages.map( (message) =>  new Messagedata(message, message.getDate()) )
        return new ThreadAndMessagedataarray(thread, messagedataArray)
      } )

      let maxSearchesAvailable;
      let maxThreads;
      let msgsStatus = true
      const resultArray = threadAndMessagedataarrayList.reduce( (accumulator, currentValue) => {
        YKLiba.Log.debug(`getThreadsAndMessagedataArray　currentValue.constructor=${currentValue.constructor}`)
        // const thread = currentValue.thread()
        const thread = currentValue.thread
        const messagedataArray = currentValue.messagedataArray

        maxSearchesAvailable = accumulator[0].maxSearchesAvailable;
        maxThreads = accumulator[0].maxThreads;
        // YKLiba.Log.debug(`gmailsearch|getThreadsAndMessagedataArray|threads.length=${threads.length} maxSearchesAvailable=${maxSearchesAvailable} maxThreads=${maxThreads}`)

        if( msgsStatus ){
          if( (messagedataArray.length > maxSearchesAvailable) || maxThreads <= 0 ){
            msgsStatus = false
          }
        }
        // YKLiba.Log.debug(`gmailsearch|getThreadsAndMessagedataArray|msgsStatus=${msgsStatus} messagedataArray.length=${messagedataArray.length} maxSearchesAvailable=${maxSearchesAvailable} maxThreads=${maxThreads}`)
        if( msgsStatus ){
          accumulator[0].array.push(currentValue)
          accumulator[0].msgCount += messagedataArray.length
          accumulator[0].threadCount += 1
          accumulator[0].lastDate = thread.getLastMessageDate()
          accumulator[0].maxSearchesAvailable -= messagedataArray.length 
          accumulator[0].maxThreads -= 1
        }
        else{
          accumulator[1].array.push(currentValue)
          accumulator[1].msgCount += messagedataArray.length
          accumulator[1].threadCount += thread.length
          accumulator[1].lastDate = thread.getLastMessageDate()
        }
        return accumulator
      }, initialValue )
      // YKLiba.Log.debug(`gmailsearch|getThreadsAndMessagedataArray| 1 0 resultArray=${ JSON.stringify(resultArray[0]).slice(0, 2000) }`)
      // YKLiba.Log.debug(`gmailsearch|getThreadsAndMessagedataArray| 1 1 resultArray=${ JSON.stringify(resultArray[1]).slice(0, 2000) }`)
      return resultArray
    }
    else{
      // YKLiba.Log.debug(`gmailsearch|getThreadsAndMessagedataArray| 2 initialValue=${ JSON.stringify(initialValue).slice(0, 500) }`)
      return initialValue
    }
  }
  static get_mail_list_with_query(query, start, maxThreads){
    if( maxThreads <= 0){
      throw Error(`maxThreads=${maxThreads}` )
    }
    YKLiba.Log.debug(`### get_mail_list_with_query 0 query=${query} start=${start} maxThreads)=${maxThreads}`)
    const [ret, threads] = GmailSearch.gmail_search(query, start, maxThreads)
    if( ret ){
      // YKLiba.Log.debug(`##### gmailsearch|get_mail_list_with_query ret=${ret} threads.length=${threads.length}`)
      YKLiba.Log.debug(`### get_mail_list_with_query 1 threads.length=${threads.length}`)
      return threads
    }
    else{
      YKLiba.Log.debug(`### get_mail_list_with_query 2 threads=null`)
      return null
    }
  }
  static gmail_search(query, start, maxThreads){
    const threads = GmailApp.search(query, start, maxThreads);
    // 取得したスレッドを日付の古い順にソート
    threads.sort(function(a, b) {
      return a.getLastMessageDate().getTime() - b.getLastMessageDate().getTime();
    });
    if( threads.length > 0 ){
      return [true, threads];
    }
    else{
      return [false, null];
    }
  }
  static collectMessagesdataAfterDate( threadAndMessagedataarrayList, new_last_date ){
    // YKLiba.Log.debug(`gmailsearch|collectMessagesdataAfterDate|new_last_date=${ JSON.stringify(new_last_date).slice(0, 500)}`)
    const messageDataList = []
    threadAndMessagedataarrayList.forEach( threadAndMessagedataarray => {
        // const thread = threadAndMessagedataarray.thread
        threadAndMessagedataarray.messagedataArray.forEach( (messagedata) => {
          messagedata.isAfter = YKLiba.Utils.isAfterDate(new_last_date, messagedata.msg.getDate())
          messageDataList.push(messagedata)
        })
    } )
    return messageDataList
  }

  static get_latest_date_and_valid_messages_from_message_array0( threadAndMsgs, new_last_date ){
    const filteredMessagedataList = collectMessagesdataAfterDate( threadAndMsgs, new_last_date )
    if(filteredMessagedataList.length === 0){
      // YKLiba.Log.debug(`GAS-Gmail|get_latest_date_and_valid_messages_from_message_array| 2-2`)
      return [[], new_last_date]
    }
    const result = filteredThreadAndMessagedataArray
      .reduce( (accumulator, threadAndMessagedata) => {
        let date = null
        let msgdaterawdata = null
        try{
          date = msg.getDate()
          // YKLiba.Log.debug(`GAS-Gmail|get_latest_date_and_valid_messages_from_message_array| date=${date} 4`)
          msgdaterawdata = new Msgdaterawdata(msg, date)
          // msgdata = new Messagedate(msg, date)
          // rawcontent = new Rawcontent(msg, date)
        }
        catch(error){
          YKLiba.Log.unknown(error.name)
          YKLiba.Log.unknown(error.message)
          YKLiba.Log.unknown(error.stack)
        }

        if(msgdaterawdata !== null){
          // YKLiba.Log.debug(`GAS-Gmail|get_latest_date_and_valid_messages_from_message_array| 5`)
          accumulator[0].push(msgdaterawdata)
          // accumulator[0][1].push(rawcontent)
        }

        if( date !== null && (YKLiba.isNullOrWhitespace(accumulator[1]) || YKLiba.Utils.isAfterDate(accumulator[1], date)) ){
          // YKLiba.Log.debug(`GAS-Gmail|get_latest_date_and_valid_messages_from_message_array| date=${date} 6`)
          accumulator[1] = date
        }
        return accumulator
      }, [[], new_last_date] )

    // YKLiba.Log.debug(`get_latest_date_and_valid_messages_from_message_array msgs.length=${msgs.length}`)
    // YKLiba.Log.debug(`result=${ JSON.stringify(result).slice(0, 100) }`)
    return result
  }
}
