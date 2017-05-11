var resp, station;
// product list
// resp = '{"status":{"succeed":"1"},"data":{"list":[{"score_product_id":"57","product_name":"键盘","product_score":"1","product_money":"1.00","product_img_url":"http://oler84hko.bkt.clouddn.com/commodity20170217143822.jpg","product_number":"0"},{"score_product_id":"58","product_name":"杯子","product_score":"12","product_money":"13.00","product_img_url":"http://oler84hko.bkt.clouddn.com/commodity20170223130627.jpg","product_number":"7"},{"score_product_id":"61","product_name":"电话","product_score":"111","product_money":"1.00","product_img_url":"http://oler84hko.bkt.clouddn.com/commodity20170223132352.jpg","product_number":"123"}]}}';

// empty data
// resp = '{"status":{"succeed":"1"},"data":{"list":[]}}';


// only one gas station
// station = '{"status":{"succeed":"1"},"data":{"station_id":"29001","station_name":"\u534e\u5cf0\u77f3\u6cb9\u52a0\u6cb9\u7ad9","company_id":"5","address":"\u6e2d\u6ee8\u8def","latitude_num":"34.316672","longitude_num":"108.972001","is_cooperate":"1","juli":"0.00009261156424765427","discount":"0.90","oilguns":{"0":{"gas":"92","price":"5.60","gun_number":["1","2","4"]},"2":{"gun_number":["2","3","4"],"gas":"0","price":"4.89"},"1":{"gas":"95","price":"6.32","gun_number":["1","2","4"]}},"car_number":""}}';

// multiple gas stations
// station = '{ "status": { "succeed": "1" }, "data": { "stations": [{ "station_id": "6002", "station_name": "铁建测试加油站B", "company_id": "8", "address": "铁建", "latitude_num": "34.347", "longitude_num": "108.95127", "is_cooperate": "1", "juli": "0" }, { "station_id": "6001", "station_name": "高科尚都加油站", "company_id": "8", "address": "高科尚都", "latitude_num": "34.346251", "longitude_num": "108.95128", "is_cooperate": "1", "juli": "0.08338343999812287" }] } }';

// none station
// station = '{ "status": { "succeed": "0", "error_code": "2032", "error_desc": "无数据" } }';

$(function() {
  // var renderTitles = function(titles) {
  //   if (titles.length) {
  //     var html = '';
  //     for (var i = 0; i < titles.length; i++) {
  //       // console.log('title '+(i+1)+": ", titles[i])
  //       html += '<div class="weui-flex">';
  //       html += '<div class="weui-flex__item">';
  //       html += '<a title="' + titles[i].product_name + '" href="mall-item.html?id=' + titles[i].score_product_id + '"><img src="' + titles[i].product_img_url + '"></a>';
  //       html += '<span class="label" title="' + titles[i].product_info + '">商城推荐</span>';
  //       html += '</div>';
  //       html += '</div>';
  //     }

  //     $('#title_container').html(html);
  //   }
  // };


  var renderItems = function(items) {
    var len = items.length;
    var html = '';
    if (len % 2 !== 0) {
      items.length += 1;
      len = items.length;
    }
    for (var i = 0; i < len; i++) {
      if (i % 2 === 0) {
        html += '<div class="weui-flex">';
      }
      // if(i === items.length - 1) {
      // console.log('last item ' + (i + 1) + ": ", items[i])
      // } else {
      // console.log('item ' + (i + 1) + ": ", items[i])
      // }

      html += '<div class="weui-flex__item">';
      if (items[i]) {

        html += '<a href="mall-item.html?id=' + items[i].score_product_id + '">';
        html += '<img src="' + items[i].product_img_url + '">';
        html += '<h3>' + items[i].product_name + '</h3>';
        html += '<h4>兑换积分 ' + items[i].product_score + '分</h4>';
        // html += '<p>兑换地点</p>';
        html += '<p>库存' + items[i].product_number + '</p>';
        html += '</a>';
      }
      html += '</div>';

      if (i % 2 === 1) {
        html += '</div>';
      }
    }

    $('#item_container').html(html);
  };

  var renderEmptyInfo = function() {
    var html = '<div class="weui-flex"><div class="weui-flex__item empty-hint"><i class="sign-forbidden"></i><p>暂无商品</p></div><div class="weui-flex__item"></div><div>';
    $('#item_container').html(html);
  };


  var getProductListByStationId = function(id) {
    // id = 3;
    if (typeof resp === 'undefined') {
      $.post(requestUrl, {
        route: 'wechat/wechat/get_product_list',
        token: null,
        jsonText: JSON.stringify({ 'station_id': id })
      }, onGetItemList);
    } else {
      onGetItemList(resp);
    }
  };

  var onGetItemList = function(data) {
    data = JSON.parse(data);
    // console.log(data);
    if (data.status.succeed === '1') {
      if (data.data && data.data.list && data.data.list.length > 0) {
        // renderTitles(data.data.titles);
        renderItems(data.data.list);
      } else {
        renderEmptyInfo();
      }
    }
  };

  var onGetStationByLocation = function(data) {
    data = JSON.parse(data);
    if (data.status.succeed === '1') {
      var stationInfo;
      if (data.data.stations) {
        stationInfo = data.data.stations[0];
      } else {
        stationInfo = data.data;
      }
      $('#title').text(stationInfo.station_name);

      // storage data
      localStorage.setItem('stationInfo', JSON.stringify(stationInfo));

      getProductListByStationId(stationInfo.station_id);
    } else {
      $('#title').text('附近无加油站');
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
