class SearchUserService
  def initialize p
    @params = p
  end

  def search
    if @params[:user_attribute].blank?
      @users = nil
    else
      @organization = Organization.find @params[:org_slug]
      @user_org = User.accepted_invite @organization.id
      @users = User.search_name_or_email(@params[:user_attribute]).where.not id: @user_org
    end
    @users
  end
end
