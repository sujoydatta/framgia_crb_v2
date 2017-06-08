class NullCalendar
  attr_reader :id, :name

  def initialize
    @name = I18n.t "calendar_name"
  end

  class << self
    def direct_calendars
      Calendar.none
    end

    def workspace_calendars
      Calendar.none
    end
  end

  def get_color _
    Color.all.sample
  end
end
