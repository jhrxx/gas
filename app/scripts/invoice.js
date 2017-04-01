var resp;
// var data = {"status":{"succeed":"1"},"data":{"invoice_id":"2","invoice_name":"西安汤谷","tax_id":"11111223116","address":"西安市胡家庙长缨路","phone":"17888877","bankname":"西安汤谷信息科技有限公司","bankcode":"62228888333288"}};
// resp = '{"status":{"succeed":"1"},"data":[{"invoice_id":"1","invoice_name":"西安汤谷","tax_id":"11111223116","address":"西安市胡家庙长缨路","phone":"17888877","bankname":"西安汤谷信息科技有限公司","bankcode":"62228888333288"},{"invoice_id":"2","invoice_name":"西安汤谷","tax_id":"11111223116","address":"西安市胡家庙长缨路","phone":"17888877","bankname":"西安汤谷信息科技有限公司","bankcode":"62228888333288"},{"invoice_id":"3","invoice_name":"西安汤谷","tax_id":"11111223116","address":"西安市胡家庙长缨路","phone":"17888877","bankname":"西安汤谷信息科技有限公司","bankcode":"62228888333288"}]}';
// resp = '{"status":{"succeed":"0","error_code":"2032","error_desc":"\u65e0\u6570\u636e"}}';
$(function() {
  var bindEvent = function(data) {
    $('input.weui-check').change(function() {
      var id = $('input:checked').val();
      sessionStorage.setItem('invoiceid', id);
      sessionStorage.setItem('invoicename', data[id].invoice_name);
      location.href = 'payment.html';
      setTimeout(function() {
        history.go(-1);
      }, 500);

      return false;
    });
  };

  var buidPage = function(data) {
    var timestamp = (new Date()).valueOf();
    var html = '<div class="weui-cells weui-cells_radio">';
    html += '<label class="weui-cell weui-cell_access weui-check__label" for="invoice_' + data.invoice_id + '">';
    html += '<div class="weui-cell__bd">';
    html += '<input type="radio" class="weui-check" name="invoice' + timestamp + '" id="invoice_' + data.invoice_id + '" value="' + data.invoice_id + '">';
    html += '<span class="weui-icon-checked"></span>' + data.invoice_name;
    html += '</div><a href="edit-invoice.html?id=' + data.invoice_id + '" class="weui-cell__ft"></a>';
    html += '</label>';
    html += '</div>';
    return html;
  };

  var onGetInvoiceList = function(data) {
    data = JSON.parse(data);
    console.log(data);
    var obj = {};
    if (data.data && data.status && data.status.succeed) {
      // storage data
      localStorage.setItem('invoiceList', JSON.stringify(data.data));
      if (data.data.length) {
        // 多条数据
        var html = '';
        for (var i = 0; i < data.data.length; i++) {
          obj[data.data[i].invoice_id] = data.data[i];
          html += buidPage(data.data[i]);
        }
        $('section .page').html(html);
      }

      bindEvent(obj);

      $('#loadingToast').fadeOut();
    } else {
      $('#loadingToast').fadeOut(function() {
        $('#errorMsg').removeClass('hide');
      });
    }

    $(document.body).children('section').removeClass('hide');

  };

  if (typeof resp === 'undefined') {
    $.post(requestUrl, {
      route: 'wechat/wechat/wechat_getinvoice',
      token: null,
      jsonText: JSON.stringify({ openid: localStorage.getItem('openid') })
    }, onGetInvoiceList);
  } else {
    onGetInvoiceList(resp);
  }

});
