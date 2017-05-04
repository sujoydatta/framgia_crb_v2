App.notification = App.cable.subscriptions.create("NotificationChannel", {
  connected: function() {},
  disconnected: function() {},
  received: function(data) {
    console.log('------------> received');
    // var current_counter = parseInt($('#noti-counter').text(), 10);
    // $('.notifications-view').prepend(data.notification);
    // $('#noti-counter').text(current_counter + 1);
    // return notifyMe(data.notification);
  }
});
