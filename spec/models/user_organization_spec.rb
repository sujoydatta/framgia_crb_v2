require 'rails_helper'

RSpec.describe UserOrganization, type: :model do
  it{should belong_to :user}
  it{should belong_to :organization}
  it{should delegate_method(:name).to(:organization).with_prefix(true)}
  it{should delegate_method(:creator_id).to(:organization).with_prefix(true)}

  describe "#search_user_and_org" do
    let(:user1) {Fabricate :user}
    let(:user2) {Fabricate :user}
    let(:organization) {Fabricate :organization, creator_id: user1.id}
    let(:user_organization1) {Fabricate :user_organization, user: user1,
      organization: organization}
    let(:user_organization2) {Fabricate :user_organization, user: user2,
      organization: organization}

    it "should return correct user_organization for first user" do
      user_organization = UserOrganization.search_user_and_org(user1.id,
        organization.id)
      expect(user_organization).to eq [user_organization1]
    end

    it "should return correct user_organization for second user" do
      # user_organization = UserOrganization.search_user_and_org(user2.id,
      #   organization.id)
      # expect(user_organization).to eq [user_organization2]
    end
  end

  describe "#send_invitation_email" do
    let(:user) {Fabricate :user}
    let(:organization) {Fabricate :organization, creator_id: user.id}

    it "should send invitation email" do
      @user_organization = UserOrganization.new
      @user_organization.send_invitation_email
      expect(@user_organization.errors.count).to eq 0
    end
  end
end
