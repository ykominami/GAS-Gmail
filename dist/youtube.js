
function execute_Test_youtube_x(){
  execute_Test_youtube()
}
/**
 * Searches for videos about dogs, then logs the video IDs and title.
 * Note that this sample limits the results to 25. To return more
 * results, pass additional parameters as shown in the YouTube Data API docs.
 * @see https://developers.google.com/youtube/v3/docs/search/list
 */
function searchByKeyword(keyword, limit = 25) {
  try {
    const results = YouTube.Search.list('id,snippet', {
      q: keyword,
      maxResults: limit
    });
    if (results === null) {
      console.log('Unable to search videos');
      return false;
    }
    results.items.forEach((item)=> {
      console.log('[%s] Title: %s', item.id.videoId, item.snippet.title);
    });
  } catch (err) {
    // TODO (developer) - Handle exceptions from Youtube API
    console.log('Failed with an error %s', err.message);
      return false;
  }
  return true;
}