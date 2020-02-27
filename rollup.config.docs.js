import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import clear from 'rollup-plugin-clear';
import progress from 'rollup-plugin-progress';
import cleanup from 'rollup-plugin-cleanup';
import typescript from '@rollup/plugin-typescript';


const extensions = [
	'.js', '.ts',
];

const baseConfig = {
	input: './lib/index.js',
	output: [
		{
			dir: 'build/esm',
			format: 'esm',
		},
	],
	manualChunks: {
		ramda: [ 'ramda' ],
	},
	plugins: [
		clear({
			// required, point out which directories should be clear.
			targets: [ 'build' ],
		}),
		resolve({ extensions }),
		commonjs(),
		cleanup({
			comments: 'jsdoc',
			compactComments: false,
		}),
		typescript({ target: 'ES6' }),
		progress(),
	],
};

export default baseConfig;
