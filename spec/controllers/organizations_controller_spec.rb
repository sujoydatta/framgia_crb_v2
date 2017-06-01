require "rails_helper"
require "devise"

RSpec.describe OrganizationsController, type: :controller do
  let!(:user){FactoryGirl.create :user}
  let!(:organization){FactoryGirl.create :organization, creator_id: user.id}
  before do
    sign_in user
  end
  describe "POST #create" do
    it "create success" do
      expect do
        post :create, params: {organization: FactoryGirl.attributes_for(:organization)}
        expect(controller).to set_flash[:success].to(I18n.t "organizations.create.created")
        expect(response).to redirect_to action: :show, id: assigns(:organization).slug
      end.to change(Organization, :count).by 1
    end
  end
  describe "GET #show/:id" do
    before{get :show, params: {id: organization.slug}}
    it "have status 200" do
      expect(response).to have_http_status(200)
    end
    it "render template show" do
      expect(response).to render_template(:show)
    end
  end
  describe "GET #new" do
    it "render new template" do
      get :new
      expect(response).to render_template(:new)
    end
  end
  describe "GET #edit" do
    it "render edit template" do
      get :edit, params: {id: organization.slug}
      expect(response).to render_template(:edit)
    end
  end

  describe "PATCH #update" do
    it "save success" do
      patch :update, params: {id: organization.slug,
        organization: FactoryGirl.attributes_for(:organization)}
      expect(response).to redirect_to action: :show, id: assigns(:organization).slug
    end
  end

  describe "DELETE #destroy" do
    it "delete success" do
      expect do
        delete :destroy, params: {id: organization.slug}
        expect(controller).to set_flash[:success]
          .to(I18n.t "organizations.destroy.deleted")
      end.to change(Organization, :count).by -1
    end
  end
end
