//= require_self
//= require sidebar
//= require calendar_sidebar_menu
//= require event_action

$(document).on('ready', function() {
  var $schedulers = $('#my-calendar').data('mcalendar');
  var day_format = I18n.t('events.time.formats.day_format');
  var schedulerRightMenu = 'timelineDay,timelineWeek,timelineMonth';
  var calendarRightMenu = 'agendaDay,agendaWeek,month,agendaFiveDay';

  function googleCalendarsData() {
    if ($calendar.length > 0) {
      var gCalendarIds = [];
      $('.sidebar-calendars .divBox>div').not($('.uncheck')).each(function() {
        gCalendarIds.push({
          googleCalendarId: $(this).attr('google_calendar_id'),
          resourceId: $(this).attr('data-calendar-id')
        });
      });

      return gCalendarIds;
    } else {
      return [];
    }
  }

  currentView = function() {
    var _currentView = localStorage.getItem('currentView');

    if(((schedulerRightMenu.indexOf(_currentView) > -1) && calendarViewContext === 'scheduler') || ((calendarRightMenu.indexOf(_currentView) > -1) && calendarViewContext === 'calendar'))
      return _currentView;

    return (calendarViewContext == 'scheduler' ? 'timelineDay' : 'agendaWeek');
  };

  var _calendarRightMenu = function(){
    if (calendarViewContext === 'scheduler') {
      return schedulerRightMenu;
    } else {
      return calendarRightMenu;
    }
  };

  $calendar.fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: _calendarRightMenu()
    },
    views: {
      agendaFiveDay: {
        type: 'agenda',
        duration: {days: 5},
        buttonText: '5 days'
      }
    },
    borderColor: '#fff',
    eventBorderColor: '#fff',
    eventColor: '#4285f4',
    defaultView: currentView(),
    editable: true,
    selectHelper: true,
    unselectAuto: false,
    nowIndicator: true,
    allDaySlot: true,
    eventLimit: true,
    allDayDefault: false,
    selectable: {
      month: false,
      agenda: true
    },
    height: $(window).height() - $('header').height() - 20,
    googleCalendarApiKey: 'AIzaSyBq3usCOj6jFBRtPa5fju9v05vN-Jsy_lM',//'AIzaSyBhk4cnXogD9jtzPVsp_zuJuEKhBRC-skI',
    eventSources: googleCalendarsData(),
    timezone: window.timezone,
    events: function(start, end, timezone, callback) {
      var calendar_ids = [];
      $('.sidebar-calendars .divBox>div').not($('.uncheck')).each(function() {
        calendar_ids.push($(this).attr('data-calendar-id'));
      });
      var start_time_view = $calendar.fullCalendar('getView').start;
      var end_time_view = $calendar.fullCalendar('getView').end;
      $.ajax({
        url: '/events',
        data: {
          calendar_ids: calendar_ids,
          organization_id: org_id,
          start_time_view: moment(start_time_view).format(),
          end_time_view: moment(end_time_view).format(),
        },
        dataType: 'json',
        success: function(response) {
          var events = [];
          events = response.events.map(function(data) {
            return eventData(data);
          });
          callback(events);
        }
      });
    },
    resourceLabelText: I18n.t('calendars.calendar'),
    resourceGroupField: 'building',
    resources: function(callback) {
      if (calendarViewContext === 'scheduler') {
        var arr =  $schedulers.map(function (data) {
          var resource = {id: data.id, title: data.name};

          if (data.building)
            resource.building = data.building;

          return resource;
        });

        callback(arr);
      } else {
        callback([]);
      }
    },
    eventRender: function(event, element) {
      var isOldEvent = event.allDay && event.start.isBefore(new Date(), 'day');
      var isEndOfEvent = event.end && event.end.isBefore(new Date());

      if(isOldEvent || isEndOfEvent) {
        $(element).addClass('before-current');
      }
    },
    eventClick: function(event, jsEvent) {
      if(event.id) {
        localStorage.setItem('current_event_id', event.id);
        initDialogEventClick(event, jsEvent);
      } else {
        dialogCordinate(jsEvent, 'new-event-dialog', 'prong');
        showDialog('new-event-dialog');
        $('#event-title').focus();
      }
    },
    select: function(start, end, jsEvent, view, resource) {
      var currentView = $calendar.fullCalendar('getView').name;
      var isAllDay = false;

      if (currentView === 'month') {
        end = start;
        isAllDay = true;
      } else if (start.day() !== end.day()) {
        if (!start.hasTime() && !end.hasTime()) {
          isAllDay = true;
          end = start;
        } else {
          $calendar.fullCalendar('unselect');
          return;
        }
      }

      initDialogCreateEvent(start, end, isAllDay, resource);
      dialogCordinate(jsEvent, 'new-event-dialog', 'prong');
      hiddenDialog('popup');
      showDialog('new-event-dialog');
      $('#event-title').focus();
    },
    eventResizeStart: function() {
      hiddenDialog('new-event-dialog');
      hiddenDialog('popup');
    },
    eventResize: function(event, delta, revertFunc) {
      if(event.end.format(day_format) == event.start.format(day_format)) {
        if (event.repeat_type === null || event.repeat_type.length === 0 || event.exception_type == 'edit_only') {
          updateServerEvent(event, 0, event.exception_type, 0);
        } else {
          localStorage.setItem('current_event_id', event.id);
          confirm_update_popup();
        }
      } else {
        revertFunc();
        alert(I18n.t('events.flashs.not_updated'));
      }
      hiddenDialog('new-event-dialog');
      hiddenDialog('popup');
    },
    eventDragStart: function() {
      hiddenDialog('new-event-dialog');
      hiddenDialog('popup');
    },
    eventDrop: function(event, delta, revertFunc) {
      if (!event.allDay && event.end !== null) {
        var startMomentDay = moment.tz(event.start.format(), timezone).day();
        var endMomentDay = moment.tz(event.end.format(), timezone).day();

        if(startMomentDay !== endMomentDay) {
          revertFunc();
          return;
        }
      }

      if (event.resourceId != event.calendar_id) {
        revertFunc();
        return;
      }

      updateServerEvent(event, event.allDay, null, 1);
    },
    eventOverlap: function(stillEvent, movingEvent) {
      // Handle code is here
      if (stillEvent.calendar_id == movingEvent.calendar_id || calendarViewContext === 'scheduler') {
        return false;
      }
    },
    loading: function(bool) {
      $('#loading').toggle(bool);
    }
  });

  $(document).on('click', '.btn-confirm', function() {
    if ($(this).attr('rel') === undefined) return;

    var check_is_edit = $(this).attr('rel').indexOf(I18n.t('events.repeat_dialog.edit.edit'));

    if (check_is_edit !== -1) {
      updateServerEvent(current_event, current_event.allDay, $(this).attr('rel'), 0);
      hiddenDialog('dialog-update-popup');
      $('.overlay-bg').hide();
    }
  });

  function initDialogCreateEvent(start, end, isAllDay, resource) {
    $('#event-title').focus().val('');

    var start_time_value, finish_time_value, time_summary;

    if(isAllDay) {
      start_time_value = moment.tz(start.format(), 'YYYY-MM-DDTHH:mm:ss', timezone).format();
      finish_time_value = moment.tz(end.format(), 'YYYY-MM-DDTHH:mm:ss', timezone).format();
      time_summary = start.format('MMMM Do YYYY');
    } else {
      start_time_value = moment.tz(start.format(), 'YYYY-MM-DDTHH:mm:ss', timezone).format();
      finish_time_value = moment.tz(end.format(), 'YYYY-MM-DDTHH:mm:ss', timezone).format();
      time_summary = start.format('dddd') + ' ' + start.format('H:mm A') + ' To ' + end.format('H:mm A') + ' ' + end.format('DD-MM-YYYY');
    }

    // set field value
    $('#all-day').val(isAllDay ? '1' : '0');
    $('.event-time').text(time_summary);
    $('#start-time').val(start_time_value);
    $('#finish-time').val(finish_time_value);

    var calendarName = $('.select-calendar p.tile-content');

    if (resource === undefined) {
      $('.calendar-container').show();
      calendarName.hide();
    } else {
      $('.calendar-selectbox').val(resource.id).trigger('change');
      $('.calendar-container').hide();
      calendarName.html(resource.title);
      calendarName.show();
    }
  }

  $('#edit-event-btn').on('click', function(event) {
    event.preventDefault();
    var form =  $('#new_event');
    var url = $(form).attr('action') + '/new';

    var event_object = {};
    var data = $(form).serializeArray();
    $.each(data, function(_, element) {
      if(element.name.indexOf('start_date') > 0) {
        event_object.start_date = element.value;
      } else if(element.name.indexOf('finish_date') > 0) {
        event_object.finish_date = element.value;
      } else if(element.name.indexOf('all_day') > 0) {
        event_object.all_day = element.value;
      } else if(element.name.indexOf('title') > 0) {
        event_object.title = element.value;
      } else if(element.name.indexOf('calendar_id') > 0) {
        event_object.calendar_id = element.value;
      }
    });

    window.location.href = url + '?fdata='+ Base64.encode(JSON.stringify(event_object));
  });

  $('#event-title').click(function() {
    $('.error-title').text('');
  });

  if ($('#make_public').val() === 'public_hide_detail') {
    $('#make_public').prop('checked', true);
    $('#free_busy').prop('checked', true);
  } else if ($('#make_public').val() === 'share_public') {
    $('#make_public').prop('checked', true);
  } else if ($('#make_public').val() === 'no_public') {
    $('#make_public').prop('checked', false);
    $('#free_busy').prop('disabled', true);
  }

  $('#make_public').click(function() {
    $('#make_public').val((this.checked) ? 'share_public' : 'no_public');
    $('#free_busy').prop('disabled', !this.checked);
  });

  $('#free_busy').click(function() {
    $('#make_public').val(($('#free_busy').prop('checked')) ? 'public_hide_detail' : 'share_public');
  });

  /* share-calendar*/

  $('#textbox-email-share').select2({
    tokenSeparators: [',', ' '],
    width: '90%'
  });

  var current_user = $('#current_user').val();
  var user_ids = [current_user];

  $('.user_share_ids').each(function() {
    var user_id_temp = $(this).val();

    if ($.inArray(user_id_temp, user_ids) == -1) {
      user_ids.push(user_id_temp);
    }
  });

  $('#add-person').on('click', function() {
    var user_id = $('#textbox-email-share').val();
    var email = $('#textbox-email-share').find('option:selected').text();
    var permission = $('#permission-select').val();
    var color_id = $('#calendar_color_id').val();

    if (user_id) {
      $.ajax({
        url: '/share_calendars/new',
        method: 'get',
        data: {
          user_id: user_id,
          email: email,
          permission: permission,
          color_id: color_id
        },
        success: function(html) {
          if ($.inArray(user_id, user_ids) === -1) {
            if($('#user-calendar-share-' + user_id).length > 0) {
              $('#user-calendar-share-' + user_id).css('display', 'block');
              $('#user-calendar-share-' + user_id).find('.user_calendar_destroy').val(false);
              $('#user-calendar-share-' + user_id).find('.permission-select').val($('#permission-select').val());
            } else {
              $('#list-share-calendar').append(html);
              $('#user-calendar-share-' + user_id).find('.permission-select').select2({
                tags: true,
                minimumResultsForSearch: Infinity
              });
              user_ids.push(user_id);
            }
          }
        }
      });
    }
    $('#textbox-email-share').val('');
    $('#select2-textbox-email-share-container').html('');
  });

  $('#list-share-calendar').on('click', '.image-remove', function() {
    $(this).parent().parent().find('.user_calendar_destroy').val('1');
    $(this).parent().parent().hide();
    var index = user_ids.indexOf($(this).prop('id'));

    if (index !== -1) user_ids.splice(index, 1);
  });
});
