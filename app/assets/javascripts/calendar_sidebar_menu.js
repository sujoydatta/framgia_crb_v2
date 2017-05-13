$(document).on('ready', function() {
  $('.list-group').on('click', 'span', function() {
    userCalendar.calendar_id = $(this).attr('id');
  });

  $('#menu-of-calendar .ccp-rb-color').on('click', function() {
    userCalendar.color_id = $(this).data('color-id');
    userCalendar.updateColor();
  });

  $('.sidebar-calendars').on('click', '.divBox', function() {
    userCalendar.calendar_id = $('div', this).attr('data-calendar-id');
    userCalendar.updateState();
  });

  var userCalendar = {
    calendar_id: null,
    color_id: null,
    updateColor: function() {
      $.ajax({
        url: '/particular_calendars/' + userCalendar.calendar_id,
        method: 'PATCH',
        data: {user_calendar: {id: userCalendar.calendar_id, color_id: userCalendar.color_id}},
        dataType: 'json',
        success: function() {
          var dColor = $('div[data-calendar-id='+ userCalendar.calendar_id +']');
          dColor.removeClass('color-' + dColor.attr('data-color-id'));
          dColor.addClass('color-' + userCalendar.color_id);
          dColor.attr('data-color-id', userCalendar.color_id);

          $('span#' + userCalendar.calendar_id).attr('selected_color_id', userCalendar.color_id);
          $calendar.fullCalendar('removeEvents');
          $calendar.fullCalendar('refetchEvents');
        },
        errors: function() {
          alert('OHHH! Updating error!!!');
        }
      });
    },
    updateState: function() {
      var dColor = $('div[data-calendar-id='+ userCalendar.calendar_id +']');
      var uncheck = dColor.hasClass('uncheck');
      $.ajax({
        url: '/particular_calendars/' + userCalendar.calendar_id,
        method: 'PATCH',
        data: {user_calendar: {id: userCalendar.calendar_id, is_checked: uncheck}},
        dataType: 'json',
        success: function(data) {
          if (data.is_checked) {
            dColor.removeClass('uncheck');
            $calendar.fullCalendar('addEventSource', dColor.attr('google_calendar_id'));
          } else {
            dColor.addClass('uncheck');
            $calendar.fullCalendar('removeEventSource', dColor.attr('google_calendar_id'));
          }

          $calendar.fullCalendar('removeEvents');
          $calendar.fullCalendar('refetchEvents');
        },
        errors: function() {
          alert('OHHH! Updating error!!!');
        }
      });
    }
  };

  $('#request-email-button').click(function() {
    var email = $('#request-email-input').val();

    if (email === '') {
      alert('Please add email to request!');
    } else {
      $.ajax({
        url: '/request_emails/new',
        data: {request_email: email},
        type: 'GET',
        dataType: 'text',
        success: function(text) {
          alert(text);
        }
      });
    }
  });
});
