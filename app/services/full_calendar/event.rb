module FullCalendar
  class Event
    alias :read_attribute_for_serialization :send
    include SharedMethods

    def self.model_name
      @_model_name ||= ActiveModel::Name.new(self)
    end

    ATTRS = [:id,
      :start_date,
      :finish_date,
      :calendar,
      :event_id,
      :persisted,
      :event,
      :user
    ].freeze

    attr_accessor *ATTRS

    delegate :title, :description, :status, :color, :all_day,
      :owner, :notification_events, :attendees, :repeat_ons,
      :repeat_type, :repeat_every, :user_id, :start_repeat,
      :end_repeat, :exception_time, :exception_type, to: :event, allow_nil: true
    delegate :id, :name, to: :calendar, prefix: true, allow_nil: true

    def initialize event, user
      @event = event
      @start_date = @event.start_date
      @finish_date = @event.finish_date
      @user = user || NullUser.new
      @calendar = @event.calendar
      @id = SecureRandom.urlsafe_base64
      @event_id = @event.id
    end

    def update_info repeat_date
      start_time = start_date.seconds_since_midnight.seconds
      end_time = finish_date.seconds_since_midnight.seconds

      @start_date = repeat_date.to_datetime + start_time
      @finish_date = repeat_date.to_datetime + end_time
      @id = Base64.encode64(@event_id.to_s + "-" + @start_date.to_s)
      @persisted = @event.start_date == @start_date
    end

    def editable
      valid_permission_user_in_calendar?
    end

    def delete_only?
      @event.delete_only?
    end

    def delete_all_follow?
      @event.delete_all_follow?
    end

    private
    def valid_permission_user_in_calendar?
      user_calendar = UserCalendar.find_by(calendar: @calendar, user: @user)

      return false if user_calendar.nil?
      Settings.permissions_can_make_change.include? user_calendar.permission_id
    end
  end
end
