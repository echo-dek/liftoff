import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Base URL for the application
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

interface ExerciseConfig {
	Phase: string;
	Day: string;
	Exercise: string;
	Sets: string;
	Reps: string;
	Weights: string;
}

Given('Liftoff is configured with the following plan:', async function (dataTable) {
	const rows = dataTable.hashes() as ExerciseConfig[];

	// Store the workout plan in local storage (table headers are capitalized)
	const workoutPlan = rows.map(row => ({
		phase: parseInt(row.Phase),
		day: parseInt(row.Day),
		exercise: row.Exercise,
		sets: parseInt(row.Sets),
		reps: parseInt(row.Reps),
		weights: row.Weights === 'true'
	}));

	// Navigate to the page first to have access to local storage
	await this.page.goto(BASE_URL);

	// Set the workout plan in local storage
	await this.page.evaluate((plan) => {
		localStorage.setItem('workoutPlan', JSON.stringify(plan));
	}, workoutPlan);

	// Store for later use in tests
	this.workoutPlan = workoutPlan;
});

Given('I have not recorded any exercises', async function () {
	// Clear any existing workout history from local storage
	await this.page.evaluate(() => {
		localStorage.removeItem('workoutHistory');
	});
});

When('I start Liftoff', async function () {
	await this.page.goto(BASE_URL);
});

Then('I should see the "Start" button', async function () {
	const startButton = this.page.getByRole('button', { name: /start/i });
	await expect(startButton).toBeVisible();
});

Then('I should see today\'s date plus the exercises for Phase {int} and Day {int}', async function (phase: number, day: number) {
	// Check that we're on the workout day page
	await expect(this.page.getByRole('heading', { name: `Phase ${phase}, Day ${day}` })).toBeVisible();

	// Check for exercises from the workout plan for this phase and day
	const exercises = this.workoutPlan.filter((ex: any) => ex.phase === phase && ex.day === day);

	// Wait for exercises to load from localStorage and hydration to complete
	// Use the first exercise as a signal that everything is ready
	if (exercises.length > 0) {
		const firstExerciseButton = this.page.locator(`button:has(h3:text("${exercises[0].exercise}"))`);
		await expect(firstExerciseButton).toBeVisible({ timeout: 10000 });

		// Verify all exercises are present
		for (const exercise of exercises) {
			const exerciseButton = this.page.locator(`button:has(h3:text("${exercise.exercise}"))`);
			await expect(exerciseButton).toBeVisible();
		}
	}
});

When('I enter {int}kg for the weights I am using', async function (weight: number) {
	const weightInput = this.page.getByLabel(/weight/i);
	await weightInput.fill(weight.toString());
	this.currentWeight = weight;
});

When(/^I (?:press|tap) (?:the )?"([^"]*)"(?: button)?$/, async function (text: string) {
	// First try to find exercise button (button with h3 containing text)
	const exerciseButton = this.page.locator(`button:has(h3:text("${text}"))`);

	// Wait for the button to appear (with timeout)
	try {
		await exerciseButton.first().waitFor({ state: 'visible', timeout: 5000 });
		await exerciseButton.first().click();
	} catch (e) {
		// Fall back to generic button search
		const genericButton = this.page.locator('button', { hasText: text });
		await genericButton.first().click();
	}
});

Then('I should see the {string} page', async function (exerciseName: string) {
	await expect(this.page.getByRole('heading', { name: exerciseName })).toBeVisible();
});

Then('I should see the sets counter showing {int} sets remaining', async function (setsRemaining: number) {
	await expect(this.page.getByText(`${setsRemaining} sets remaining`, { exact: false })).toBeVisible();
});


Then('the sets counter should show {int} set remaining', async function (setsRemaining: number) {
	await expect(this.page.getByText(`${setsRemaining} set remaining`, { exact: false })).toBeVisible();
});

Then('the sets counter should show {int} sets remaining', async function (setsRemaining: number) {
	await expect(this.page.getByText(`${setsRemaining} sets remaining`, { exact: false })).toBeVisible();
});

Then('the sets counter should show {string} with a celebratory animation', async function (message: string) {
	// Look for the celebration message specifically (with exclamation mark or in celebration div)
	const celebrationMessage = this.page.locator('.celebration, [class*="celebration"]').getByText(message, { exact: false });
	await expect(celebrationMessage).toBeVisible();
});

When('{int} seconds have passed', async function (seconds: number) {
	await this.page.waitForTimeout(seconds * 1000);
});

Then('the {string} page should animate away', async function (exerciseName: string) {
	// Wait for the page heading to disappear
	await expect(this.page.getByRole('heading', { name: exerciseName })).not.toBeVisible({ timeout: 5000 });
});

Then('I should see {string} page', async function (exerciseName: string) {
	await expect(this.page.getByRole('heading', { name: exerciseName })).toBeVisible();
});
