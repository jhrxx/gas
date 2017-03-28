// init wechat
var jsapi, userInfo;
// jsapi = '{"status":{"succeed":"1"},"data":{"appId":"wxb792c3df8d65ffde","nonceStr":"dBocz4eoBrTlowZO","timestamp":1490280615,"url":"http:\/\/www.xauto123.com\/vchat\/center.html","signature":"94d0114b92d5ecf4055063a07722cb01739b2fec","rawString":"jsapi_ticket=kgt8ON7yVITDhtdwci0qeXP67BnOBsMZnRb7Y9aBBg3u9ts6ze4rZXZNxtr1wHVZpW75ZXkTWol0-DpzE8nBoQ&noncestr=dBocz4eoBrTlowZO&timestamp=1490280615&url=http:\/\/www.xauto123.com\/vchat\/center.html","codeurl":null,"openid":null}}';
// jsapi = '{"status":{"succeed":"1"},"data":{"appId":"wxb792c3df8d65ffde","nonceStr":"4ohlrxjI2AZ8DseB","timestamp":1477228577,"url":"http://139.129.19.236/zsh/app_interface/index.php","signature":"d34cab964c1a69591dab41010716dc3da4af975a","rawString":"jsapi_ticket=kgt8ON7yVITDhtdwci0qeXP67BnOBsMZnRb7Y9aBBg1yRqooz-E8cLWrEiXGQkuSBpNPdHgkVSXEHKoEabTAIQ&noncestr=4ohlrxjI2AZ8DseB&timestamp=1477228577&url=http://139.129.19.236/zsh/app_interface/index.php"}}';
// userInfo = '{"status":{"succeed":"1"},"data":{"userinfo":{"wx_member_info_id":"9","app_type":"huafeng","openid":"oaGBzwRBUkX1eS86SFTiVWnvu5Fs","nick_name":"53756E6E6963686F6C6173F09F9088","headimgurl":"http://wx.qlogo.cn/mmopen/pS2ZrvTUQNncnBhfAM7nvAJlhz5wFSsbG1TyM7rq2YJVgTXRGyuJMm33A49tfb4Awo6XFt5H0qOJibLUkyZotLCljaSO6UwbU/0","unionid":"o66vdw-LeYCGTeghBUcpSCVf8WrE","lon":null,"lat":null,"member_id":"0","score":null,"score_state":"1"}}}';

$(function() {
  var query = getUrlQueryObj();
  var code;
  if (query && query.code) {
    code = query.code;
  } else if (localStorage.getItem('openid')) {
    code = localStorage.getItem('openid');
  }

  var onGetWechatUserInfo = function(resp) {
    var user;
    // console.log('onGetWechatUserInfo: ', resp);
    resp = JSON.parse(resp);
    if (resp.data && resp.status && resp.status.succeed === '1') {
      user = resp.data.userinfo;
      // console.log('User: ', user);
      if (!$.isEmptyObject(localStorage.userInfo)) {
        // storage data
        localStorage.setItem('userInfo', JSON.stringify(user));

        localStorage.setItem('unionid_' + code, user.union_id);
      }
    }
  };

  var getWechatUserInfoByOpenId = function(id) {
    // console.log('getWechatUserInfoByOpenId: ', id);
    if (id) {
      if (typeof userInfo === 'undefined') {
        $.post('/zsh/app_interface/index.php', {
          route: 'wechat/wechat/get_wx_user',
          token: null,
          jsonText: JSON.stringify({ 'openid': id })
        }, onGetWechatUserInfo);
      } else {
        onGetWechatUserInfo(userInfo);
      }
    }
  };

  var initWechat = function(resp) {
    if (wx) {
      wx.ready(function() {
        console.log('wx.ready');
      });

      wx.error(function(res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.error('信息验证失败:' + JSON.stringify(res));
      });

      // alert('config: '+ JSON.stringify({
      //   // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      //   appId: data.data.appId, // 必填，公众号的唯一标识
      //   timestamp: data.data.timestamp, // 必填，生成签名的时间戳
      //   nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
      //   signature: data.data.signature,// 必填，签名，见附录1
      //   jsApiList: ['getLocation','chooseWXPay' ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      // }));
      wx.config({
        // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: resp.data.appId, // 必填，公众号的唯一标识
        timestamp: resp.data.timestamp, // 必填，生成签名的时间戳
        nonceStr: resp.data.nonceStr, // 必填，生成签名的随机串
        signature: resp.data.signature, // 必填，签名，见附录1
        jsApiList: ['getLocation', 'chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    } else {
      console.error('ERROR: wx is not def');
    }
  };

  var callback = function(resp) {
    resp = JSON.parse(resp);

    if (resp && resp.data) {
      jsapi = resp.data;
      // save openid
      if (jsapi.openid) {
        localStorage.setItem('openid', jsapi.openid);
      }

      if (jsapi.codeurl) {
        location.href = jsapi.codeurl;
      } else if (jsapi.signature) {
        getWechatUserInfoByOpenId(code);
        initWechat(resp);
      }
    } else {
      console.error('ERROR: get signature failed');
    }
  };

  if (typeof jsapi === 'undefined') {
    var jsonText = { url: location.href };
    if (code) {
      jsonText.code = code;
    }

    $.post('/zsh/app_interface/index.php', {
      route: 'wechat/wechat/get_signature',
      token: null,
      jsonText: JSON.stringify(jsonText)
    }, callback);
  } else {
    callback(jsapi);
  }
});
