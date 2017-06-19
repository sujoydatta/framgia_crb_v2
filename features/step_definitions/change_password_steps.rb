When(/^The user give the new password$/) do
  fill_in "user_password", with: "11111111"
end

When(/^User give the retype the new password$/) do
  fill_in"user_password_confirmation", with: "11111111"
end

When(/^User give the current password$/) do
  within ".modal-content" do
    fill_in "user_current_password", with: "12345678"
  end
end

When(/^Then user will confirm the change by pressing on the ok button$/) do
  page.driver.browser.switch_to.alert.accept
end

When(/^User give the wrong current password$/) do
  within ".modal-content" do
    fill_in "user_current_password", with: "12345666"
  end
end

When(/^User give the retype different new password$/) do
  fill_in "user_password_confirmation", with: "12222222"
end
