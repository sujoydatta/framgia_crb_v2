class ResultSearchPresenter
  attr_accessor :room_name, :calendar_id, :start_date, :finish_date

  def initialize type, calendar, start_date, finish_date
    @room_name = build_room_name(calendar, type)
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

  private

  def build_room_name calendar, type
    if type == :suggest
      calendar.name + I18n.t("room_search.suggest_label")
    end

    calendar.name
  end
end
