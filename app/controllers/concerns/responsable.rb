module Responsable
  module Event
    def response_create_success service, format
      format.html do
        flash[:success] = t "events.flashs.created"
        redirect_to root_path
      end
      format.json do
        render json: service.event, serializer: EventSerializer, status: :ok
      end
    end

    def response_create_fail service, format
      if @is_overlap = service.is_overlap
        flash[:error] = t "events.flashs.overlap"
        format.html{redirect_to :back}
      else
        format.html{render :new}
      end
      format.json do
        render json: {
          is_overlap: @is_overlap,
          is_errors: service.event.errors.any?
        }
      end
    end

    def response_update_success service, format
      format.html do
        flash[:success] = t("events.flashs.updated")
        redirect_to root_path
      end
      format.json do
        render json: service.event, serializer: EventSerializer, status: :ok
      end
    end

    def response_update_fail service, format
      if @is_overlap = service.is_overlap
        format.html do
          flash[:danger].now = t("events.flashs.overlap")
          render :edit
        end
        format.json{render json: {is_overlap: @is_overlap}, status: 422}
      else
        format.html do
          flash[:danger] = t("events.flashs.not_updated")
          redirect_to :back
        end
        format.json{render json: {error: "Error"}, status: 422}
      end
    end

    def response_destroy service, format
      if service.perform
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
end
