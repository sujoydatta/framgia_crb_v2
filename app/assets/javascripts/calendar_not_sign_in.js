//= require_self
//= require sidebar
//= require event_action

$(document).on('ready', function() {
  var $schedulers = $('#my-calendar').data('mcalendar');
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
    editable: false,
    selectHelper: true,
    unselectAuto: true,
    nowIndicator: true,
    allDaySlot: true,
    eventLimit: true,
    allDayDefault: false,
    selectable: false,
    height: $(window).height() - $('header').height() - 20,
    googleCalendarApiKey: 'AIzaSyBhk4cnXogD9jtzPVsp_zuJuEKhBRC-skI',
    eventSources: googleCalendarsData(),
    timezone: timezone,
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
          return {
            id: data.id,
            title: data.name,
            building: data.building
          };
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
        initDialogEventClick(event, jsEvent);
      } else {
        dialogCordinate(jsEvent, 'new-event-dialog', 'prong');
        $('#event-title').focus();
      }
    },
    loading: function(bool) {
      $('#loading').toggle(bool);
    }
  });
});
