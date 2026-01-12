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

## Lessons Learned from tracking_progress.feature Implementation

### Critical Bugs and Solutions

#### 1. Gherkin Table Header Case Sensitivity (Most Critical)
**Problem**: Cucumber's `dataTable.hashes()` returns objects with keys matching the exact table header names. If your Gherkin table has capitalized headers (`Phase`, `Day`) but your code accesses lowercase properties (`row.phase`, `row.day`), all values will be `undefined`.

**Symptom**: Tests appear to run but data is empty/null, localStorage contains invalid data, features don't render.

**Solution**: Match interface property names to table headers exactly:
```typescript
interface ExerciseConfig {
  Phase: string;  // Capitalized to match table header
  Day: string;
  Exercise: string;
  // ...
}

const workoutPlan = rows.map(row => ({
  phase: parseInt(row.Phase),  // Access with capital letter
  day: parseInt(row.Day),
  exercise: row.Exercise
}));
```

**Prevention**: When using data tables, immediately log the parsed data to verify it's being read correctly.

#### 2. Cucumber TypeScript Loading Configuration
**Problem**: Cucumber doesn't load TypeScript step definitions by default. Using `--loader` flag is deprecated in newer Node versions.

**Solution**:
1. Install `tsx` for TypeScript support: `bun add -d tsx`
2. Create `cucumber.cjs` (NOT `.js`) with CommonJS exports:
```javascript
module.exports = {
  default: {
    requireModule: ['tsx/cjs'],
    require: [
      'features/step-definitions/hooks.ts',
      'features/step-definitions/*.steps.ts'
    ],
    format: ['progress'],
    formatOptions: { snippetInterface: 'async-await' }
  }
};
```
3. Use explicit file paths in `require` array, not glob patterns

#### 3. SvelteKit Static Adapter with Dynamic Routes
**Problem**: `@sveltejs/adapter-static` fails to build when you have dynamic routes (e.g., `/workout/[phase]/[day]`) because it can't pre-render them.

**Solution**: Configure fallback for SPA mode in `svelte.config.js`:
```javascript
adapter: adapter({
  fallback: 'index.html'  // Essential for client-side routing
})
```

#### 4. localStorage in SvelteKit with SSR
**Problem**: Page `load` functions run at build time during static generation. localStorage doesn't exist at build time, causing empty data.

**Solution**: Disable SSR for pages that need client-side-only features:
```typescript
// +page.ts
export const ssr = false;  // Critical for localStorage access

export const load: PageLoad = ({ params }) => {
  const exercises = browser ? storage.getExercisesForDay(...) : [];
  // ...
};
```

#### 5. Playwright Strict Mode Violations
**Problem**: `getByText('message')` fails when multiple elements contain that text.

**Symptom**: "strict mode violation: resolved to 2 elements"

**Solution**: Use more specific selectors:
```typescript
// Instead of:
await expect(this.page.getByText('completed')).toBeVisible();

// Use:
await expect(this.page.locator('.celebration').getByText('completed')).toBeVisible();
```

### Debugging Techniques That Worked

#### 1. Screenshots at Critical Points
Add screenshot capture in step definitions to see actual browser state:
```typescript
await this.page.screenshot({ path: `/tmp/debug-step.png` });
```
Then use Read tool to view the screenshot and understand what's actually rendering.

#### 2. Console Logging Test Data
Log parsed data immediately after extraction:
```typescript
console.log(`Stored workout plan:`, JSON.stringify(workoutPlan, null, 2));
```
This revealed the table header case sensitivity bug instantly.

#### 3. Checking Element Counts
Before expecting visibility, check if elements exist:
```typescript
const count = await exerciseButton.count();
console.log(`Found ${count} buttons`);
```

#### 4. Progressive Verification
Don't trust that tests pass without verification. The test for exercises "passed" but was actually skipping verification because `if (exercises.length > 0)` was false!

### Common Pitfalls to Avoid

1. **Don't use `onMount()` for data that needs to be available immediately** - Use page `load` functions or initialize with data
2. **Don't assume SSR works with localStorage** - Always check `browser` from `$app/environment`
3. **Don't use generic selectors when multiple matches exist** - Be specific with CSS classes or data attributes
4. **Don't trust passing tests without verifying** - A test that does nothing will pass!
5. **Don't use wildcards in Cucumber config `require`** - List files explicitly or use specific patterns

### Best Practices Discovered

#### Test Step Organization
1. **Given steps**: Always navigate to page first, THEN set localStorage. Order matters in SPAs.
2. **When steps**: Use smart selectors that try exercise-specific patterns first, then fall back to generic
3. **Then steps**: Wait for first element with timeout, then check others without timeout

#### Svelte 5 + SvelteKit Patterns
1. Use `$props()` to receive page data from load function
2. Use `$derived` for computed values
3. Use `$state` for local reactive state
4. Always use `ssr = false` for pages with client-only features (localStorage, browser APIs)

#### BDD Process Improvements
1. **Start with data flow verification** - Log what data is being created/stored/loaded
2. **Use screenshots liberally** - They reveal UI issues instantly
3. **Test incrementally** - Don't write all steps at once
4. **Verify test assumptions** - Make sure "passing" tests are actually checking something

### Ralph Loop Insights

The Ralph Loop methodology proved highly effective:

1. **Self-referential debugging** - Each iteration's output (files, test results) informs the next iteration
2. **Systematic problem-solving** - Work through one layer of issues to reveal the next
3. **Trust the process** - Even when stuck, keep iterating with new debugging approaches
4. **Screenshot-driven development** - Visual evidence is more reliable than assumptions
5. **Data-first debugging** - When features don't work, verify the data flow before blaming the UI

**Key Ralph Loop Pattern**:
- Run test → See failure → Add logging/screenshots → Understand root cause → Fix → Repeat

The "button not rendering" mystery that persisted through many iterations was solved by:
1. Adding screenshots (showed no buttons rendered)
2. Adding data logging (showed `exercises.length === 0`)
3. Tracing back to table parsing (showed all `null` values)
4. Checking table headers (found case mismatch)
5. Fixing case sensitivity (all tests passed!)

This demonstrates how Ralph Loop forces you to dig deeper with each iteration until you find the actual root cause.

### Quick Reference Checklist

Before starting a new feature:
- [ ] Create feature file with scenarios
- [ ] Set up Cucumber config (cucumber.cjs with tsx)
- [ ] Create hooks.ts for browser lifecycle
- [ ] Create step definitions file
- [ ] Add logging for all data extraction
- [ ] Use screenshots for debugging UI issues
- [ ] Configure static adapter with fallback
- [ ] Set `ssr = false` for client-only pages
- [ ] Match Gherkin table headers to code property access
- [ ] Use specific selectors to avoid strict mode violations
- [ ] Verify test data flow before implementing features
- [ ] Trust but verify - ensure passing tests actually check something

