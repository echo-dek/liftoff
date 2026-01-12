import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

// Base URL for the application
const BASE_URL = process.env.BASE_URL || 'http://localhost:4173';

When('I start Liftoff', async function () {
	await this.page.goto(BASE_URL);
});

