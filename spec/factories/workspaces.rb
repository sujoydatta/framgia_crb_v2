require "ffaker"

FactoryGirl.define do
  factory :workspace do
    name {FFaker::Name.name}
  end
end
