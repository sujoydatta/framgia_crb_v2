require "rails_helper"

RSpec.describe EventTeam, type: :model do
  it{should belong_to :event}
  it{should belong_to :team}

  it "should have a valid fabricator" do
    user = Fabricate :user
    calendar = Fabricate :calendar, owner: user
    event = Fabricate :event, user_id: user.id, calendar: calendar
    expect(Fabricate :event_team, event: event).to be_valid
  end
end
