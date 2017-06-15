require File.expand_path(File.join(File.dirname(__FILE__), "..",
  "support", "paths"))

Given(/^I am on (.+)$/) do |page_name|
  visit path_to(page_name)
end

Given(/^I am signed in into the system as "([^"]*)"$/) do |email|
  @user = Fabricate :user, email: email, password: "12345678"
  Fabricate :setting, owner_id: @user.id, owner_type: User.name
  login_as @user, scope: :user
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

# To test javascript select2 selector
When(/^I choose "([^"]*)" from "([^"]*)" selector$/) do |option, selector2|
  find(selector2, visible: :all).click
  within ".select2-results" do
    find("li", text: option).click
  end
end

When(/^I press "([^"]*)"$/) do |button|
  click_button button
end
