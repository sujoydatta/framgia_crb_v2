class NotificationChannel < ApplicationCable::Channel
  def subscribed
    stream_from "notification_channel_#{current_user.cable_token}"
  end

  def unsubscribed; end
end
