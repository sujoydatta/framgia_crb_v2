Feature: create organization

Background:
  Given I am signed in into the system as "test@framgia.com"

@javascript
Scenario: User create a calendar giving all attribute's values
  When I am on new calendar creation page
  And I fill in "name" with "test_calendar"
  And I fill in number of seats
  And I give google calendar url
  And I check auto push event to google calendar
  And I check allow overlap time events
  And I give the description of the calendar
  And I make the calendar public
  And I hide details
  And I choose "test@framgia.com <test>" from "#select2-textbox-email-share-container" selector
  And I press "Save"
  Then I should see "Calendar was created"
  And I am on the homepage

@javascript
Scenario: User create a calendar just giving the calendar's name
  When I am on new calendar creation page
  And I fill in "name" with "test_calendar"
  And I press "Save"
  Then I should see "Calendar was created"
  And I am on the homepage

@javascript
Scenario: User can't create a calendar without giving the calendar's name
  When I am on new calendar creation page
  And I fill in "name" with ""
  And I press "Save"
  And My current page will be create calendar path
