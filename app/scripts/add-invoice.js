$(function() {
  var $addBtn = $('#add_invoice_btn');
  $('#loadingToast').fadeOut();
  $('section').removeClass('hide');
  // $('#add_invoice_btn').prop('disabled', 1);

  // $('#add_points').click(function() {
  //  $('#msgDialog').fadeIn(200);
  //  return false;
  // });

  $('#hintDialog').on('click', '.weui-dialog__btn', function() {
    $(this).parents('.js_dialog').fadeOut(200);
  });

  var onCreated = function(data) {
    $addBtn.prop('disabled', 0);
    // {"status":{"succeed":"1"},"data":{"latsid":2}}
    data = JSON.parse(data);
    console.log(data);
    if (data && data.status && data.status.succeed === '1') {
      location.href = 'invoice.html';
    } else {
      $('#hint').text('Error: ' + data.status.error_desc + '(' + data.status.error_code + ')');
      $('#hintDialog').fadeIn(200);
    }
  };

  var create = function(data) {
    $.post(requestUrl, {
      route: 'wechat/wechat/wechat_invoice',
      token: null,
      jsonText: JSON.stringify(data)
    }, onCreated);
  };

  var checkInput = function() {
    var name = $('#invoice_name').val();
    var address = $('#address').val();
    var phone = $('#phone').val();
    var bankname = $('#bankname').val();
    var bankcode = $('#bankcode').val();
    var tax = $('#tax_id').val();
    if (name && address && phone && bankname && bankcode && tax) {
      var openId = localStorage.getItem('openid');
      var data = {
        'openid': openId,
        'operator_type': '1',
        'invoice_name': name,
        'tax_id': tax,
        'address': address,
        'phone': phone,
        'bankname': bankname,
        'bankcode': bankcode
      };
      create(data);
    } else {
      // alert('请填写字段');
      $addBtn.prop('disabled', 0);
    }
  };

  $addBtn.click(function() {
    // onCreated('{"status":{"succeed":"0","error_code":"3001","error_desc":"\u975e\u6cd5\u7528\u6237\u53c2\u6570"}}')

    $addBtn.prop('disabled', 1);
    checkInput();

    return false;
  });
});
