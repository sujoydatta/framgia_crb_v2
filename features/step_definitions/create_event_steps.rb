Given(/^I create an event with certain start time and end time$/) do
  Fabricate :event, start_date: DateTime.new(2017,7,20,22,0,0), 
    finish_date: DateTime.new(2017,7,20,23,0,0), user_id: User.last.id,
    calendar: Calendar.last, repeat_type: nil, repeat_every: nil
end

Then(/^I have an event with title "([^"]*)" and user_id (\d+) and calendar_id (\d+)$/) do |title, user_id, calendar_id|
  expect(Event.count).to eq 1
  expect(Event.last.title).to eq title
  expect(Event.last.user_id.to_s).to eq user_id
  expect(Event.last.calendar_id.to_s).to eq calendar_id
end

Then(/^I should find a error box with "([^"]*)"$/) do |name|
  element = find name
  expect(element).not_to be_nil
end
