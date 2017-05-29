require "rails_helper"

RSpec.describe NotificationEvent, type: :model do
  it{should belong_to :notification}
  it{should belong_to :event}
  it{should delegate_method(:notification_type).to(:notification)
    .with_arguments allow_nil: true}

  it "should have a valid fabricator" do
    user = Fabricate :user
    calendar = Fabricate :calendar, owner: user
    event = Fabricate :event, user_id: user.id, calendar: calendar
    expect(Fabricate :notification_event, event: event).to be_valid
  end
end
