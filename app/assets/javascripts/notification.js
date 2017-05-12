document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== 'granted')
    Notification.requestPermission();
});

// function notifyMe(message) {
//   var reg_img = new RegExp('/assets/notification/[A-Za-z]+[-][\\w/.]*(jpg|gif|png)(\\?[\\w=&]*)?');
//   var reg_div_message = new RegExp('<div class="message">.*?</div>');
//   var eg_message_content = new RegExp('> .*?<');

//   var link_icon = reg_img.exec(message)[0];
//   var div_message = reg_div_message.exec(message)[0];
//   var message_content = reg_message_content.exec(div_message)[0].substr(1).slice(0, -1);

//   if (Notification.permission !== 'granted')
//     Notification.requestPermission();
//   else {
//     var notification = new Notification('Notification title', {
//       icon: link_icon,
//       body: message_content
//     });

//     notification.onclick = function () {};
//   }
// }
