class NullUser
  attr_reader :id, :name, :email

  def initialize org = nil
    @name = I18n.t "user_name"
    @org = org
  end

  def other_calendars
    Calendar.none
  end

  def manage_calendars
    Calendar.none
  end

  def user_calendars
    UserCalendar.none
  end

  def persisted?
    false
  end

  def setting_default_view
    @org.try :setting_default_view || "scheduler"
  end

  def setting_timezone_name
    @org.try :setting_timezone_name
  end

  def permission_make_change? _
    false
  end

  def permission_manage? _
    false
  end

  def has_permission? _
    false
  end

  def permission_hide_details? _
    false
  end
end
