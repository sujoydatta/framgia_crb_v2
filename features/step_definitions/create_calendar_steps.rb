When(/^I fill in number of seats$/) do
  fill_in("calendar_number_of_seats", with: "10")
end

When(/^I give google calendar url$/) do
  fill_in("calendar_google_calendar_id", with: "http://fhn-mtg-rooms.surge.sh/")
end

When(/^I check auto push event to google calendar$/) do
  check("calendar_is_auto_push_to_google_calendar")
end

When(/^I check allow overlap time events$/) do
  check("calendar_is_allow_overlap")
end

When(/^I give the description of the calendar$/) do
  fill_in("calendar_description", with: "Meeting with valuable client in JP")
end

When(/^I make the calendar public$/) do
  check("make_public")
end

When(/^I hide details$/) do
  check("free_busy")
end

Then(/^My current page will be create calendar path$/) do
  expect(page).to have_current_path new_calendar_path
end
