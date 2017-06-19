Feature: User change his password

Background:
  Given I am signed in into the system as "test@framgia.com"

@javascript
Scenario: Successfully update his password
  And The user is on the profile page
  When I press "Change password"
  And The user give the new password
  And User give the retype the new password
  And User give the current password
  And I press "Update"
  And Then user will confirm the change by pressing on the ok button
  Then I should see "Your account has been updated successfully."

@javascript
Scenario: User can't update his password due to wrong current password
  And The user is on the profile page
  When I press "Change password"
  And The user give the new password
  And User give the retype the new password
  And User give the wrong current password
  And I press "Update"
  And Then user will confirm the change by pressing on the ok button
  Then I should see "Current password is invalid"

@javascript
Scenario: User can't update his password due to the new password mismatch
  And The user is on the profile page
  When I press "Change password"
  And The user give the new password
  And User give the retype different new password
  And User give the current password
  And I press "Update"
  And Then user will confirm the change by pressing on the ok button
  Then I should see "Password confirmation doesn't match Password"
