(function() {
  var self = this;

  var getUrlQueryObj = function(url) {
    url = url == null ? window.location.href : url;
    var search = url.substring(url.lastIndexOf('?') + 1);
    var obj = {};
    var reg = /([^?&=]+)=([^?&=]*)/g;
    search.replace(reg, function(rs, $1, $2) {
      var name = decodeURIComponent($1);
      var val = decodeURIComponent($2);
      // val = val?isNaN(val)?String(val):parseInt(val):null;
      obj[name] = val;
      return rs;
    });
    return obj;
  };

  var getTimestamp = function() {
    return Math.round(new Date().getTime() / 1000);
  };

  self.getUrlQueryObj = getUrlQueryObj;
  self.getTimestamp = getTimestamp;
  self.requestUrl = '/zsh/app_interface/index.php';
   // self.requestUrl = 'http://www.xauto123.com/zsh/app_interface/index.php';

}.call(window));
