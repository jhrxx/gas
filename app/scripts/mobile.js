var resp, success;
// resp = '{"status":{"succeed":"1"},"data":{"xauto_code":"56F124D9C"}}';
// success = '{"status":{"succeed":"1"}}';

$(function() {
  var hintTimer;
  var blockTimer;
  var errorHintTimer;
  var maxTime = 0;
  var $toast = $('#sendToast');
  var $error = $('#errorToast');
  var openId;
  var unionId;
  openId = localStorage.openid;
  if (openId) {
    unionId = localStorage.getItem('unionid_' + openId);
  }


  var isValidatePhoneNum = function(phoneNum) {
    return (phoneNum.match(/\d/g) || []).length === 11;
  };

  var isValidateCode = function(code) {
    return (code.match(/\d/g) || []).length === 6;
  };

  var showHint = function() {
    if (hintTimer) {
      clearTimeout(hintTimer);
    }
    $toast.removeClass('hide');
    hintTimer = setTimeout(function() {
      $toast.addClass('hide');
    }, 3000);
  };

  var showErrorHint = function(msg) {
    if (msg) {
      $('#error_hint').text(msg);
    } else {
      $('#error_hint').text('出错了, 请重试');
    }

    if (errorHintTimer) {
      clearTimeout(errorHintTimer);
    }

    $error.removeClass('hide');
    errorHintTimer = setTimeout(function() {
      $error.addClass('hide');
    }, 3000);
  };

  var showBlockHint = function() {
    if (maxTime === 0) {
      maxTime = 60;
      if (blockTimer) {
        clearInterval(blockTimer);
      }
      showHint();
      $('#resend button').text((maxTime) + 's');
      blockTimer = setInterval(function() {
        if (maxTime > 1) {
          $('#resend button').text((--maxTime) + 's');
        } else {
          maxTime = 0;
          $('#resend button').text('重发送验证码');
          clearInterval(blockTimer);
        }
      }, 1000);
    }
  };

  var onGetVerifyCode = function(data) {
    data = JSON.parse(data);
    // console.log('onGetVerifyCode: ', data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        showBlockHint();
      } else if (data.status.succeed === '0') {
        showErrorHint(data.status.error_desc);
      }
    }
  };

  var getVerifyCode = function(num) {
    if (typeof resp === 'undefined') {
      if (openId && unionId) {
        $.post(requestUrl, {
          route: 'wechat/wechat/getVerifyCode',
          token: null,
          jsonText: JSON.stringify({
            'unionid': unionId,
            'area_code': '86',
            'mobile': num
          })
        }, onGetVerifyCode);
      } else {
        console.error('miss openId or unionId');
      }
    } else {
      onGetVerifyCode(resp);
    }
  };

  var onBindSuccess = function(data) {
    data = JSON.parse(data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        window.location.href = 'center.html';
      } else {
        showErrorHint(data.status.error_desc);
      }
    }
  };

  $('#send').click(function() {
    var phoneNumber = $('#phone_number').val().trim();
    if (isValidatePhoneNum(phoneNumber)) {
      $(this).addClass('hide');
      $('#resend').removeClass('hide');
      getVerifyCode(phoneNumber);
    } else {
      showErrorHint('请输入正确的手机号码');
    }

    return false;
  });

  $('#resend').click(function() {
    var phoneNumber = $('#phone_number').val().trim();
    if (maxTime === 0 && isValidatePhoneNum(phoneNumber)) {
      getVerifyCode(phoneNumber);
    }

    if (!isValidatePhoneNum(phoneNumber)) {
      showErrorHint('请输入正确的手机号码');
    }

    return false;
  });

  $('#bind_mobile_btn').click(function() {
    if (typeof success === 'undefined') {
      if (openId && unionId) {
        var verifyCode = $('#verify_code').val().trim();
        var phoneNumber = $('#phone_number').val().trim();

        if (!isValidatePhoneNum(phoneNumber)) {
          showErrorHint('请输入正确的手机号码');
        }

        if (!isValidateCode(verifyCode)) {
          showErrorHint('请输入正确的验证码');
        }

        if (isValidateCode(verifyCode) && isValidatePhoneNum(phoneNumber)) {
          $.post(requestUrl, {
            route: 'wechat/wechat/wx_member_mobile',
            token: null,
            jsonText: JSON.stringify({
              'unionid': unionId,
              'mobile': phoneNumber,
              'verify_code': verifyCode
            })
          }, onBindSuccess);
        }
      } else {
        console.error('miss openId or unionId');
      }
    } else {
      onBindSuccess(success);
    }
    return false;
  });

});
