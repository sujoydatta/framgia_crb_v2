require "ffaker"

FactoryGirl.define do
  factory :organization do
    name {FFaker::PhoneNumber.area_code}
    display_name {FFaker::Name}
    creator_id 1
  end
end
