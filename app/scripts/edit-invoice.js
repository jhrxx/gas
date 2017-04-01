$(function() {
  var errorHintTimer;
  var $error = $('#errorToast');
  $('#loadingToast').fadeOut();
  $('section').removeClass('hide');
  var $deleteBtn = $('#delete_invoice_btn');
  var $editBtn = $('#edit_invoice_btn');

  var query = getUrlQueryObj();

  var getInvoiceInfoById = function(id) {
    var onGetInvoiceInfo = function(resp) {
      resp = JSON.parse(resp);
      // console.log(resp);
      if (resp && resp.status.succeed === '1') {
        var invoice = resp.data;
        var $name = $('#invoice_name');
        var $address = $('#address');
        var $phone = $('#phone');
        var $bankname = $('#bankname');
        var $bankcode = $('#bankcode');
        var $tax = $('#tax_id');
        $name.val(invoice.invoice_name);
        $address.val(invoice.address);
        $phone.val(invoice.phone);
        $bankname.val(invoice.bankname);
        $bankcode.val(invoice.bankcode);
        $tax.val(invoice.tax_id);
      }
    };

    $.post(requestUrl, {
      route: 'wechat/wechat/wechat_getinvoiceinfo',
      token: null,
      jsonText: JSON.stringify({
        'invoice_id': id
      })
    }, onGetInvoiceInfo);
  };

  if (query.id) {
    getInvoiceInfoById(query.id);
  } else {
    location.href = 'invoice.html';
  }

  $deleteBtn.click(function() {
    $.post(requestUrl, {
      route: 'wechat/wechat/wechat_invoice',
      token: null,
      jsonText: JSON.stringify({
        'invoice_id': query.id,
        'operator_type': '3'
      })
    }, function(data) {
      data = JSON.parse(data);
      console.log(data);
      if (data && data.status && data.status.succeed === '1') {
        location.href = 'invoice.html';
      } else {
        $('#hint').text('Error: ' + data.status.error_desc + '(' + data.status.error_code + ')');
        $('#hintDialog').fadeIn(200);
      }
      // location.href='invoice.html';
    });

    return false;
  });

  var onEditd = function(data) {
    $editBtn.prop('disabled', 0);
    // {'status':{'succeed':'1'},'data':{'latsid':2}}
    data = JSON.parse(data);
    // console.log(data);
    if (data && data.status && data.status.succeed === '1') {
      location.href = 'invoice.html';
    }
  };

  var edit = function(data) {
    $.post(requestUrl, {
      route: 'wechat/wechat/wechat_invoice',
      token: null,
      jsonText: JSON.stringify(data)
    }, onEditd);
  };

  var showErrorHint = function() {
    if (errorHintTimer) {
      clearTimeout(errorHintTimer);
    }
    $error.removeClass('hide');
    errorHintTimer = setTimeout(function() {
      $error.addClass('hide');
    }, 3000);
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
        'invoice_id': query.id,
        'operator_type': '2',
        'invoice_name': name,
        'tax_id': tax,
        'address': address,
        'phone': phone,
        'bankname': bankname,
        'bankcode': bankcode
      };
      edit(data);
    } else {
      showErrorHint('请填写字段');

      $editBtn.prop('disabled', 0);
    }
  };

  $editBtn.click(function() {
    checkInput();
    $(this).prop('disabled', 1);

    return false;

  });
});
