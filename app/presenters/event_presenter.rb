class EventPresenter
  attr_reader :object, :start_date, :finish_date, :range_time_title, :locals

  delegate :title, :calendar_name, :attendees, :owner_name, :description,
    to: :object, allow_nil: true

  def initialize event, params
    @object = event
    @params = params
    make_data
  end

  def make_data
    make_local_data
    make_range_time_title
  end

  def fdata
    Base64.urlsafe_encode64(@locals)
  end

  private

  def make_range_time_title
    @range_time_title = @start_date.strftime("%B %-d %Y")
    return @range_time_title if @object.all_day?

    stime_name = @start_date.strftime("%I:%M%p")
    ftime_name = @finish_date.strftime("%I:%M%p")
    dsname = @start_date.strftime("%A")
    dstime_name = @start_date.strftime("%m-%d-%Y")

    if is_same_day?
      @range_time_title = dsname + " " + stime_name + " To " + ftime_name + " " + dstime_name
    else
      dfname = @finish_date.strftime("%A")
      dftime_name = @start_date.strftime("%m-%d-%Y")
      @range_time_title = dsname + " " + stime_name + " " + dstime_name + " To " + dfname + " " + ftime_name + " " + dftime_name
    end
  end

  def make_local_data
    @start_date = build_start_date
    @finish_date = build_finish_date
    @locals ||= {
      event_id: @object.id,
      start_date: @start_date,
      finish_date: @finish_date
    }.to_json
  end

  def is_same_day?
    @start_date.strftime("%A") == @finish_date.strftime("%A")
  end

  def build_start_date
    return @params[:start_date].to_datetime if @params[:start_date]
    @object.start_date
  end

  def build_finish_date
    return @params[:finish_date].to_datetime if @params[:finish_date]
    @object.finish_date
  end
end
