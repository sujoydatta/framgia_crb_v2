module SharedMethods
  extend ActiveSupport::Concern
  SHARE_ATTRIBUTES = [:id, :title, :description, :status, :color_id, :all_day,
    :repeat_type, :repeat_every, :user_id, :calendar_id, :start_date,
    :finish_date, :start_repeat, :end_repeat, :exception_time, :exception_type,
    :event_id, :persisted, :calendar_id, :editable].freeze

  # def format_date datetime
  #   datetime.try :strftime, Settings.event.format_date
  # end

  # def format_datetime datetime
  #   datetime.try :strftime, Settings.event.format_datetime
  # end

  def user_context
    current_user || NullUser.new
  end
end
