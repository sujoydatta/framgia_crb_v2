require 'rails_helper'

RSpec.describe Attendee, type: :model do
  it{should belong_to :user}
  it{should belong_to :event}
  it{should delegate_method(:name).to(:user).with_prefix(:user)
    .with_arguments allow_nil: true}
  it{should delegate_method(:id).to(:user).with_prefix :attendee}
  it{should delegate_method(:chatwork_id).to(:user)
    .with_arguments allow_nil: true}

  describe "#attendee_email" do
    let(:user) {Fabricate :user}
    let(:calendar) {Fabricate :calendar, owner: user}
    let(:event) {Fabricate :event, user_id: user.id, calendar: calendar}
    let(:attendee1) {Fabricate :attendee, user: user, event: event}
    let(:attendee2) {Fabricate :attendee, user: nil, event: event}

    it "should return user email if attendee has a user" do
      expect(attendee1.attendee_email).to eq user.email
    end

    it "should return self email if attendee has no user" do
      expect(attendee2.attendee_email).to eq attendee2.email
    end
  end
end
