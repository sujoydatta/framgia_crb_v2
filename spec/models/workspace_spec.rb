require "rails_helper"

RSpec.describe Workspace, type: :model do
  subject {FactoryGirl.create :workspace}

  describe "associations" do
    it "has many calendars" do
      expect(subject).to have_many :calendars
    end

    it "belongs_to organization" do
      expect(subject).to belong_to :organization
    end
  end

  describe "delegate" do
    it{should delegate_method(:name).to(:organization)
      .with_prefix(true).with_arguments(allow_nil: true)}
  end
end
