Feature: create organization

Background:
  Given I am signed in into the system as "test@framgia.com"

@javascript
Scenario: create an organization in the system
  When I am on new organization creation page
  And I fill in "organization_name" with "framgia"
  And I choose "Hanoi" from "#select2-organization_setting_attributes_timezone_name-container" selector
  And I choose "calendar" from "#select2-organization_setting_attributes_default_view-container" selector
  And I choose "Viet Nam" from "#select2-organization_setting_attributes_country-container" selector
  And I add workspace with name "FPH" and address "Phillipines"
  And I press "Save"
  Then I should see "Organization has been created successfully"
  And I should have my last organization with name "framgia"
  And I should have created a workspace for name "FPH" and address "Phillipines" for the created organization
