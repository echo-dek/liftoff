# Cucumber BDD Tests

This directory contains Behavior-Driven Development (BDD) tests using Cucumber and Gherkin syntax.

## Structure

```
features/
├── *.feature              # Gherkin feature files
├── step-definitions/      # TypeScript step definitions
│   ├── hooks.ts          # Browser lifecycle management
│   └── *.steps.ts        # Step implementations
└── README.md             # This file
```

## Writing Feature Files

Feature files use Gherkin syntax to describe application behavior in plain language:

```gherkin
Feature: Feature Name
  As a [role]
  I want to [action]
  So that [benefit]

  Scenario: Scenario Name
    Given [precondition]
    When [action]
    Then [expected result]
```

### Keywords

- **Feature**: High-level description of a software feature
- **Scenario**: Concrete example illustrating a business rule
- **Given**: Preconditions or initial context
- **When**: Action or event
- **Then**: Expected outcome
- **And/But**: Additional steps of the same type
- **Background**: Steps to run before each scenario in the feature

## Writing Step Definitions

Step definitions are TypeScript functions that implement the steps described in feature files.

### Example

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('I am on the home page', async function () {
  await this.page.goto('http://localhost:4173');
});

Then('I should see a heading', async function () {
  const heading = this.page.locator('h1');
  await expect(heading).toBeVisible();
});
```

### Available Context

Step definitions have access to:
- `this.page` - Playwright Page instance
- `this.context` - Playwright BrowserContext instance

## Running Tests

```bash
# Run all BDD tests (builds app, starts server, runs tests)
bun run test:bdd

# Run with custom base URL
BASE_URL=http://localhost:5173 bun run test:bdd
```

## Best Practices

1. **Write from the user's perspective** - Focus on business value, not implementation
2. **Keep scenarios focused** - One scenario should test one specific behavior
3. **Use Background for common setup** - Reduce duplication across scenarios
4. **Make steps reusable** - Write generic steps that can be used in multiple scenarios
5. **Use scenario outlines for data-driven tests** - Test the same behavior with different inputs

## Example Scenario Outline

```gherkin
Scenario Outline: Progressive overload with different weights
  Given I have previously completed an exercise with <previous_weight>
  When I start the same exercise again
  Then the suggested weight should be <new_weight>

  Examples:
    | previous_weight | new_weight |
    | 20kg           | 21kg       |
    | 40kg           | 41kg       |
    | 22.5lb         | 25lb       |
```

## Resources

- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/)
- [Playwright Documentation](https://playwright.dev/)
