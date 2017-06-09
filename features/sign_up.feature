Feature: signup

Scenario: sign up in the system
  Given I have no users
  And I am on the homepage
  When I follow "a.header-item-link.header-nav-item"
  And I fill in "signup_name" with "Miraj"
  And I fill in "signup_email" with "m@m.com"
  And I fill in "signup_password" with "12345678"
  And I fill in "signup_password_confirmation" with "12345678"
  And I select "(GMT+06:00) Dhaka" from "user_setting_attributes_timezone_name"
  And I select "Bangladesh" from "user_setting_attributes_country"
  And I press "Sign up"
  Then I should see "Welcome! You have signed up successfully."
  And I should have 1 user with name "Miraj" and email "m@m.com"
