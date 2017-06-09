require File.expand_path(File.join(File.dirname(__FILE__), "..",
  "support", "paths"))

Given(/^I am on (.+)$/) do |page_name|
  visit path_to(page_name)
end

Then(/^I should see "([^"]*)"$/) do |text|
  expect(page).to have_content(text)
end

When(/^I fill in "([^"]*)" with "([^"]*)"$/) do |attribute, value|
  fill_in(attribute, with: value)
end

When(/^I select "([^"]*)" from "([^"]*)"$/) do |value, selector|
  select value, from: selector
end

When(/^I press "([^"]*)"$/) do |button|
  click_button button
end
