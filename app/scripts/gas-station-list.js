var resp;
// resp = {"status":{"succeed":"1"},"data":{"station_id":"29001","station_name":"华峰石油加油站","address":"渭滨路","latitude_num":"34.316672","longitude_num":"108.972001","is_cooperate":"1","discount":"0.90","oilguns":{"0":["1"],"92":["2","3","4"],"95":["1","2"]},"car_number":""}};

$(function() {
  var currentId;
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
    // console.log(station);
    var html = '<div class="weui-panel" data-id="' + station.station_id + '">';
    html += '<div class="weui-panel__bd">' +
      '<div class="weui-media-box weui-media-box_text">' +
      '<h4 class="weui-media-box__title">' + station.station_name + '</h4>' +
      '<p class="weui-media-box__desc">' + station.address + '</p>' +
      '<ul class="weui-media-box__info">' +
      '<li class="weui-media-box__info__meta"></li>' +
      '<li class="weui-media-box__info__meta weui-media-box__info__meta_extra"></li>' +
      '<li class="weui-media-box__info__meta weui-media-box__info__meta_extra"></li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>';
    return html;
  };

  var onGetStations = function(data) {
    // console.log(data);
    if (data.data && data.status && data.status.succeed) {
      var stations = data.data;
      if (stations.length) {
        // stations
      } else {
        $('section').html(buidPage(stations));
      }

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
    $.ajax('station/station/wechat_selectstation', onGetStations);
  } else {
    onGetStations(resp);
  }
});
