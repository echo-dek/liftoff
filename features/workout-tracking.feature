Feature: Workout Tracking
  As a strength training enthusiast
  I want to track my workouts with progressive overload
  So that I can consistently improve my strength

  Background:
    Given I am on the Liftoff home page

  Scenario: Start a new workout session
    When I tap "Start"
    Then I should see today's date
    And I should see today's exercises

  Scenario: Complete a set with weight tracking
    Given I have started a workout
    And I am on an exercise with weight tracking
    When I confirm the weight
    And I tap "Complete"
    Then the remaining sets should decrease by 1

  Scenario: Progressive overload - weight incrementation (metric)
    Given I have previously completed an exercise with 20kg
    When I start the same exercise again
    Then the suggested weight should be 21kg for metric units

  Scenario: Progressive overload - weight incrementation (imperial)
    Given I have previously completed an exercise with 22.5lb
    When I start the same exercise again
    Then the suggested weight should be 25lb for imperial units

  Scenario: Complete all sets and move to next exercise
    Given I am on an exercise with 3 sets remaining
    When I complete all 3 sets
    Then I should automatically move to the next exercise

  Scenario: Track bodyweight exercises
    Given I am on an exercise without weight tracking
    When I complete the set
    Then I should not be asked to confirm weight
    And the set should be marked as complete
