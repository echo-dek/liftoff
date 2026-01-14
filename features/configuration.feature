Feature: Configuration
  
  As a user of Liftoff
  I want to configure the training plans
  So I can tailor the programme to my needs
  
  Scenario: Using the default training plan
    Given I have never used Liftoff before
    When I start Liftoff
    Then the default training plan should be configured
