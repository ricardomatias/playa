/// <reference types="vitest" />
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			reporter: ['text', 'json', 'html'],
			include: ['lib/**/*.ts'],
			exclude: ['lib/index.ts', ...coverageConfigDefaults.exclude],
		},
	},
});
