class ActivityPresenter
  delegate :title, :start_date, :finish_date, to: :event, prefix: true
  delegate :name, to: :owner, prefix: true
  delegate :name, to: :calendar, prefix: true

  def initialize activity
    @activity = activity
  end

  def key
    @activity.key
  end

  def event
    @event = @activity.trackable || NullEvent.new
  end

  def owner
    @activity.owner || NullUser.new
  end

  def calendar
    @event.calendar || NullCalendar.new
  end

  def created_at
    @activity.created_at
  end
end
