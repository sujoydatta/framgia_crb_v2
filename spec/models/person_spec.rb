require "rails_helper"

RSpec.describe Person, type: :model do
  subject {FactoryGirl.build :person, name: "Framgia"}

  describe "validations" do
    let!(:user) {FactoryGirl.create :user, name: "Crb"}
    let!(:person1) {FactoryGirl.build :person, name: "Framgia-"}
    let!(:person2) {FactoryGirl.build :person, name: "Framgia111111111111111111111111111111111"}
    let!(:person3) {FactoryGirl.build :person, name: "Crb"}

    it "should valid" do
      expect(subject).to be_valid
    end

    it "should not vaild with messages not match regex" do
      expect(person1).not_to be_valid
      expect(person1.errors.full_messages).to include("Name may only contain alphanumeric characters or single hyphens, and cannot begin or end with a hyphen")
    end

    it "should not vaild with messages name too long" do
      expect(person2).not_to be_valid
      expect(person2.errors.full_messages).to include("Name is too long (maximum is 39 characters)")
    end

    it "should not vaild with messages name is already taken" do
      expect(person3).not_to be_valid
      expect(person3.errors.full_messages).to include("Name is already taken")
    end
  end
end
