var resp;
// resp = '{"status":{"succeed":"1"},"data":[{"score_change":"100","change_info":"加油","socre_name":"3","date_added":"2017-02-14 14:56:10"},{"score_change":"100","change_info":"礼品兑换","socre_name":"5001","date_added":"2017-02-14 14:59:34"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"5001","date_added":"2017-02-14 15:00:05"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"5001","date_added":"2017-02-14 15:01:13"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"3","date_added":"2017-02-14 15:01:40"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"3","date_added":"2017-02-14 15:03:07"},{"score_change":"100","change_info":"xxxxxxxxxxxx","socre_name":"3","date_added":"2017-02-16 15:03:44"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:13:20"},{"score_change":"100","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:23:58"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:24:41"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:24:42"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:30:06"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:02"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:05"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:05"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:05"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:05"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:06"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:06"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:06"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:06"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:07"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:07"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:07"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:07"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:34:07"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:36:30"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:38:47"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:38:57"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:48:27"},{"score_change":"100","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 13:54:37"},{"score_change":"","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-22 14:24:47"},{"score_change":"1222","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-24 17:34:20"},{"score_change":"123","change_info":"线下添加积分","socre_name":"3","date_added":"2017-02-24 17:38:44"}]}';
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

  var onGetScoreList = function(data) {
    data = JSON.parse(data);
    // console.log(data.data);
    if (data && data.status) {
      if (data.status.succeed === '1') {
        renderList(data.data);
      } else if (data.status.succeed === '0' && data.status.error_code === '2032') {
        $('#container').html('<div class="weui-panel__hd">当前无积分记录</div>');
      }
    }

    $('#loadingToast').addClass('hide');
  };

  var getScoreList = function() {
    if (typeof resp === 'undefined') {
      if (openId && unionId) {
        $.post(requestUrl, {
          route: 'wechat/wechat/get_score_list',
          token: null,
          jsonText: JSON.stringify({ 'unionid': unionId })
        }, onGetScoreList);

      } else {
        console.error('miss openId or unionId');
      }
    } else {
      onGetScoreList(resp);
    }
  };

  getScoreList();
});
