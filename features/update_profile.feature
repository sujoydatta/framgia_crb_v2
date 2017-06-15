Feature: User update his profile

Background:
  Given I am signed in into the system as "test@framgia.com"

@javascript
Scenario: Successfully update his profile
  And The user is on the profile page
  When A user give the desired information
  And The user give the email
  And User give the write current password
  And I choose "(GMT-11:00) American Samoa" from "#select2-user_setting_attributes_timezone_name-container" selector
  And I choose "scheduler" from "#select2-user_setting_attributes_default_view-container" selector
  And I choose "Afghanistan" from "#select2-user_setting_attributes_country-container" selector
  And I press "Save"
  Then I should see "Your account has been updated successfully"

@javascript
Scenario: User can't update due to wrong current password
  And The user is on the profile page
  When A user give the desired information
  And The user give the email
  And User give wrong current password
  And I choose "(GMT-11:00) American Samoa" from "#select2-user_setting_attributes_timezone_name-container" selector
  And I choose "scheduler" from "#select2-user_setting_attributes_default_view-container" selector
  And I choose "Afghanistan" from "#select2-user_setting_attributes_country-container" selector
  And I press "Save"
  Then I should see "Current password is invalid"

@javascript
Scenario: User can't update email is removed
  And The user is on the profile page
  When A user give the desired information
  And User removes the email from the textbox
  And User give the write current password
  And I choose "(GMT-11:00) American Samoa" from "#select2-user_setting_attributes_timezone_name-container" selector
  And I choose "scheduler" from "#select2-user_setting_attributes_default_view-container" selector
  And I choose "Afghanistan" from "#select2-user_setting_attributes_country-container" selector
  And I press "Save"
  Then I should see "Email can't be blank"
