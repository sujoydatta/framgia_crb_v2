module EventsHelper
  def select_my_calendar calendars
    calendars.map{|calendar| [calendar.name, calendar.id]}
  end
end
