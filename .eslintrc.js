module.exports = {
	'extends': [
		'eslint:recommended',
		'google',
	],

	'env': {
		'node': true,
		'es6': true,
	},

	'globals': {
	},

	'rules': {
		'linebreak-style': ['off', 'windows'],
		'max-len': ['warn', 80],
		'eqeqeq': ['error', 'always'],
		'no-var': 'warn',
		'no-console': 'off',
		'no-unused-vars': 'warn',
		'comma-dangle': ['warn', 'always-multiline'],
		'no-trailing-spaces': 'off',
		'padded-blocks': 'off',
		'require-jsdoc': 'warn',
		'quotes': ['error', 'single'],
		'quote-props': ['error', 'consistent'],
		'prefer-rest-params': 'off',
	},
};
