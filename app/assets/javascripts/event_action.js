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
  };
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

        if (event.editable) clickEditTitle(event);
        cancelPopupEvent(event);
      },
      errors: function() {
        alert('OOP, Errors!!!');
      }
    });
  }
}

function unSelectCalendar() {
  $calendar.fullCalendar('unselect');
}

function deleteEventPopup(event) {
  $('#btn-delete-event').unbind('click');
  $('#btn-delete-event').click(function() {
    hiddenDialog('popup');

    if (event.repeat_type === null || event.repeat_type.length === 0) {
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

$('body').on('click', '.btn-cancel, .bubble-close', function() {
  unSelectCalendar();
  hiddenDialog('new-event-dialog');
  hiddenDialog('dialog-update-popup');
  hiddenDialog('dialog-repeat-popup');
  hiddenDialog('google-event-popup');
  $('.overlay-bg').hide();
});

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
  if ($('.fc-view-container').length === 0)
    return;

  saveLastestView();

  if (!$(event.target).hasClass('create') && !$(event.target).closest('#event-popup').hasClass('dropdown-menu')) {
    $('#source-popup').removeClass('open');
  }

  if ($(event.target).closest('#new-event-dialog').length === 0 && $(event.target).closest('.fc-body').length === 0) {
    hiddenDialog('new-event-dialog');
    unSelectCalendar();
  }

  if ($(event.target).closest('#popup').length === 0 && $(event.target).closest('.fc-body').length === 0) {
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
      var exception_type;
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
  var time_summary;

  if (event.allDay) {
    time_summary = event.start.format('MMMM Do YYYY');
  } else {
    time_summary = event.start.format('dddd') + ' ' + event.start.format('H:mm A') + ' To ' + event.end.format('H:mm A') + ' ' + event.end.format('DD-MM-YYYY');
  }

  $('#gtime-event-popup').html(time_summary);
  $('#gcalendar-event-popup').html(event.orgnaizer);
}

function confirm_repeat_popup(event){
  var dialog = $('#dialog-repeat-popup');
  var dialogW = $(dialog).width();
  var dialogH = $(dialog).height();
  var windowW = $(window).width();
  var windowH = $(window).height();
  var xCordinate, yCordinate;
  xCordinate = (windowW - dialogW) / 2;
  yCordinate = (windowH - dialogH) / 2;
  dialog.css({'top': yCordinate, 'left': xCordinate});
  showDialog('dialog-repeat-popup');

  $('.btn-confirm').click(function() {
    if ($(this).attr('rel') !== null) {
      var check_is_delete = $(this).attr('rel').indexOf(I18n.t('events.repeat_dialog.delete.delete'));

      if (check_is_delete !== -1){
        $('.btn-confirm').unbind('click');
        deleteEvent(event, $(this).attr('rel'));
        hiddenDialog('dialog-repeat-popup');
      }
    }
  });
}

function deleteEvent(event, exception_type) {
  var start_date_before_delete, finish_date_before_delete;

  if (!event.allDay) finish_date_before_delete = event.end._i;
  start_date_before_delete = event.start._i;

  $.ajax({
    url: '/events/' + event.event_id,
    type: 'DELETE',
    data: {
      exception_type: exception_type,
      exception_time: event.start.format(),
      finish_date: (event.end !== null) ? event.end.format('MM-DD-YYYY H:mm A') : '',
      start_date_before_delete: start_date_before_delete,
      finish_date_before_delete: finish_date_before_delete,
      persisted: event.persisted ? 1 : 0
    },
    dataType: 'json',
    success: function() {
      if (exception_type == 'delete_all_follow')
        $calendar.fullCalendar('removeEvents', function(e) {
          if(e.event_id === event.event_id && e.start.format() >= event.start.format())
            return true;
        });
      else
        if (exception_type == 'delete_all') {
          $calendar.fullCalendar('removeEvents', function(e) {
            if (e.event_id === event.event_id)
              return true;
          });
        } else {
          event.exception_type = exception_type;
        }
      $calendar.fullCalendar('refetchEvents');
    },
    error: function() {
    }
  });
}

$('form.event-form').submit(function(event) {
  event.preventDefault();
  var form = $(this);
  var submitDom = $(document.activeElement);

  if (submitDom.context.value.length > 0 ) {
    $('.exception_type').val(submitDom.context.value);
  }

  $.ajax({
    url: $(this).attr('action'),
    type: 'POST',
    dataType: 'json',
    data: $(this).serialize(),
    success: function(data) {
      if (data.is_overlap) {
        overlapConfirmation(form);
      } else if (data.is_errors) {
        var $errorsTitle = $('.error-title');
        $errorsTitle.text(I18n.t('events.dialog.title_error'));
        $errorsTitle.show();
      } else {
        if ($calendar.attr('data-reload-page') == 'false') {
          hiddenDialog('new-event-dialog');
          addEventToCalendar(data);
        } else {
          window.history.back();
        }
      }
    },
    error: function (jqXHR) {
      if (jqXHR.status === 500) {
        alert('Internal error: ' + jqXHR.responseText);
      } else {
        alert('Unexpected error!!!');
      }
    }
  });
});

function overlapConfirmation(form) {
  var dialogOverlapConfirm = $('#dialog_overlap_confirm');
  dialogOverlapConfirm.dialog({
    autoOpen: false,
    modal: true,
    resizable: false,
    height: 'auto',
    width: 400
  });
  dialogOverlapConfirm.dialog({
    buttons : {
      'Confirm' : function() {
        $('#allow-overlap').val('true');
        form.find('input[name="_method"]').remove();
        $.ajax({
          type: 'POST',
          url: '/events',
          dataType: 'json',
          data: form.serialize(),
          success: function(data) {
            if ($calendar.attr('data-reload-page') == 'false') {
              addEventToCalendar(data);
              $('#allow-overlap').val('false');
              dialogOverlapConfirm.dialog('close');
            } else {
              window.history.back();
            }
          },
          error: function (jqXHR) {
            if (jqXHR.status === 500) {
              alert('Internal error: ' + jqXHR.responseText);
            } else {
              alert('Unexpected error!');
            }
          }
        });
      },
      'Cancel' : function() {
        $(this).dialog('close');
      }
    }
  });
  dialogOverlapConfirm.dialog('open');
}

function addEventToCalendar(data) {
  $calendar.fullCalendar('renderEvent', eventData(data), true);
  $calendar.fullCalendar('unselect');
}
