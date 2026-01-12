import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, BrowserContext } from 'playwright';

let browser: Browser;
let context: BrowserContext;
let page: Page;

// Set default timeout to 60 seconds
setDefaultTimeout(60000);

BeforeAll(async function () {
	// Launch browser once before all tests
	browser = await chromium.launch({
		headless: true
	});
});

Before(async function () {
	// Create new context and page for each scenario
	context = await browser.newContext();
	page = await context.newPage();

	// Make page available to step definitions
	this.page = page;
	this.context = context;
});

After(async function () {
	// Close context after each scenario
	if (context) {
		await context.close();
	}
});

AfterAll(async function () {
	// Close browser after all tests
	if (browser) {
		await browser.close();
	}
});

export { browser, page, context };
