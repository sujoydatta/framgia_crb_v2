require "rails_helper"

RSpec.describe CheckNamesController, type: :controller do
  let!(:user){FactoryGirl.create :user, name: "Framgia"}

  describe "GET #show" do

    it "should valid success" do
      get :show, params: {name: "FramgiaEdu"}
      expect(response).to have_http_status(201)
    end

    it "should valid faild messages name is already taken" do
      get :show, params: {name: "Framgia"}
      expect(response).to have_http_status(422)
      expect(response.body).to include I18n.t("validator.name.is_taken")
    end

    it "should valid faild messages name too long" do
      get :show, params: {name: "FramgiaEdu111111111111111111111111111111"}
      expect(response).to have_http_status(422)
      expect(response.body).to include I18n.t("validator.name.too_length")
    end

    it "should valid faild messages not match regex" do
      get :show, params: {name: "FramgiaEdu-"}
      expect(response).to have_http_status(422)
      expect(response.body).to include I18n.t("validator.name.not_valid_format")
    end
  end
end
