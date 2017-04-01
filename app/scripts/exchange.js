var resp;
// resp = '{"status":{"succeed":"1"},"data":[{"product_name":"xxx","product_number":"3","product_info":"xxxxaaaaa","status":"1","date_added":"2017-02-14 09:30:18"},{"product_name":"xxx","product_number":"3","product_info":"xxxxaaaaa","status":"1","date_added":"2017-02-14 09:49:14"},{"product_name":"xxx","product_number":"3","product_info":"xxxxaaaaa","status":"0","date_added":"2017-02-16 09:49:52"},{"product_name":"杯子","product_number":"1","product_info":"保温杯","status":"1","date_added":"2017-02-27 16:23:22"},{"product_name":"杯子","product_number":"1","product_info":"保温杯","status":"1","date_added":"2017-02-27 16:25:24"},{"product_name":"杯子","product_number":"1","product_info":"保温杯","status":"1","date_added":"2017-02-27 16:26:50"},{"product_name":"杯子","product_number":"1","product_info":"保温杯","status":"1","date_added":"2017-02-27 16:27:44"},{"product_name":"杯子","product_number":"1","product_info":"保温杯","status":"1","date_added":"2017-02-27 16:29:57"},{"product_name":"杯子","product_number":"1","product_info":"保温杯","status":"1","date_added":"2017-02-27 16:30:15"},{"product_name":"键盘","product_number":"1","product_info":"机械键盘","status":"1","date_added":"2017-02-27 16:45:57"},{"product_name":"杯子","product_number":"3","product_info":"保温杯","status":"1","date_added":"2017-03-06 16:18:46"}]}';
// empty data
// resp = '{"status":{"succeed":"0","error_code":"2032","error_desc":"无数据"}}';

$(function() {
  var openId;
  var unionId;
  openId = localStorage.openid;
  if (openId) {
    unionId = localStorage.getItem('unionid_' + openId);
  }

  $('#loadingToast').addClass('hide');
  var renderList = function(list) {
    if (list && $.isArray(list)) {
      var html = '';
      for (var i = 0; i < list.length; i++) {
        // console.log(list[i]);
        html += '<div class="weui-cell">';
        html += '<div class="weui-cell__bd">';
        html += '<p>' + list[i].product_name + '</p>';
        html += '<p class="muted">' + list[i].date_added + '</p>';
        html += '</div>';
        html += '<div class="weui-cell__ft">';
        html += '<p>' + list[i].product_info + '</p>';
        if (list[i].status === '1') {
          html += '<p class="red">未兑换</p>';
        } else if (list[i].status === '0') {
          html += '<p>已兑换</p>';
        }
        html += '</div>';
        html += '</div>';
      }

      $('#container').html(html);
    }
  };

  var onGetExchangeList = function(data) {
    data = JSON.parse(data);
    // console.log(data.data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        renderList(data.data);
      } else if (data.status.succeed === '0' && data.status.error_code === '2032') {
        $('#container').html('<div class="weui-panel__hd">当前无兑换记录</div>');
      }
    }

    $('#loadingToast').addClass('hide');
  };

  var getExchangeList = function() {
    if (typeof resp === 'undefined') {
      if (openId && unionId) {
        $.post(requestUrl, {
          route: 'wechat/wechat/get_exchange_list',
          token: null,
          jsonText: JSON.stringify({ 'unionid': unionId })
        }, onGetExchangeList);
      } else {
        console.error('miss openId or unionId');
      }
    } else {
      onGetExchangeList(resp);
    }
  };

  getExchangeList();
});
