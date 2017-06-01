require "ffaker"

FactoryGirl.define do
  factory :calendar do
    creator_id 1
    name {FFaker::Name.name}
    owner_id 1
    owner_type "User"
    address {FFaker::Address.neighborhood}
  end
end
