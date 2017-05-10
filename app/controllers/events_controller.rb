class EventsController < ApplicationController
  load_resource except: [:index]
  authorize_resource
  skip_before_action :authenticate_user!, only: [:index, :show]
  before_action :load_calendars, :build_event_params, only: [:new, :edit]
  before_action only: [:edit, :update, :destroy] do
    validate_permission_change_of_calendar @event.calendar
  end
  before_action only: :show do
    validate_permission_see_detail_of_calendar @event.calendar
  end

  serialization_scope :current_user

  def index
    @events = Event.in_calendars params[:calendar_ids]

    if user_signed_in? && params[:organization_id].nil?
      @events += Event.shared_with_user current_user
    end

    @events = CalendarService.new(@events, params[:start_time_view],
      params[:end_time_view], context_user).repeat_data

    render json: @events, each_serializer: FullCalendar::EventSerializer,
      root: :events,
      adapter: :json,
      meta: t("api.request_success"),
      meta_key: :message,
      status: :ok
  end

  def show
    @event_presenter = EventPresenter.new(@event, params)

    respond_to do |format|
      format.html
      format.json do
        render json: {
          popup_content: render_to_string(partial: "events/popup",
            formats: :html,
            layout: false,
            locals: {event_presenter: @event_presenter})
        }
      end
    end
  end

  def new
    if event_id = params[:event][:event_id]
      @event = Event.find(event_id).dup
    else
      @event = Event.new event_params
    end

    load_related_data
  end

  def create
    create_service = Events::CreateService.new current_user, params
    respond_to do |format|
      if create_service.perform
        format.html do
          flash[:success] = t "events.flashs.created"
          redirect_to root_path
        end
        format.json do
          render json: create_service.event.json_data(current_user.id)
        end
      else
        if @is_overlap = create_service.is_overlap
          flash[:error] = t "events.flashs.overlap"
          format.html{redirect_to :back}
        else
          format.html{render :new}
        end
        format.json do
          render json: {is_overlap: @is_overlap, is_errors: @event.errors.any?}
        end
      end
    end
  end

  def edit
    if params[:fdata]
      @event.start_date = event_params["start_date"]
      @event.finish_date = build_finish_date(event_params)
    end
    load_related_data
  end

  def update
    update_service = Events::UpdateService.new current_user, @event, params
    respond_to do |format|
      if update_service.perform
        format.html do
          flash[:success] =  t("events.flashs.updated")
          redirect_to root_path
        end
        format.json do
          render json: update_service.event, serializer: EventSerializer,
            meta: t("events.flashs.updated"), meta_key: :message, status: :ok
        end
      elsif @is_overlap = update_service.is_overlap
        format.json{render json: {is_overlap: @is_overlap}}
      else
        format.json{render json: {error: "Error"}, status: 422}
      end
    end
  end

  def destroy
    delete_service = Events::DeleteService.new current_user, @event, params
    respond_to do |format|
      if delete_service.perform
        format.html do
          flash[:success] = t "events.flashs.deleted"
          redirect_to root_path
        end
        format.json{render json: {message: t("events.flashs.deleted")}, status: :ok}
      else
        format.html do
          flash[:danger] = t "events.flashs.not_deleted"
          redirect_to root_path
        end
        format.json{render json: {message: t("events.flashs.not_deleted")}}
      end
    end
  end

  private

  def event_params
    params.require(:event).permit Event::ATTRIBUTES_PARAMS
  end

  def load_calendars
    @calendars = current_user.manage_calendars
  end

  def load_related_data
    Notification.all.each do |notification|
      @event.notification_events.find_or_initialize_by notification: notification
    end

    DaysOfWeek.all.each do |days_of_week|
      @event.repeat_ons.find_or_initialize_by days_of_week: days_of_week
    end

    @repeat_ons = @event.repeat_ons.sort{|a, b| a.days_of_week_id <=> b.days_of_week_id}
  end

  def build_finish_date hparams
    return @event.start_date.end_of_day if @event.all_day?
    hparams["finish_date"]
  end

  def build_event_params
    begin
      response = JSON.parse(Base64.decode64 params[:fdata])
      params[:event] = response
    rescue JSON::ParserError => e
      params[:event] = {}
    end
  end
end
