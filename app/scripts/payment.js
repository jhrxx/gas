var resp;
// resp = '{"status":{"succeed":"1"},"data":{"stations":[{"station_id":"214","station_name":"\u897f\u5b89\u5357\u7247\u533a\u897f\u5f71\u8def\u52a0\u6cb9\u7ad9","company_id":"2","address":"\u897f\u5b89\u5e02\u897f\u5f71\u8def\u94c1\u7089\u5e99\u6751","latitude_num":"34.236141","longitude_num":"108.998070","is_cooperate":"1","juli":"0.00003164494810592506","oilguns":["1","2","3"],"discount":"0.01"},{"station_id":"63","station_name":"\u897f\u5f71\u8def\uff08\u4e07\u91cc\u4e50\uff09\u52a0\u6cb9\u7ad9","company_id":"1","address":"\u897f\u5f71\u8def40\u53f7\u9644\u8fd1","latitude_num":"34.239220","longitude_num":"109.008141","is_cooperate":"1","juli":"0.9940286645736278","oilguns":[],"discount":"0.95"},{"station_id":"352","station_name":"\u897f\u5b89\u66f2\u6c5f\u96c1\u7fd4\u8def\u52a0\u6cb9\u7ad9","company_id":"3","address":"\u897f\u5b89\u5e02\u66f2\u6c5f\u65b0\u533a\u96c1\u7fd4\u8def\u8def\u897f","latitude_num":"34.220642","longitude_num":"109.011086","is_cooperate":"1","juli":"2.105085209998911","oilguns":[],"discount":null},{"station_id":"215","station_name":"\u897f\u5b89\u5357\u7247\u533a\u96c1\u7fd4\u8def\u52a0\u6cb9\u7ad9","company_id":"2","address":"\u66f2\u6c5f\u65b0\u533a\u96c1\u7fd4\u8def\u4e2d\u6bb5","latitude_num":"34.220703","longitude_num":"109.013466","is_cooperate":"1","juli":"2.2335395532875655","oilguns":[],"discount":"0.01"}]}}';
// resp = '{"status":{"succeed":"1"},"data":{"station_id":"29001","station_name":"\u534e\u5cf0\u77f3\u6cb9\u52a0\u6cb9\u7ad9","company_id":"5","address":"\u6e2d\u6ee8\u8def","latitude_num":"34.316672","longitude_num":"108.972001","is_cooperate":"1","juli":"0.00009261156424765427","discount":"0.90","oilguns":{"0":{"gas":"92","price":"5.60","gun_number":["1","2","4"]},"2":{"gun_number":["2","3","4"],"gas":"0","price":"4.89"},"1":{"gas":"95","price":"6.32","gun_number":["1","2","4"]}},"car_number":""}}';
// resp = '{ "status": { "succeed": "1" }, "data": { "stations": [{ "station_id": "6002", "station_name": "铁建测试加油站B", "company_id": "8", "address": "铁建", "latitude_num": "34.347", "longitude_num": "108.95127", "is_cooperate": "1", "juli": "0" }, { "station_id": "6001", "station_name": "高科尚都加油站", "company_id": "8", "address": "高科尚都", "latitude_num": "34.346251", "longitude_num": "108.95128", "is_cooperate": "1", "juli": "0.08338343999812287" }] } }';
// resp = { "status": { "succeed": "0", "error_code": "2032", "error_desc": "无数据" } }

