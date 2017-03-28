$(function() {
  $.post('/zsh/app_interface/index.php', {
    route: 'wechat/wechat/test',
    token: null,
    jsonText: null
  }, function(data) {
    console.log(data);
  });
});
