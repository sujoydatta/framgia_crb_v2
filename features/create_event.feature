@javascript
Feature: create event

Background:
  Given I am signed in into the system as "test@framgia.com"

Scenario: create an successful event in the system
  When I am on new event creation path
  And I fill in "event_title" with "Meeting"
  And I select "current" date in "#start_date"
  And I select "3:00pm" time in "#start_time"
  And I select "4:00pm" time in "#finish_time"
  And I choose "test" from "#select2-event_calendar_id-container" selector
  And I fill in "event_description" with "Very Urgent!!"
  And I press "Save"
  Then I should see "Meeting"
  And I have an event with title "Meeting" and user_id 1 and calendar_id 1

Scenario: event create cancelled due to overlap
  And I create an event with certain start time and end time
  When I am on new event creation path
  And I fill in "event_title" with "Meeting 2"
  And I select "20/7/2017" date in "#start_date"
  And I select "11:00am" time in "#start_time"
  And I select "12:00pm" time in "#finish_time"
  And I choose "test" from "#select2-event_calendar_id-container" selector
  And I fill in "event_description" with "Very Very Urgent!!"
  And I press "Save"
  Then I should find a error box with "#ui-id-2"
  And I should see "Event overlap time!"
