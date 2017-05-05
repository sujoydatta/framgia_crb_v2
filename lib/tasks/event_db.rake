namespace :event_db do
  desc "remake database data"
  task make_data: :environment do
    time_now = Time.zone.now
  end
end
