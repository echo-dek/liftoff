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

  Scenario: Completing a day's worth of exercises
    Given Liftoff is configured with the following plan:
      | Phase         | Day           | Exercise          | Sets          | Reps          | Weights         |
      | 1             | 1             | Overhead Press    | 3             | 5             | true            |
      | 1             | 1             | Dumbbell Row      | 3             | 5             | true            |
      | 1             | 2             | Dumbbell Squat    | 3             | 8             | true            |
      | 1             | 2             | Lat Pulldown      | 3             | 5             | true            |
    And I have not recorded any exercises
    When I start Liftoff
    And I press the "Start" button
    And I tap "Overhead Press"
    And I start the "Overhead Press" using 10kg of weights and complete 3 sets
    Then I should see "Dumbbell Row" page
    When I start the "Dumbbell Row" using 15kg of weights and complete 3 sets
    Then I should see a congratulations message plus a summary of today's exercises

  Scenario: Completing two day's worth of exercises
    Given Liftoff is configured with the following plan:
      | Phase         | Day           | Exercise          | Sets          | Reps          | Weights         |
      | 1             | 1             | Overhead Press    | 3             | 5             | true            |
      | 1             | 1             | Dumbbell Row      | 3             | 5             | true            |
      | 1             | 2             | Dumbbell Squat    | 3             | 8             | true            |
      | 1             | 2             | Lat Pulldown      | 3             | 5             | true            |
    And yesterday I recorded my day 1 exercises
    When I start Liftoff
    And I press the "Start" button
    Then I should see today's date plus the exercises for Phase 1 and Day 2
    When I tap "Dumbbell Squat"
    And I start the "Dumbbell Squat" using 20kg of weights and complete 3 sets
    Then I should see "Lat Pulldown" page
    When I start the "Lat Pulldown" using 40kg of weights and complete 3 sets
    Then I should see a congratulations message plus a summary of today's exercises

  Scenario: Continuing with a phase
    Given Liftoff is configured with the following plan:
      | Phase         | Day           | Exercise          | Sets          | Reps          | Weights         |
      | 1             | 1             | Overhead Press    | 3             | 5             | true            |
      | 1             | 2             | Dumbbell Row      | 3             | 5             | true            |
      | 2             | 1             | Dumbbell Squat    | 3             | 8             | true            |
      | 1             | 2             | Lat Pulldown      | 3             | 5             | true            |
    And I have recorded exercises for phase 1, days 1 and 2
    When I start Liftoff
    And I press the "Start" button
    Then I should see today's date plus a button to "Continue with Phase 1"
    When I tap "Continue with Phase 1"
    Then I should see the "Overhead Press" page

  Scenario: Moving to the next phase
    Given Liftoff is configured with the following plan:
      | Phase         | Day           | Exercise          | Sets          | Reps          | Weights         |
      | 1             | 1             | Overhead Press    | 3             | 5             | true            |
      | 1             | 2             | Dumbbell Row      | 3             | 5             | true            |
      | 2             | 1             | Dumbbell Squat    | 3             | 8             | true            |
      | 1             | 2             | Lat Pulldown      | 3             | 5             | true            |
    And I have recorded exercises for phase 1, days 1 and 2
    When I start Liftoff
    And I press the "Start" button
    Then I should see today's date plus a button to "Start Phase 2"
    When I tap "Start Phase 2"
    Then I should see the "Dumbbell Squat" page

  Scenario: Moving forwards through the plan
    Given Liftoff is configured with the following plan:
      | Phase         | Day           | Exercise          | Sets          | Reps          | Weights         |
      | 1             | 1             | Overhead Press    | 3             | 5             | true            |
      | 1             | 1             | Dumbbell Row      | 3             | 5             | true            |
      | 1             | 2             | Dumbbell Squat    | 3             | 8             | true            |
      | 1             | 2             | Lat Pulldown      | 3             | 5             | true            |
      | 1             | 3             | Bench Press       | 3             | 5             | true            |
      | 1             | 3             | Barbell Row       | 3             | 5             | true            |
    And I have not recorded any exercises
    When I start Liftoff
    And I press the "Start" button
    Then I should see today's date plus the exercises for Phase 1 and Day 1
    When I tap "Navigate to Day 3"
    Then I should see the exercises for Phase 1 and Day 3
    When I tap "Bench Press"
    And I start the "Bench Press" using 40kg of weights and complete 3 sets
    Then I should see "Barbell Row" page
    When I start the "Barbell Row" using 30kg of weights and complete 3 sets
    Then I should see a congratulations message plus a summary of today's exercises
    When I close Liftoff and open it again the next day
    And I press the "Start" button
    Then I should see the exercises for Phase 1 and Day 1

  Scenario: Moving backwards through the plan
    Given Liftoff is configured with the following plan:
      | Phase         | Day           | Exercise          | Sets          | Reps          | Weights         |
      | 1             | 1             | Overhead Press    | 3             | 5             | true            |
      | 1             | 1             | Dumbbell Row      | 3             | 5             | true            |
      | 1             | 2             | Dumbbell Squat    | 3             | 8             | true            |
      | 1             | 2             | Lat Pulldown      | 3             | 5             | true            |
      | 1             | 3             | Bench Press       | 3             | 5             | true            |
      | 1             | 3             | Barbell Row       | 3             | 5             | true            |
    And I have recorded exercises for phase 1, day 1
    And I have recorded exercises for phase 1, day 2
    When I start Liftoff
    And I press the "Start" button
    Then I should see today's date plus the exercises for Phase 1 and Day 3
    When I tap "Navigate to Day 1"
    Then I should see the exercises for Phase 1 and Day 1
    When I tap "Overhead Press"
    And I start the "Overhead Press" using 10kg of weights and complete 3 sets
    Then I should see "Dumbbell Row" page
    When I start the "Dumbbell Row" using 15kg of weights and complete 3 sets
    Then I should see a congratulations message plus a summary of today's exercises
    When I close Liftoff and open it again the next day
    And I press the "Start" button
    Then I should see the exercises for Phase 1 and Day 2

