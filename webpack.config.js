const { getModuleConfig, getWorkerConfig } = require('@redactie/utils/dist/webpack');

const packageJSON = require('./package.json');

module.exports = env => {
	const defaultConfig = getModuleConfig({
		packageJSON,
		styleIncludes: [/public/, /node_modules\/@a-ui\/core/],
		sassIncludes: [/public/, /node_modules\/@a-ui\/core/],
		externals: {
			'@redactie/form-renderer-module': '@redactie/form-renderer-module',
			'@redactie/translations-module': '@redactie/translations-module',
		},
	})(env);

	const workerConfig = getWorkerConfig();

	return [workerConfig, defaultConfig];
};