$(function() {
  var total;
  var stationId;
  var query = getUrlQueryObj();
  var $dialog = $('#feedbackDialog');
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

  var onGetStationByLocation = function(data) {
    data = JSON.parse(data);
    // console.log(data);
    if (data.status.succeed === '1') {
      //storage data
      localStorage.setItem('stationInfo', JSON.stringify(data));

      randerPage(data.data);
      bindEvents();
    } else {
      $('#errorMsg').removeClass('hide');
      $('#loadingToast').fadeOut();
    }
  };

  var getStationByLocation = function(longitude, latitude) {
    $.post(requestUrl, {
      route: 'wechat/wechat/wechat_getstation',
      token: null,
      jsonText: JSON.stringify({
        lon: longitude,
        lat: latitude
      })
    }, onGetStationByLocation);
  };

  var randerPage = function(data) {
    if (data) {
      // console.log(data);
      var $currentStationName = $('#current_station_name');
      var station = {};
      // $oilType = $('#oil_type').find('select'),
      var $oilGun = $('#oil_gun').find('select');
      // typesList = [];

      var setGunValue = function(type, index) {
        if (station && station.oilguns && station.oilguns.length) {
          console.log(station);
          $oilGun.html(function() {
            var html = '';
            var checked = 'checked';
            for (var i = 0; i < station.oilguns.length; i++) {
              html += '<option value="' + station.oilguns[i] + '" ';
              if (index === 0) {
                html += checked;
              }
              html += '>' + station.oilguns[i] + '</option>';
            }
            return html;
          });
        }
      };

      if (data.stations && $.isArray(data.stations)) {
        var stationIndex;
        var isSelect = data.stations.some(function(element, index) {
          // console.log(element);
          if (element.station_id === query.id) {
            stationIndex = index;
            return element.station_id === query.id;
          }
        });
        if (isSelect) {
          station = data.stations[stationIndex];
        } else {
          station = data.stations[0];
        }
      } else {
        station = data;
        $currentStationName.removeAttr('href').find('.weui-cell__ft').remove();
      }

      $currentStationName.find('p').text(station.station_name);

      $(document.body).children('section').removeClass('hide');

      $('#payment').on('change', function() {
        var pay = new Decimal($(this).val());
        // console.log(pay);
        if (pay) {
          total = pay.times(station.discount).toFixed(2);
          var html = '<p><del>支付金额：<span class="toltal-price">' + pay + '</span>元</del></p>';
          html += '<p class="red">折扣后：<span class="price">' + total + '</span>元</p>';

          // var text = '实付金额' + station.discount * 10 + '折(' + total + '元)';
          $('#discount').html(html);
        }
      });

      // $oilType.html(function() {
      //     var html = '';

      //     $.each(station.oilguns, function(index, value) {
      //       if (value) {
      //         typesList.push(value);
      //         html += '<option value="' + index + '">' + value.gas + '</option>';
      //       }
      //     });
      //     return html;
      //   })
      //   .on('change', function() {
      //     setGunValue($oilType.val(), 0);
      //   });

      setGunValue();

      $('#invoiceing').on('change', function() {
        $('#invoice').toggleClass('hide', !$(this).prop('checked'));
      });

      $('#loadingToast').fadeOut();
    } else {
      $('#loadingToast').fadeOut(function() {
        $('#errorMsg').removeClass('hide');
      });
    }
  };



  var bindEvents = function() {
    if (sessionStorage.getItem('invoicename')) {
      $('#invoice_title').text('(' + sessionStorage.getItem('invoicename') + ')');
    }
    if (sessionStorage.getItem('invoiceid')) {
      $('#invoiceing').prop('checked', 1);
      $('#invoice').removeClass('hide');
    } else {
      $('#invoiceing').prop('checked', 0);
      $('#invoice').addClass('hide');
    }
    var stations = JSON.parse(localStorage.getItem('stationInfo')).data;
    // var gasInfo;
    if (sessionStorage.getItem('stationId')) {
      stationId = sessionStorage.getItem('stationId');
    } else {
      if (stations.stations) {
        $('#invoice').removeClass('hide');
        stationId = stations.stations[0].station_id;
        // gasInfo = stations.stations[0].oilguns;
      } else {
        stationId = stations.station_id;
        // gasInfo = stations.oilguns;
      }
    }

    if (query.id) {
      stationId = query.id;
    }

    var paymentScope = function(toltalPrice) {
      var prePrice = $('#payment').val();
      // var carNumber = $('#car_number').val();
      // var gasType = gasInfo[$('#gas_type').val()].gas;
      var gunNumber = $('#gun_number').val();
      // var price;
      // var invoiceId;

      // $.each(gasInfo, function(i, v) {
      //   console.log(i, v);
      //   if (v.gas === gasType) {
      //     price = v.price;
      //   }
      // });

      // if ($('#invoiceing').prop('checked')) {
      //   invoiceId = sessionStorage.getItem('invoiceid');
      // }

      if (gunNumber && prePrice && toltalPrice) {
        $.post(requestUrl, {
          route: 'wechat/wechat/get_parameters',
          token: null,
          jsonText: JSON.stringify({
            'openid': openId,
            'unionid': unionId,
            // 'app_id': jsapi.appId,
            // 'order_total_source': 'WX',
            // 'gas_type': gasType,
            'gun_number': gunNumber,
            'station_id': stationId,
            // 'price': price,
            'pre_price': prePrice,
            'toltal_price': toltalPrice
          })
        }, function(data) {
          data = JSON.parse(data);
          if (data && data.status && data.status.succeed === '1') {

            var jap = data.data.jsApiParameters;

            wx.chooseWXPay({
              timestamp: jap.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: jap.nonceStr, // 支付签名随机串，不长于 32 位
              package: jap.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: jap.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: jap.paySign, // 支付签名
              success: function() {
                $('#loadingToast').fadeOut();
                $dialog.fadeIn(200);
                $.post(requestUrl, {
                  route: 'wechat/wechat/get_journal_state',
                  jsonText: JSON.stringify(data.data)
                });
              }
            });
          }
          $('#loadingToast').fadeOut();
        });
      } else {
        $('#loadingToast').fadeOut();
      }
    };


    $('#dialog').on('click', '.weui-dialog__btn', function() {
      $(this).parents('.js_dialog').fadeOut(200);
    });

    $('#pay_now').click(function() {
      if (total) {
        $('#loadingToast p').text('请稍后');
        $dialog.find('.weui-dialog__bd span').text(total);
        // $dialog.fadeIn(200);
        $('#loadingToast').fadeIn();
        init();
        paymentScope(total);
      }

      return false;
    });
  };

  // $('#showFeedbackDialog').on('click', function() {
  //   $dialog.fadeIn(200);
  // });

  if (typeof resp === 'undefined') {
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

    // getStationByLocation('108.99807', '34.236141');
  } else {
    // for testing
    onGetStationByLocation(resp);
  }
});
