Feature: Tracking Progress
  As a user of Liftoff
  I want to track my progress 
  So I can become swole

  Scenario: Performing a single exercise 
    Given Liftoff is configured with the following plan:
      | Phase         | Day           | Exercise          | Sets          | Reps          | Weights         |
      | 1             | 1             | Overhead Press    | 3             | 5             | true            |
      | 1             | 1             | Dumbbell Row      | 3             | 5             | true            |
    And I have not recorded any exercises
    When I start Liftoff
    Then I should see the "Start" button
    When I press the "Start" button
    Then I should see today's date plus the exercises for Phase 1 and Day 1
    When I tap "Overhead Press"
    And I enter 10kg for the weights I am using
    And I press the "Start Overhead Press" button
    Then I should see the "Overhead Press" page 
    And I should see the sets counter showing 3 sets remaining
    When I tap "Set Complete"
    Then the sets counter should show 2 sets remaining
    When I tap "Set Complete"
    Then the sets counter should show 1 set remaining
    When I tap "Set Complete"
    Then the sets counter should show "Overhead Press completed" with a celebratory animation
    When 3 seconds have passed
    Then the "Overhead Press" page should animate away
    And I should see "Dumbbell Row" page
