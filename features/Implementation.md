# Implementing a feature

Key principles:
- Do not write more code than is required - YAGNI (you aren't going to need it)
- Start from the "outside" of the system (the user's view) and work inwards (the database or other system components)
- Use the test-first development to drive the design

## Process

- Read the feature file
- Plan the user-interface that will be required
- Create steps file for the feature
- Write the first step
  - Given steps: set up the context so the system is in a known state
  - When steps: perform actions in the manner that a user would - for example, clicking links or buttons as opposed to visiting URLs
  - Then steps: testing the outcomes, preferably by verifying what is visible to the user rather than examining what is in the data store
- Run the steps file
  - Use an actual browser so the feature matches what the user will experience
  - The step will fail, as there is no implementation yet
- Build the implementation one layer at a time
  - Start with the user-interface, using the earlier plan 
  - If a static user-interface fulfils the feature, stop here
  - Otherwise implement the layers of the system using a test-first approach to drive the design of the API between the different layers
  - Repeat until the step passes
- Repeat until all steps are implemented
- Run all features to ensure there are no regressions

