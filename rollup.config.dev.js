import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import clear from 'rollup-plugin-clear';
import progress from 'rollup-plugin-progress';

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
		{
			dir: 'build/cjs',
			format: 'cjs',
		},
	],
	plugins: [
		clear({
			// required, point out which directories should be clear.
			targets: [ 'build' ],
			// optional, whether clear the directores when rollup recompile on --watch mode.
			watch: true, // default: false
		}),
		resolve({ extensions }),
		commonjs(),
		babel({
			extensions,
			'sourceMap': 'inline',
			'retainLines': true,
			'exclude': 'node_modules/**',
			'presets': [
				[
					'@babel/preset-env',
				],
				'@babel/preset-typescript',
			],
			'plugins': [
				'@babel/plugin-proposal-object-rest-spread',
				'@babel/plugin-proposal-class-properties',
			],
		}),
		progress(),
	],
};

export default baseConfig;
