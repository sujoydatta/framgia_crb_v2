require "rails_helper"

RSpec.describe Color, type: :model do
  it{should have_many :calendars}
  it{should have_many :user_calendars}

  it "should have a valid fabricator" do
    expect(Fabricate :color).to be_valid
  end
end
