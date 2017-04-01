var resp, exchange;
// resp = '{"status":{"succeed":"1"},"data":{"user_score":"0","product_info":{"score_product_id":"6","station_id":"5001","product_name_id":"0","product_name":"xxx","product_score":"100","product_money":"0.00","product_img_url":"","product_number":"99","product_info":"xxxssaaaa","date_added":"2017-01-19 13:43:35","date_modified":"0000-00-00 00:00:00"}}}';

// exchange = '{"status":{"succeed":"1"},"data":{"QR":{"exchange_id":"33","validate":"945829f996dba12863240acfd6cadf79","product_name":"杯子","score_change":"36","product_number":"3"}}}';
// Error
// exchange = '{"status":{"succeed":"0","error_code":"3003","error_desc":"库存不够，或者商品被他人抢购"}}';

$(function() {
  var quantity = 1;
  var query = getUrlQueryObj();
  var openId;
  var unionId;
  openId = localStorage.openid;
  if (openId) {
    unionId = localStorage.getItem('unionid_' + openId);
  }

  var onExchangeItem = function(data) {
    $('#loadingToast').addClass('hide');
    data = JSON.parse(data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        // console.log('onExchangeItem: ', data.data.QR);
        // $.param(data.data.QR)
        window.location.href = 'gift.html?' + $.param(data.data.QR);
      } else if (data.status.succeed === '0') {
        console.error(data.status.error_code + data.status.error_desc);
      }
    }
  };

  var exchangeItem = function() {
    // storage data
    var stationInfo = JSON.parse(localStorage.stationInfo);
    console.log('station id: ', stationInfo.station_id);

    if (typeof exchange === 'undefined') {
      if (openId && unionId) {
        $.post(requestUrl, {
          route: 'wechat/wechat/score_exchange',
          token: null,
          jsonText: JSON.stringify({
            'unionid': unionId,
            'station_id': stationInfo.station_id,
            'score_product_id': query.id,
            'product_num': quantity,
            'time': getTimestamp()
          })
        }, onExchangeItem);
      } else {
        console.error('miss openId or unionId');
      }
    } else {
      onExchangeItem(exchange);
    }
  };

  var bindFn = function(info) {
    // console.log('Detail: ', info);
    var count = parseInt(info.product_number);
    if (count > 0) {
      $('#add_invoice_btn').click(function() {
        $('#loadingToast').removeClass('hide');
        exchangeItem();
        return false;
      });
    } else {
      $('#add_invoice_btn').attr('disabled', 'disabled');
      $('#quantity').text(0);
    }

    $('a', '#quantity_container').on('click', function(e) {
      if (e.target.id === 'increase' && quantity < count) {
        quantity += 1;
      }
      if (e.target.id === 'decrease' && quantity > 1) {
        quantity -= 1;
      }
      $('#quantity').text(quantity);
    });
  };

  var renderDetail = function(info) {
    var html = '';
    if (info.product_img_url) {
      html += '<img src="' + info.product_img_url + '" alt="">';
    }
    html += '<div class="content">';
    html += '<p>' + info.product_name + '</p>';
    html += '<ul>';
    if (info.product_info) {
      html += '<li>详情：' + info.product_info + '</li>';
    }
    // if (info.product_money) {
    //   html += '<li>' + info.product_money + '</li>';
    // }
    if (info.product_score) {
      html += '<li>积分：' + info.product_score + '</li>';
    }
    html += '</ul>';
    html += '<div id="quantity_container">商品数量 <ul><li><a id="decrease" href="#">-</a></li><li id="quantity">1</li><li><a id="increase" href="#">+</a></li></ul> </div>';
    html += '</div>';

    $('#content').html(html);
    // $('#add_invoice_btn').prop('href', 'gift.html?id=' + query.id);

    bindFn(info);
  };

  var onGetItemDetail = function(data) {
    data = JSON.parse(data);
    // console.log(data);
    if (data.status.succeed === '1') {
      renderDetail(data.data.product_info);
    }

    $('#loadingToast').addClass('hide');
  };

  if (typeof resp === 'undefined') {
    if (openId && unionId) {
      $.post(requestUrl, {
        route: 'wechat/wechat/get_product',
        token: null,
        jsonText: JSON.stringify({
          'union_id': unionId,
          'score_product_id': query.id
        })
      }, onGetItemDetail);
    } else {
      console.error('miss openId or unionId');
    }
  } else {
    onGetItemDetail(resp);
  }
});
