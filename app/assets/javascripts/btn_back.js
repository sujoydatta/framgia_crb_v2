/* global Cookies */
$(document).on('ready', function() {
  var btn1 = $('.btn-go-back');

  btn1.on('click', function() {
    var cookie = Cookies.get('back');

    if(cookie[cookie.length-1] === ';')
      cookie = cookie.substring(0, cookie.length-1);
    var pos = cookie.lastIndexOf(';');
    Cookies.set('back', cookie.substring(0, pos + 1));
    Cookies.set('return', window.location.href);
  });
});
