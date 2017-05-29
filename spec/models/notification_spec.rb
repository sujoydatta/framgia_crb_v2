require "rails_helper"

RSpec.describe Notification, type: :model do
  it{should have_many(:notification_events).dependent :destroy}
  it{should have_many :events}

  it "should have a valid fabricator" do
    expect(Fabricate :notification).to be_valid
  end
end
