Given(/^The user is on the profile page$/) do
  visit user_path(@user)
end

When(/^A user give the desired information$/) do
  fill_in "name", with: "Miraj"
end

When(/^The user give the email$/) do
  fill_in("user_email", with: "m@m.com")
end

When(/^User give the write current password$/) do
  fill_in("user_current_password", with: "12345678")
end

When(/^User give wrong current password$/) do
  fill_in("user_current_password", with: "454564564")
end

When(/^User removes the email from the textbox$/) do
  fill_in("user_email", with: "")
end
