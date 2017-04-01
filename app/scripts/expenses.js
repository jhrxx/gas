var resp;
// resp = '{"status":{"succeed":"1"},"data":[{"score_change":"100","change_info":"加油","socre_name":"3","date_added":"2017-02-14 14:56:10"},{"score_change":"100","change_info":"礼品兑换","socre_name":"5001","date_added":"2017-02-14 14:59:34"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"5001","date_added":"2017-02-14 15:01:13"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"3","date_added":"2017-02-14 15:01:40"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"3","date_added":"2017-02-14 15:03:07"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"3","date_added":"2017-02-16 15:03:44"},{"score_change":"100","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:23:58"},{"score_change":"100","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:54:37"},{"score_change":"1222","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-24 17:34:20"},{"score_change":"123","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-24 17:38:44"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:02:33"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:04:37"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:05:57"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:07:56"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:08:35"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:09:51"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:10:59"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:11:40"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:14:10"},{"score_change":"55","change_info":"线上加油消费","socre_name":"","date_added":"2017-03-20 00:15:55"},{"score_change":"55","change_info":"线上加油消费","socre_name":"线上加油消费","date_added":"2017-03-20 00:16:25"},{"score_change":"55","change_info":"线上加油消费","socre_name":"华峰石油加油站","date_added":"2017-03-20 00:17:16"}]}';
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
        html += '<p>' + list[i].socre_name + '</p>';
        html += '<p class="muted">' + list[i].date_added + '</p>';
        html += '</div>';
        html += '<div class="weui-cell__ft">';
        html += '<p>' + list[i].change_info + '</p>';
        if (list[i].score_change) {
          if (parseInt(list[i].score_change) > 0) {
            html += '<p class="red">积分+' + list[i].score_change + '</p>';
          } else {
            html += '<p class="green">积分' + list[i].score_change + '</p>';
          }
        }
        html += '</div>';
        html += '</div>';
      }

      $('#container').html(html);
    }
  };

  var onGetExpensesList = function(data) {
    data = JSON.parse(data);
    // console.log(data.data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        renderList(data.data);
      } else if (data.status.succeed === '0' && data.status.error_code === '2032') {
        $('#container').html('<div class="weui-panel__hd">当前无消费记录</div>');
      }
    }

    $('#loadingToast').addClass('hide');
  };

  var getExpensesList = function() {
    if (typeof resp === 'undefined') {
      if (openId && unionId) {
        $.post(requestUrl, {
          route: 'wechat/wechat/get_order_list',
          token: null,
          jsonText: JSON.stringify({ 'unionid': unionId })
        }, onGetExpensesList);
      } else {
        onGetExpensesList(resp);
      }
    } else {
      console.error('miss openId or unionId');
    }
  };

  getExpensesList();
});
