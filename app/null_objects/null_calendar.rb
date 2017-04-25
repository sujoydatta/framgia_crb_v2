class NullCalendar
  class << self
    def direct_calendars
      []
    end

    def workspace_calendars
      []
    end
  end

  def name
    I18n.t "calendar_name"
  end
end
