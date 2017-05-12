class MultiEventsController < ApplicationController
  def new
    calendar_ids = params[:calendar_ids]
    start_date = params[:event_start_date]
    finish_date = params[:event_finish_date]
    @events = calendar_ids.map do |calendar_id|
      Event.new calendar_id: calendar_id, start_date: start_date, finish_date: finish_date
    end
  end

  def create

  end
end
