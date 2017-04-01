var resp;
// with phone number
// resp = '{"status":{"succeed":"1"},"data":{"mobile":{"mobile":"17791609771","nick_name":"Sunnicholas🐈","headimgurl":"http://wx.qlogo.cn/mmopen/p1NSibOToBjtrHJdQJDpFcpukdYiawZGBQrpKzfib3NIRGbWY5rvurxMusxqCJ9aXP60ldGOf3kEOQfzhwufxjlQxDFDswewj9D/0","score":"1445"}}}';
// without phone number
// resp = '{"status":{"succeed":"1"},"data":{"mobile":{"mobile":"0","nick_name":"Sunnicholas🐈","headimgurl":"http://wx.qlogo.cn/mmopen/p1NSibOToBjtrHJdQJDpFcpukdYiawZGBQrpKzfib3NIRGbWY5rvurxMusxqCJ9aXP60ldGOf3kEOQfzhwufxjlQxDFDswewj9D/0","score":"1445"}}}';


$(function() {
  var openId;
  var unionId;
  openId = localStorage.openid;
  if (openId) {
    unionId = localStorage.getItem('unionid_' + openId);
  }

  var bindUserInfo = function(user) {
    if (user) {
      console.log('user: ', user);
      $('#nickname').text(user.nick_name);
      $('#avatar').css('background-image', 'url(' + user.headimgurl + ')');
      $('#score').text(user.score ? user.score : 0);
      if (user.mobile !== '0') {
        $('#bind').removeAttr('href').addClass('binded').text('已绑定');
        $('#mobile').text(user.mobile);
      }
    }
  };

  var onGetUserInfo = function(data) {
    data = JSON.parse(data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        bindUserInfo(data.data.mobile);
      }
    }

    $('#loadingToast').addClass('hide');
  };

  if (typeof resp === 'undefined') {
    if (openId && unionId) {
      $.post(requestUrl, {
        route: 'wechat/wechat/wx_member_check',
        token: null,
        jsonText: JSON.stringify({
          'openid': openId,
          'unionid': unionId
        })
      }, onGetUserInfo);
    } else {
      console.error('miss openId or unionId');
    }
  } else {
    onGetUserInfo(resp);
  }
});
