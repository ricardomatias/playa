import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...fixupConfigRules(
		compat.extends(
			'plugin:@typescript-eslint/eslint-recommended',
			'plugin:@typescript-eslint/recommended',
			'plugin:prettier/recommended',
			'plugin:import/recommended',
			'plugin:import/typescript'
		)
	),
	{
		plugins: {
			'@typescript-eslint': fixupPluginRules(typescriptEslint),
			prettier: fixupPluginRules(prettier),
		},

		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jest,
				...globals.node,
				expect: true,
			},

			parser: tsParser,
			ecmaVersion: 2018,
			sourceType: 'module',
		},

		settings: {
			'import/resolver': {
				node: {
					extensions: ['.js', '.ts'],
				},
			},
		},

		rules: {
			'no-console': 'off',
			'require-jsdoc': 0,
			indent: 'off',
			'@typescript-eslint/explicit-function-return-type': 0,
			'@typescript-eslint/no-explicit-any': 0,
			'import/no-unresolved': 'warn',
			'import/no-named-as-default': 'warn',
			'no-multi-assign': 0,
			'no-warning-comments': 0,
			'prettier/prettier': 1,
			'no-redeclare': 'off',
			'@typescript-eslint/no-redeclare': 'off',
		},
	},
];
