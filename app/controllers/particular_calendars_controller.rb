class ParticularCalendarsController < ApplicationController
  skip_before_action :authenticate_user!
  before_action :load_calendar

  def show
    @status = @calendar.status
    return if user_signed_in?
    @user_calendar = UserCalendar.find_by user: user, calendar: @calendar
  end

  def update
    @user_calendar = UserCalendar.find_by user: user, calendar: @calendar

    respond_to do |format|
      if @user_calendar && @user_calendar.update(user_calendar_params)
        format.json{render json: @user_calendar}
      else
        format.json{render json: {}, status: :unauthorized}
      end
      format.html{redirect_to root_path}
    end
  end

  private

  def load_calendar
    @calendar = Calendar.find_by(id: params[:id]) || NullCalendar.new
  end

  def user_calendar_params
    params.require(:user_calendar).permit UserCalendar::ATTR_PARAMS
  end

  def user
    current_user || NullUser.new
  end
end
