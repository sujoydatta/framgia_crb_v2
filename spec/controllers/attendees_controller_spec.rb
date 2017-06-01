require "rails_helper"
require "devise"

RSpec.describe AttendeesController, type: :controller do
  let!(:user){FactoryGirl.create :user}
  let!(:other_user){FactoryGirl.create :user}
  let!(:calendar) {FactoryGirl.create :calendar, owner: user}
  let!(:event){FactoryGirl.create :event, calendar_id: calendar.id}
  let!(:attendee){FactoryGirl.create :attendee, user_id: other_user.id, event_id: event.id}

  before do
    sign_in user
  end

  describe "POST #create" do
    it "create sucess" do
      expect do
        post :create, params: {attendee: FactoryGirl.attributes_for(:attendee)},
          format: :js
      end.to change(Attendee, :count).by 1
    end
  end

  describe "DELETE #destroy" do
    it "delete success" do
      expect do
        delete :destroy, params: {id: attendee.id}, format: :js
      end.to change(Attendee, :count).by -1
    end
  end
end
