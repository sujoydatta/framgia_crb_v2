App.notification = App.cable.subscriptions.create('NotificationChannel', {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {
    var notification = new Notification(data.notify_data.remind_message, {
      icon: data.notify_data.icon,
      body: (data.notify_data.title + I18n.t('in') + data.notify_data.start)
    });

    notification.onclick = function () {
      // window.open('http://localhost:3000');
    };
    // var current_counter = parseInt($('#noti-counter').text(), 10);
    // $('.notifications-view').prepend(data.notification);
    // $('#noti-counter').text(current_counter + 1);
    // return notifyMe(data.notification);
  }
});
