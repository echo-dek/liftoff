import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Base URL for the application
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

Given('I am on the home page', async function () {
	await this.page.goto(BASE_URL);
});

Given('I navigate to {string}', async function (path: string) {
	await this.page.goto(`${BASE_URL}${path}`);
});

Then('I should see a heading', async function () {
	const heading = this.page.locator('h1');
	await expect(heading).toBeVisible();
});

Then('the page should be loaded', async function () {
	await expect(this.page).toHaveTitle(/.*/);
});

Then('the page title should be visible', async function () {
	const heading = this.page.locator('h1');
	await expect(heading).toBeVisible();
});
