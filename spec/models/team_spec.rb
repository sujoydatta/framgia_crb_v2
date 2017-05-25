require "rails_helper"

RSpec.describe Team, type: :model do
  subject {FactoryGirl.create :team}

  describe "associations" do
    it "belongs_to organization" do
      expect(subject).to belong_to :organization
    end

    it "has_many user_teams" do
      expect(subject).to have_many(:user_teams).dependent :destroy
    end

    it "has_many users" do
      expect(subject).to have_many(:users).through "user_teams"
    end

    it "has_many event_teams" do
      expect(subject).to have_many(:event_teams).dependent :destroy
    end

    it "has_many events" do
      expect(subject).to have_many(:events).through "event_teams"
    end
  end

  describe "validations" do
    it "name should present" do
      expect validate_presence_of subject.name
    end

    it "length should be maximum 50" do
      expect validate_length_of(subject.name).is_at_most 50
    end

    it "validate with name validator" do
      expect validate_uniqueness_of(subject.name).case_insensitive
    end
  end

  describe "delegate" do
    it{should delegate_method(:name).to(:organization).with_prefix(true)}
  end
end
