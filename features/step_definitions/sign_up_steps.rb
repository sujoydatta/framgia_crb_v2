Given(/^I have no users$/) do
  User.delete_all
end

When(/^I follow "([^"]*)"$/) do |button|
  find(button, text: "Sign up").click
end

Then(/^I should have (\d+) user with name "([^"]*)" and email "([^"]*)"$/) do
  |number, name, email|
  expect(User.count).to eq number.to_i
  expect(User.last.name).to eq name
  expect(User.last.email).to eq email
end
