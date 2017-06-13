Given(/^I have (\d+) user with email "([^"]*)" and password "([^"]*)"$/) do
  |number, email, password|
  @user = Fabricate :user, email: email, password: password
  Fabricate :setting, owner_id: @user.id, owner_type: User.name
end

When(/^I follow "([^"]*)" link$/) do |button|
  find(button, text: "Sign in").click
end
