require "ffaker"

FactoryGirl.define do
  factory :attendee do
    email {FFaker::Internet.email}
    user_id 1
    event_id 1
  end
end
