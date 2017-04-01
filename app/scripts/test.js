$(function() {
  $.post(requestUrl, {
    route: 'wechat/wechat/test',
    token: null,
    jsonText: null
  }, function(data) {
    console.log(data);
  });
});
