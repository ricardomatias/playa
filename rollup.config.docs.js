import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';
import cleanup from 'rollup-plugin-cleanup';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';

const extensions = ['.js', '.ts'];

const baseConfig = {
	input: './lib/index.ts',
	output: [
		{
			dir: 'build/esm',
			format: 'esm',
		},
	],
	manualChunks: {
		vendor: ['ramda', 'simplex-noise', 'alea'],
	},
	plugins: [
		del({ targets: 'build/*' }),
		resolve({ extensions }),
		commonjs(),
		cleanup({
			comments: 'jsdoc',
			compactComments: false,
		}),
		typescript({
			tsconfigOverride: {
				target: 'ESNext',
			},
		}),
		progress(),
	],
};

export default baseConfig;
