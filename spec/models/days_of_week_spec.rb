require "rails_helper"

RSpec.describe DaysOfWeek, type: :model do
  it{should have_many(:repeat_ons).dependent :destroy}
  it{should have_many(:events)}

  it "should have a valid fabricator" do
    expect(Fabricate :days_of_week).to be_valid
  end
end
