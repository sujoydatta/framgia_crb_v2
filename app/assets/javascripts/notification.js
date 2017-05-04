function mark_read_all_notifications() {
  $.ajax({
    url: '/dashboard/set_notifications',
    type:'PUT',
    dataType:'json',
    success: function(xhr){
      $('.notif').removeClass('unread')
      $('#noti-counter').text('0')
    }
  })
}

function read_notification(a) {
  var notif_id = $(a).attr('id')
  $.ajax({
    url: '/dashboard/notifications/' + notif_id,
    type:'PUT',
    dataType:'json',
    data: {
      notif: {
        id: notif_id
      }
    },
    success: function(xhr){
      if ($('.notif-' + notif_id).hasClass('unread')) {
        var count = parseInt($('#noti-counter').text(), 10) - 1
        $('#noti-counter').text(count)
        $('.notif-' + notif_id).removeClass('unread')
      }
    }
  })
}

document.addEventListener('DOMContentLoaded', function () {
  if (Notification.permission !== "granted")
    Notification.requestPermission()
})

function notifyMe(message) {
  reg_img = new RegExp('/assets/notification/[A-Za-z]+[-][\\w/.]*(jpg|gif|png)(\\?[\\w=&]*)?');
  reg_div_message = new RegExp('<div class="message">.*?</div>')
  reg_message_content = new RegExp('> .*?<')

  link_icon = reg_img.exec(message)[0];
  div_message = reg_div_message.exec(message)[0]
  message_content = reg_message_content.exec(div_message)[0].substr(1).slice(0, -1)

  if (Notification.permission !== "granted")
    Notification.requestPermission();
  else {
    var notification = new Notification('Notification title', {
      icon: link_icon,
      body: message_content
    })

    notification.onclick = function () {}
  }
}
