module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		ecmaVersion: 2021,
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
		'prettier',
	],
	env: {
		node: true,
		es2021: true,
		jest: true,
	},
	rules: {
		// TypeScript specific rules
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/no-non-null-assertion': 'warn',
		'@typescript-eslint/ban-ts-comment': 'warn',

		// n8n specific rules - adjust as needed
		'n8n-nodes-base/node-param-description-missing-from-dynamic-options': 'off',
		'n8n-nodes-base/node-param-description-missing-final-period': 'warn',
		'n8n-nodes-base/node-param-description-wrong-for-simplify': 'off',

		// General rules
		'no-console': ['warn', { allow: ['warn', 'error'] }],
		'prefer-const': 'error',
		'no-var': 'error',
		eqeqeq: ['error', 'always'],
	},
	ignorePatterns: ['dist/', 'node_modules/', 'test/', '*.js', '!.eslintrc.js'],
};
