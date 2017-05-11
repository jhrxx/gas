var resp;
// resp = '{"status":{"succeed":"1"},"data":{"validate":"0debae7247fc933fcbd3007396998ad3","status":"0","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪"}}';

$(function() {
  var query = getUrlQueryObj();

  var renderQRCode = function(validate, name, score) {
    $('#name').text(name);
    $('#score').text(score);

    var qrcodeContaniner = document.getElementById('qrcode');
    var qrcode = new QRCode(qrcodeContaniner, {
      text: validate,
      width: qrcodeContaniner.clientWidth,
      height: qrcodeContaniner.clientWidth,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    console.log(qrcode);
  };

  var onGetExchangeInfo = function(data) {
    $('#loadingToast').addClass('hide');
    data = JSON.parse(data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        // console.log('onGetExchangeInfo: ', data.data);
        renderQRCode(data.data.validate, data.data.product_name, data.data.score_change);

      } else if (data.status.succeed === '0') {
        console.error(data.status.error_code + data.status.error_desc);
      }
    }
  };

  var getExchangeInfo = function() {
    if (typeof resp === 'undefined') {
      $.post(requestUrl, {
        route: 'wechat/wechat/get_exchange_qr',
        token: null,
        jsonText: JSON.stringify({
          'exchange_id': query.exchange_id
        })
      }, onGetExchangeInfo);
    } else {
      onGetExchangeInfo(resp);
    }
  };

  if(query.exchange_id) {
    if (query.validate) {
      $('#loadingToast').addClass('hide');
      renderQRCode(query.validate, query.product_name, query.score_change);
    } else {
      getExchangeInfo();
    }
  }
});
