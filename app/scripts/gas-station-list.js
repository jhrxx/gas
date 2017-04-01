var resp;
// resp = '{"status":{"succeed":"1"},"data":{"stations":[{"station_id":"214","station_name":"\u897f\u5b89\u5357\u7247\u533a\u897f\u5f71\u8def\u52a0\u6cb9\u7ad9","company_id":"2","address":"\u897f\u5b89\u5e02\u897f\u5f71\u8def\u94c1\u7089\u5e99\u6751","latitude_num":"34.236141","longitude_num":"108.998070","is_cooperate":"1","juli":"0.00003164494810592506"},{"station_id":"63","station_name":"\u897f\u5f71\u8def\uff08\u4e07\u91cc\u4e50\uff09\u52a0\u6cb9\u7ad9","company_id":"1","address":"\u897f\u5f71\u8def40\u53f7\u9644\u8fd1","latitude_num":"34.239220","longitude_num":"109.008141","is_cooperate":"1","juli":"0.9940286645736278"},{"station_id":"352","station_name":"\u897f\u5b89\u66f2\u6c5f\u96c1\u7fd4\u8def\u52a0\u6cb9\u7ad9","company_id":"3","address":"\u897f\u5b89\u5e02\u66f2\u6c5f\u65b0\u533a\u96c1\u7fd4\u8def\u8def\u897f","latitude_num":"34.220642","longitude_num":"109.011086","is_cooperate":"1","juli":"2.105085209998911"},{"station_id":"215","station_name":"\u897f\u5b89\u5357\u7247\u533a\u96c1\u7fd4\u8def\u52a0\u6cb9\u7ad9","company_id":"2","address":"\u66f2\u6c5f\u65b0\u533a\u96c1\u7fd4\u8def\u4e2d\u6bb5","latitude_num":"34.220703","longitude_num":"109.013466","is_cooperate":"1","juli":"2.2335395532875655"}]}}';

$(function() {
  var currentId;
  var openId;
  var unionId;

  var init = function() {
    if (!openId || !unionId) {
      openId = localStorage.openid;
      if (openId) {
        unionId = localStorage.getItem('unionid_' + openId);
      }
    }
  };

  init();

  var $dialog = $('#confirmLocationDialog');
  $('#confirmLocationDialog').on('click', '.weui-dialog__btn', function() {
    $(this).parents('.js_dialog').fadeOut(200);
  });

  $('#closeDialog').on('click', function() {
    $dialog.fadeIn(200);
  });

  $('#confirmLocation').on('click', function() {
    // $dialog.fadeIn(200);
    location.href = 'payment.html?id=' + currentId;
  });


  var buidPage = function(station) {
    console.log('buid station Page: ', station);
    var html = '';
    for (var i = 0; i < station.length; i++) {
      html += '<div class="weui-panel" data-id="' + station[i].station_id + '">';
      html += '<div class="weui-panel__bd">' +
        '<div class="weui-media-box weui-media-box_text">' +
        '<h4 class="weui-media-box__title">' + station[i].station_name + '</h4>' +
        '<p class="weui-media-box__desc">' + station[i].address + '</p>' +
        '<ul class="weui-media-box__info">' +
        '<li class="weui-media-box__info__meta"></li>' +
        '<li class="weui-media-box__info__meta weui-media-box__info__meta_extra"></li>' +
        '<li class="weui-media-box__info__meta weui-media-box__info__meta_extra"></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>';
    }
    return html;
  };

  var onGetStations = function(data) {
    console.log(data);
    if (data.data && data.status && data.status.succeed === '1') {
      var stations = data.data.stations;
      // if (stations.length) {
      //   // stations
      // } else {
      $('section').html(buidPage(stations));
      // }

      $('.weui-panel').click(function() {
        $dialog.fadeIn(200);
        currentId = $(this).data('id');
        console.log(currentId);

        return false;
      });


      $(document.body).children('section').removeClass('hide');

      $('#loadingToast').fadeOut();
    } else {
      $('#loadingToast').fadeOut(function() {
        $('#errorMsg').removeClass('hide');
      });
    }
  };

  if (typeof resp === 'undefined') {
    var info = localStorage.getItem('stationInfo');
    if (info) {
      info = JSON.parse(info);
      onGetStations(info);
    }
  } else {
    onGetStations(JSON.parse(resp));
  }
});
