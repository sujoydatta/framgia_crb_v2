class ResultSearchPresenter
  attr_accessor :room_name, :calendar_id, :start_date, :finish_date, :type

  def initialize type, calendar, start_date, finish_date
    @type = type
    @room_name = calendar.name
    @calendar_id = calendar.id
    @start_date = start_date
    @finish_date = finish_date
  end

  def encode_event_params
    Base64.urlsafe_encode64({
      calendar_id: @calendar_id,
      start_date: @start_date,
      finish_date: @finish_date
    }.to_json)
  end

  def is_suggest_type?
    @type == :suggest
  end
end
