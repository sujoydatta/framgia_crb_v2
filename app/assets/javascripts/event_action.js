function eventData(data) {
  var start_time = moment(data.start_date).tz(timezone).format();
  var end_time = moment(data.finish_date).tz(timezone).format();
  var titleEvent = calendarViewContext === 'calendar' ? (data.calendar.name + ': ' + data.title) : data.title;

  return {
    id: data.id,
    title: titleEvent,
    summary: data.title,
    start: start_time,
    end: end_time,
    className: ['color-' + data.color_id, data.id],
    resourceId: data.calendar_id,
    calendar: data.calendar,
    allDay: data.all_day,
    repeat_type: data.repeat_type,
    end_repeat: data.end_repeat,
    event_id: data.event_id,
    exception_type: data.exception_type,
    editable: data.editable,
    persisted: data.persisted,
    isGoogleEvent: false,
    start_time_before_drag: start_time,
    finish_time_before_drag: end_time
  }
}

function initDialogEventClick(event, jsEvent){
  $('#popup').remove();

  hiddenDialog('new-event-dialog');
  hiddenDialog('google-event-popup');
  unSelectCalendar();

  if (event.isGoogleEvent) {
    updateGoogleEventPopupData(event);
    dialogCordinate(jsEvent, 'google-event-popup', 'gprong-popup');
    showDialog('google-event-popup');
  } else {
    var start_date = moment.tz(event.start.format(), 'YYYY-MM-DDTHH:mm:ss', timezone).format();
    var finish_date = event.end !== null ? moment.tz(event.end.format(), 'YYYY-MM-DDTHH:mm:ss', timezone).format() : '';
    $.ajax({
      url: '/events/' + event.event_id,
      dataType: 'json',
      data: {
        start_date: start_date,
        finish_date: finish_date,
      },
      success: function(data){
        $calContent.append(data.popup_content);
        dialogCordinate(jsEvent, 'popup', 'prong-popup');
        showDialog('popup');
        deleteEventPopup(event);
        if (event.editable) clickEditTitle(event);
        cancelPopupEvent(event);
      },
      errors: function() {
        console.log('OOP, Errors!!!');
      }
    });
  }
}

function unSelectCalendar() {
  $calendar.fullCalendar('unselect');
}

function dialogCordinate(jsEvent, dialogId, prongId) {
  var dialog = $('#' + dialogId);
  var dialogW = $(dialog).width();
  var dialogH = $(dialog).height();
  var windowW = $(window).width();
  var windowH = $(window).height();
  var xCordinate, yCordinate;
  var prongRotateX, prongXCordinate, prongYCordinate;

  if(jsEvent.clientX - dialogW/2 < 0) {
    xCordinate = jsEvent.clientX - dialogW/2;
  } else if(windowW - jsEvent.clientX < dialogW/2) {
    xCordinate = windowW - 2 * dialogW/2 - 10;
  } else {
    xCordinate = jsEvent.clientX - dialogW/2;
  }
  if(xCordinate < 0) xCordinate = 10;

  if(jsEvent.clientY - dialogH < 0) {
    yCordinate = jsEvent.clientY + 20;
    prongRotateX = 180;
    prongYCordinate = -9;
  } else {
    yCordinate = jsEvent.clientY - dialogH - 20;
    prongRotateX = 0;
    prongYCordinate = dialogH;
  }

  prongXCordinate = jsEvent.clientX - xCordinate - 10;

  $(dialog).css({'top': yCordinate, 'left': xCordinate});
  $('#' + prongId).css({
    'top': prongYCordinate,
    'left': prongXCordinate,
    'transform': 'rotateX(' + prongRotateX + 'deg)'
  });
}

function showDialog(dialogId) {
  var dialog = $('#' + dialogId);
  $(dialog).removeClass('dialog-hidden');
  $(dialog).addClass('dialog-visible');
  $('#event-title').focus();
}

function deleteEventPopup(event) {
  $('#btn-delete-event').unbind('click');
  $('#btn-delete-event').click(function() {
    hiddenDialog('popup');
    if (event.repeat_type == null || event.repeat_type.length == 0) {
      deleteEvent(event, 'delete_all');
    } else if (event.exception_type == 'edit_only') {
      deleteEvent(event, 'delete_only');
    } else {
      confirm_repeat_popup(event);
    }
  });
}

function cancelPopupEvent(event){
  $calContent.on('click', '.cancel-popup-event', function() {
    event.title = $('#title-popup').text().trim();
    hiddenDialog('popup');
    hiddenDialog('dialog-repeat-popup');
    hiddenDialog('dialog-update-popup');
  });
}

$('body').on('click', '.btn-cancel, .bubble-close', function(){
  unSelectCalendar();
  hiddenDialog('new-event-dialog');
  hiddenDialog('dialog-update-popup');
  hiddenDialog('dialog-repeat-popup');
  hiddenDialog('google-event-popup');
})

function clickEditTitle(event) {
  var titleInput = $('#title-input-popup');
  $('#title-popup').click(function() {
    $('.data-display').css('display', 'none');
    $('.data-none-display').css('display', 'inline-block');
    titleInput.val(event.summary);
    titleInput.unbind('change');
    titleInput.on('change', function(e) {
      event.summary = e.target.value;
    });
    updateEventPopup(event);
  });
}

$(document).click(function() {
  if ($('.fc-view-container').length !== 0)
    saveLastestView();

  if (!$(event.target).hasClass('create') && !$(event.target).closest('#event-popup').hasClass('dropdown-menu')) {
    $('#source-popup').removeClass('open');
  }

  if ($(event.target).closest('#new-event-dialog').length === 0 && $(event.target).closest('.fc-body').length === 0) {
    hiddenDialog('new-event-dialog');
    unSelectCalendar();
  }

  if ($(event.target).closest('#popup').length === 0 && $(event.target).closest('.fc-body').length == 0) {
    hiddenDialog('popup');
  }

  if ($(event.target).closest('#dialog-repeat-popup').length === 0 && $(event.target).closest('#btn-delete-event').length === 0) {
    hiddenDialog('dialog-repeat-popup');
  }

  if($(event.target).closest('.fc-event').length === 0 && $(event.target).closest('#google-event-popup').length === 0) {
    hiddenDialog('google-event-popup');
  }
});

function saveLastestView() {
  localStorage.setItem('currentView', $calendar.fullCalendar('getView').name);
}

function updateEventPopup(event) {
  $('#btn-save-event').unbind('click');
  $('#btn-save-event').click(function() {
    hiddenDialog('popup');
    if (event.repeat_type === null || event.repeat_type.length === 0 || event.exception_type === 'edit_only') {
      if (event.exception_type !== null)
        exception_type = event.exception_type;
      else
        exception_type = null;
      updateServerEvent(event, event.allDay, exception_type, 0);
    } else {
      confirm_update_popup(event, event.allDay, event.end);
    }
  });
}

function updateGoogleEventPopupData(event) {
  $('#gtitle-popup span').html(event.title);
  $('#gevent-btn').attr('href', event.link);

  if(event.allDay) {
    time_summary = event.start.format('MMMM Do YYYY');
  } else {
    time_summary = event.start.format('dddd') + ' ' + event.start.format('H:mm A') + ' To ' + event.end.format('H:mm A') + ' ' + event.end.format('DD-MM-YYYY');
  }

  $('#gtime-event-popup').html(time_summary);
  $('#gcalendar-event-popup').html(event.orgnaizer);
}
