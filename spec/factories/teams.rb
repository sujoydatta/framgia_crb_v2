require "ffaker"

FactoryGirl.define do
  factory :team do
    name {FFaker::Name.name}
  end
end
