require "rails_helper"

RSpec.describe RepeatOn, type: :model do
  it{should belong_to :days_of_week}
  it{should belong_to :event}

  it "should have a valid fabricator" do
    user = Fabricate :user
    calendar = Fabricate :calendar, owner: user
    event = Fabricate :event, user_id: user.id, calendar: calendar
    expect(Fabricate :repeat_on, event: event).to be_valid
  end
end
