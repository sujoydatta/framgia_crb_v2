require 'rails_helper'

RSpec.describe UserCalendar, type: :model do
  it{should belong_to :user}
  it{should belong_to :calendar}
  it{should belong_to :permission}
  it{should belong_to :color}
  it{should delegate_method(:sub_calendars).to(:calendar)
    .with_arguments allow_nil: true}
  it{should delegate_method(:email).to(:user).with_prefix(true)
    .with_arguments allow_nil: true}

  describe "#get_user_calendar" do
    let(:user1) {Fabricate :user}
    let(:user2) {Fabricate :user}
    let(:permission) {Fabricate :permission}
    let(:calendar) {Fabricate :calendar, owner: user1}
    let(:user_calendar1) {Fabricate :user_calendar, user: user1,
      calendar: calendar, permission: permission}
    let(:user_calendar2) {Fabricate :user_calendar, user: user2,
      calendar: calendar, permission: permission}

    it "should return correct user_calender for first user" do
      user_calender = UserCalendar.get_user_calendar user1.id, calendar.id
      expect(user_calender).to eq [user_calendar1]
    end

    it "should return correct user_calender for second user" do
      user_calender = UserCalendar.get_user_calendar user2.id, calendar.id
      expect(user_calender).to eq [user_calendar2]
    end
  end
end
