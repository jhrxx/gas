var resp;
// resp = '{"status":{"succeed":"1"},"data":[{"exchange_id":"131","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-04-05 14:12:27","exchange_time":"2017-04-05 14:12:36"},{"exchange_id":"133","product_name":"机油","product_number":"1","product_info":"嘉实多机油，机油中的战斗油","status":"0","date_added":"2017-04-05 15:31:35","exchange_time":"2017-04-05 15:32:24"},{"exchange_id":"134","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-04-05 16:35:54","exchange_time":"2017-04-05 16:36:01"},{"exchange_id":"136","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-04-05 16:52:51","exchange_time":"2017-04-05 16:53:07"},{"exchange_id":"145","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-05-06 16:37:46","exchange_time":"2017-05-06 16:37:58"},{"exchange_id":"146","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-05-06 16:38:40","exchange_time":"2017-05-06 16:40:06"},{"exchange_id":"147","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-05-06 16:40:14","exchange_time":"2017-05-06 16:40:20"},{"exchange_id":"148","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-05-06 16:41:15","exchange_time":"2017-05-06 16:42:00"},{"exchange_id":"149","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"0","date_added":"2017-05-06 16:42:06","exchange_time":"2017-05-06 16:43:03"},{"exchange_id":"150","product_name":"行车记录仪","product_number":"1","product_info":"小蚁记录仪","status":"1","date_added":"2017-05-06 16:43:27","exchange_time":"0000-00-00 00:00:00"},{"exchange_id":"164","product_name":"探讨探讨","product_number":"1","product_info":"咿呀咿呀哟","status":"0","date_added":"2017-05-08 12:53:02","exchange_time":"2017-05-08 12:54:44"},{"exchange_id":"165","product_name":"探讨探讨","product_number":"1","product_info":"咿呀咿呀哟","status":"0","date_added":"2017-05-08 12:56:21","exchange_time":"2017-05-08 13:02:19"},{"exchange_id":"166","product_name":"探讨探讨","product_number":"1","product_info":"咿呀咿呀哟","status":"0","date_added":"2017-05-08 13:03:38","exchange_time":"2017-05-08 13:06:41"}]}';
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
        if (list[i].status === '1') {
          html += '<a class="weui-cell" href="gift.html?exchange_id=' + list[i].exchange_id + '">';
        } else {
          html += '<div class="weui-cell">';

        }
        html += '<div class="weui-cell__bd">';
        html += '<p>' + list[i].product_name + '</p>';
        html += '<p class="muted">' + list[i].date_added + '</p>';
        html += '</div>';
        html += '<div class="weui-cell__ft">';
        html += '<p class="green">' + list[i].product_info + '</p>';
        if (list[i].status === '1') {
          html += '<p class="red">未兑换</p>';
          html += '</div>';
          html += '</a>';
        } else if (list[i].status === '0') {
          html += '<p>已兑换</p>';
          html += '</div>';
          html += '</div>';
        }
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
