/**
 * 1970年1月1日のDateインスタンスを生成する
 *
 * @return {Date} 1970年1月1日のDateインスタンス
 */
function createEpochDate() {
  return new Date(0);
}

// 使用例
function myFunction() {
  const epochDate = createEpochDate();
  Logger.log(epochDate); // 出力例：Thu Jan 01 1970 09:00:00 GMT+0900
}