$(function() {
  var query = getUrlQueryObj();

  if (query.validate && query.exchange_id) {
    $('#name').text(query.product_name);
    $('#score').text(query.score_change);
    $('#name').text(query.product_name);
    var qrcodeContaniner = document.getElementById('qrcode');
    var qrcode = new QRCode(qrcodeContaniner, {
      text: query.validate,
      width: qrcodeContaniner.clientWidth,
      height: qrcodeContaniner.clientWidth,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    console.log(qrcode);
  }

  $('#loadingToast').addClass('hide');
});
