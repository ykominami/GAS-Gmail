
/**
 * YouTube APIのテスト実行関数
 * execute_Test_youtube関数を呼び出してテストを実行する
 */
function execute_Test_youtube_x(){
  execute_Test_youtube()
}

/**
 * YouTube Data APIを使用してキーワード検索を実行する
 * 指定されたキーワードで動画を検索し、結果をコンソールに出力する
 * @param {string} keyword - 検索キーワード
 * @param {number} limit - 取得する結果の最大数（デフォルト: 25）
 * @returns {boolean} 検索が成功した場合はtrue、失敗した場合はfalse
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
