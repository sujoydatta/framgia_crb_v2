class NullUser
  def other_calendars
    []
  end

  def manage_calendars
    []
  end

  def setting_default_view
    I18n.t "scheduler"
  end

  def setting_timezone

  end

  def name
    I18n.t "user_name"
  end
end
