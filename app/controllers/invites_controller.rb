class InvitesController < ApplicationController
  before_action :check_invite_permission, only: :show

  def show
    @user_organization = UserOrganization.new
    @users = User.can_invite_to_organization params[:organization_id]
  end

  private

  def check_invite_permission
    @organization = Organization.find_by slug: params[:organization_id]
    @user_organization = UserOrganization.find_by user: current_user,
      organization: @organization

    if @user_organization.nil? || @user_organization.waiting?
      redirect_to organizations_path, notice: t(".no_permission")
    end
  end
end
