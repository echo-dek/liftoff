export default {
	default: {
		requireModule: ['ts-node/register'],
		require: ['features/step-definitions/**/*.ts'],
		format: ['progress-bar', 'html:test-results/cucumber-report.html', 'json:test-results/cucumber-report.json'],
		formatOptions: { snippetInterface: 'async-await' },
		publishQuiet: true
	}
};
