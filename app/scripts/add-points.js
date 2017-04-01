var station;
// only one gas station
// station = '{"status":{"succeed":"1"},"data":{"station_id":"29001","station_name":"\u534e\u5cf0\u77f3\u6cb9\u52a0\u6cb9\u7ad9","company_id":"5","address":"\u6e2d\u6ee8\u8def","latitude_num":"34.316672","longitude_num":"108.972001","is_cooperate":"1","juli":"0.00009261156424765427","discount":"0.90","oilguns":{"0":{"gas":"92","price":"5.60","gun_number":["1","2","4"]},"2":{"gun_number":["2","3","4"],"gas":"0","price":"4.89"},"1":{"gas":"95","price":"6.32","gun_number":["1","2","4"]}},"car_number":""}}';

// multiple gas stations
// station = '{ "status": { "succeed": "1" }, "data": { "stations": [{ "station_id": "6002", "station_name": "铁建测试加油站B", "company_id": "8", "address": "铁建", "latitude_num": "34.347", "longitude_num": "108.95127", "is_cooperate": "1", "juli": "0" }, { "station_id": "6001", "station_name": "高科尚都加油站", "company_id": "8", "address": "高科尚都", "latitude_num": "34.346251", "longitude_num": "108.95128", "is_cooperate": "1", "juli": "0.08338343999812287" }] } }';

// none station
// station = '{ "status": { "succeed": "0", "error_code": "2032", "error_desc": "无数据" } }';


$(function() {
  var $loading = $('#loadingToast');
  var $msg = $('#msgDialog');
  var openId;
  var unionId;
  openId = localStorage.openid;
  if (openId) {
    unionId = localStorage.getItem('unionid_' + openId);
  }

  var bindClickFn = function(id) {
    $('#add_points_btn').click(function() {
      $loading.fadeIn();

      $.post(requestUrl, {
        route: 'wechat/wechat/socre_push',
        token: null,
        jsonText: JSON.stringify({
          'unionid:': unionId,
          'station_id': id
        })
      }, function(resp) {
        $loading.fadeOut();
        resp = JSON.parse(resp);
        if (resp.status.succeed === '1') {
          $('#msg', $msg).text('线下添加积分成功');
        } else {
          $('#msg', $msg).text('线下添加积分失败');
        }
        $msg.fadeIn();

      });

      return false;
    });

    $msg.on('click', '.weui-dialog__btn', function() {
      $(this).parents('.js_dialog').fadeOut(200);

      return false;
    });
  };

  var onGetStationByLocation = function(resp) {
    resp = JSON.parse(resp);
    if (resp.status.succeed === '1') {
      if (resp.data.stations) {
        bindClickFn(resp.data.stations[0].station_id);
        $('#station_name').text(resp.data.stations[0].station_name);
      } else {
        bindClickFn(resp.data.station_id);
        $('#station_name').text(resp.data.station_name);
      }

      $loading.fadeOut();
      $('.page').removeClass('hide');
    }
  };

  var getStationByLocation = function(longitude, latitude) {
    var location = {
      lon: longitude,
      lat: latitude
    };

    $.post(requestUrl, {
      route: 'wechat/wechat/wechat_getstation',
      token: null,
      jsonText: JSON.stringify(location)
    }, onGetStationByLocation);
  };

  if (typeof station === 'undefined') {
    wx.ready(function() {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: function(res) {
          var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed; // 速度，以米/每秒计
          // var accuracy = res.accuracy; // 位置精度

          getStationByLocation(longitude, latitude);
        }
      });
    });
  } else {
    // for testing
    onGetStationByLocation(station);
  }
});
