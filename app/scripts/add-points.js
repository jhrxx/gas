$(function() {

  var $loading = $('#loadingToast');
  // storage data
  // var stationInfo = localStorage.getItem('stationInfo');
  // var stationid = sessionStorage.getItem('stationid');
  var openid = localStorage.getItem('openid');

  // var getSocreState = function() {
  //   $.post('/zsh/app_interface/index.php', {
  //     route: 'wechat/wechat/getSocreState',
  //     token: null,
  //     jsonText: JSON.stringify({
  //       "openid": openid
  //     })
  //   }, function(resp) {

  //     $loading.fadeOut();
  //     resp = JSON.parse(resp)
  //     if (resp.status.succeed === '1') {
  //       $('#score_state').text(resp.data.score_state)
  //       $('#msgDialog').fadeIn(200);
  //       // alert("积分添加成功， 当前分数： "+ );
  //     }
  //   });
  // };


  var bindClickFn = function(id) {
    $('#add_points').click(function() {
      $loading.fadeIn();

      $.post('/zsh/app_interface/index.php', {
        route: 'wechat/wechat/socrePush',
        token: null,
        jsonText: JSON.stringify({
          'openid': openid,
          'app_type': 'huafeng',
          'station_id': id
        })
      }, function(resp) {
        $loading.fadeOut();
        resp = JSON.parse(resp);
        if (resp.status.succeed === '1') {
          $('#msgDialog').fadeIn(200);
          // getSocreState();
        } else {
          console.error('请求失败');
          $loading.fadeOut();
        }
      });

      return false;
    });
  };

  var onGetStationByLocation = function(resp) {
    resp = JSON.parse(resp);
    if (resp.status.succeed === '1') {
      // storage data
      // localStorage.setItem('stationInfo', JSON.stringify(resp));

      // resp.data
      if (resp.data.stations) {
        $('#invoice').removeClass('hide');
        bindClickFn(resp.data.stations[0].station_id);
        $('#station_name').text(resp.data.stations[0].station_name);
      } else {
        bindClickFn(resp.data.station_id);
        $('#station_name').text(resp.data.station_name);
      }
    } else {
      // $('#errorMsg').removeClass('hide');
      // $('#loadingToast').fadeOut();
    }
  };

  var getStationByLocation = function(longitude, latitude) {
    $.post('/zsh/app_interface/index.php', {
      route: 'wechat/wechat/wechat_getstation',
      token: null,
      jsonText: JSON.stringify({
        lon: longitude,
        lat: latitude
      })
    }, onGetStationByLocation);
  };

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

  // if(stationid) {
  //   bindClickFn(stationid);
  // } else if(stationInfo) {
  //    var stations = JSON.parse(stationInfo).data;
  //    if (stations.stations) {
  //     $('#invoice').removeClass('hide');
  //     bindClickFn(stations.stations[0].station_id);
  //     $('#station_name').text(stations.stations[0].station_name);
  //   } else {
  //     bindClickFn(stations.station_id);
  //     $('#station_name').text(stations.station_name);
  //   }
  // } else {
  //   alert('没有加油站信息')
  // }

  //   var stations = stationInfo.data.stations

  //   var station = $.isArray(stations) ? stations[0]: stations;
  // // console.log(station);
  //   $('#station_name').text(station.station_name);

  $loading.fadeOut();

  $('#msgDialog').on('click', '.weui-dialog__btn', function() {
    $(this).parents('.js_dialog').fadeOut(200);
  });
});
