require 'rails_helper'

RSpec.describe UserOrganization, type: :model do
  it{should belong_to :user}
  it{should belong_to :organization}
  it{should delegate_method(:name).to(:organization).with_prefix(true)}
  it{should delegate_method(:creator_id).to(:organization).with_prefix(true)}

  describe "#send_invitation_email" do
    let(:user) {Fabricate :user}
    let(:organization) {Fabricate :organization, creator_id: user.id}

    it "should send invitation email" do
      # @user_organization = UserOrganization.new
      # @user_organization.send_invitation_email
      # expect(@user_organization.errors.count).to eq 0
    end
  end
end
