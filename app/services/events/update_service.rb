module Events
  class UpdateService
    include MakeActivity

    attr_accessor :is_overlap, :event

    def initialize user, event, params
      @user = user
      @event = event
      @params = params
      @event_handler = Event.new handle_event_params
    end

    def perform
      modify_repeat_params if @params[:repeat].blank?
      @params[:event] = @params[:event].merge({
        exception_time: event_params[:start_date],
        start_repeat: start_repeat,
        end_repeat: end_repeat
      })

      if changed_time? && is_overlap? && not_allow_overlap?
        return false
      else
        exception_service = Events::ExceptionService.new(@event, @params)

        if exception_service.perform
          @event = exception_service.new_event
          make_activity @user, @event, :update
          return true
        else
          return false
        end
      end
    end

    private
    def event_params
      @params.require(:event).permit Event::ATTRIBUTES_PARAMS
    end

    def handle_event_params
      @params.require(:event).permit Event::ATTRIBUTES_PARAMS[1..-2]
    end

    def modify_repeat_params
      Event::REPEAT_PARAMS.each{|attribute| @params[:event].delete attribute}
    end

    def is_overlap?
      @event_handler.parent_id = @event.parent? ? @event.id : @event.parent_id
      @event_handler.calendar_id = @event.calendar_id
      overlap_time_handler = OverlapTimeHandler.new(@event_handler)
      self.is_overlap = overlap_time_handler.valid?
    end

    def not_allow_overlap?
      @params[:allow_overlap] != "true"
    end

    def start_repeat
      event_params[:start_repeat] || event_params[:start_date]
    end

    def end_repeat
      event_params[:end_repeat] || @event.end_repeat
    end

    def changed_time?
      @event.start_date != @event_handler.start_date
    end
  end
end
