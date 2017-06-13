Feature: signin

@javascript
Scenario: sign in in the system
  Given I have 1 user with email "m@m.com" and password "12345678"
  And I am on the homepage
  When I follow "a.header-item-link.header-nav-item" link
  And I fill in "user_email" with "m@m.com"
  And I fill in "user_password" with "12345678"
  And I press "Sign in"
  Then I should see "My Calendars"
