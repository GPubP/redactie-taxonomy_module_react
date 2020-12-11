module.exports = {
	// when using React Testing Library and adds special
	// extended assertions to Jest
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

	transform: {
		'^.+\\.jsx?$': 'babel-jest', // Adding this line solved the issue
		'^.+\\.tsx?$': 'ts-jest',
	},

	// Module file extensions for importing
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

	// Module names that allow to stub out resources, like images or styles with a single module.
	moduleNameMapper: {
		'^.+\\.(css|less|scss)$': 'identity-obj-proxy',
		'^ky$': '<rootDir>/node_modules/ky/umd.js',
	},
};
