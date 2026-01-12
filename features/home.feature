Feature: Home Page
  As a user of Liftoff
  I want to see the home page
  So that I can start tracking my workouts

  Scenario: View home page
    Given I am on the home page
    Then I should see a heading
    And the page should be loaded

  Scenario: Page loads successfully
    Given I navigate to "/"
    Then the page title should be visible
