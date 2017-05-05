class Calendars::SearchController < ApplicationController
  def show
    respond_to do |format|
      @calendar_presenter = CalendarPresenter.new(current_user)
      @room_search = RoomSearchService.new current_user, params
      format.html do
        @results = @room_search.perform if @room_search.valid?
      end
      format.json do
        if @room_search.valid?
          render json: {results: @room_search.perform}
        else
          render json: {error: @room_search.errors.messages}, status: 422
        end
      end
    end
  end
end
