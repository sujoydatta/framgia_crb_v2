require "rails_helper"
require "devise"

RSpec.describe ParticularCalendarsController, type: :controller do
  let!(:user){FactoryGirl.create :user}
  let!(:calendar){FactoryGirl.create :calendar, owner: user, creator: user}

  describe "GET show" do
    before{sign_in user}
    before{get :show, params: {id: calendar.id}}
    let(:user_calendar){UserCalendar.find_by user: user, calendar: calendar}
    it "render show template" do
      expect(response).to render_template :show
    end
    it "have status 200" do
     expect(response).to have_http_status(200)
    end
  end

  describe "PATCH update" do
    context "request format json" do
      it "return json" do
        patch :update, params: {id: calendar.id, user_calendar: {user_id: 1, calendar_id: 1}}, format: :json
        expect(response.content_type).to eq "application/json"
      end
      it "update success" do
        sign_in user
        patch :update, params: {id: calendar.id, user_calendar: {user_id: 1, calendar_id: 1}}, format: :json
        expect(response.body).to include(assigns(:user_calendar).to_json)
      end
      it "update failed" do
        patch :update, params: {id: calendar.id, user_calendar: {user_id: 1, calendar_id: 1}}, format: :json
        expect(response.status).to eq(401)
      end
    end

    context "request format html" do
      before{sign_in user}
      before{patch :update, params: {id: calendar.id, user_calendar: {user_id: 1, calendar_id: 1}}}
      it "have status code 302 redirect" do
        expect(response).to have_http_status(302)
      end
      it "return html" do
        expect(response.content_type).to eq "text/html"
      end
    end
  end
end
