module.exports = {
	default: {
		requireModule: ['tsx/cjs'],
		require: [
			'features/step-definitions/hooks.ts',
			'features/step-definitions/tracking_progress.steps.ts',
			'features/step-definitions/configuration.steps.ts'
		],
		format: ['progress'],
		formatOptions: { snippetInterface: 'async-await' }
	}
};
