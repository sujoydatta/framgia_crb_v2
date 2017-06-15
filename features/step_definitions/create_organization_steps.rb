When(/^I add workspace with name "([^"]*)" and address "([^"]*)"$/) do |name, address|
  find("a.btn.btn-primary").click
  within ".fieldset-workspace" do
    fill_in "Name", with: name
    fill_in "Address", with: address
  end
end

Then(/^I should have my last organization with name "([^"]*)"$/) do |name|
  expect(Organization.last.name).to eq name
end

Then(/^I should have created a workspace for name "([^"]*)" and address "([^"]*)" for the created organization$/) do |name, address|
  expect(Workspace.last.name).to eq name
  expect(Workspace.last.address).to eq address
  expect(Workspace.last.organization).to eq Organization.last
end
