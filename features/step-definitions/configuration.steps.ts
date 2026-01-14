import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Base URL for the application
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

Given('I have never used Liftoff before', async function () {
	// Clear all local storage to simulate first-time user
	await this.page.goto(BASE_URL);
	await this.page.evaluate(() => {
		localStorage.clear();
	});
});

Then('the default training plan should be configured', async function () {
	// Check that the workout plan has been loaded into localStorage
	const workoutPlan = await this.page.evaluate(() => {
		const plan = localStorage.getItem('workoutPlan');
		return plan ? JSON.parse(plan) : null;
	});

	// Verify that a workout plan exists
	expect(workoutPlan).not.toBeNull();
	expect(Array.isArray(workoutPlan)).toBe(true);
	expect(workoutPlan.length).toBeGreaterThan(0);

	// Verify it contains expected structure (phase 1, day 1 exercises)
	const phase1Day1Exercises = workoutPlan.filter(
		(ex: any) => ex.phase === 1 && ex.day === 1
	);
	expect(phase1Day1Exercises.length).toBeGreaterThan(0);

	// Verify exercises have required fields
	const firstExercise = phase1Day1Exercises[0];
	expect(firstExercise).toHaveProperty('exercise');
	expect(firstExercise).toHaveProperty('sets');
	expect(firstExercise).toHaveProperty('reps');
	expect(firstExercise).toHaveProperty('weights');
});
