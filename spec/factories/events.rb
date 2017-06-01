require "ffaker"

FactoryGirl.define do
  factory :event do
    title {FFaker::Book.title}
    calendar_id 1
    start_date {FFaker::Time.datetime}
    finish_date {FFaker::Time.datetime}
  end
end
