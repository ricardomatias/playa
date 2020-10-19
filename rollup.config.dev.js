import babel from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import clear from 'rollup-plugin-clear';
import progress from 'rollup-plugin-progress';
import cleanup from 'rollup-plugin-cleanup';
import typescript from 'rollup-plugin-typescript2';


const extensions = [
	'.js', '.ts',
];

const baseConfig = {
	input: './lib/index.ts',
	output: [
		{
			dir: 'build/esm',
			format: 'esm',
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
		cleanup({
			comments: 'jsdoc',
			compactComments: false,
		}),
		typescript(),
		babel({
			extensions,
			'babelHelpers': 'bundled',
			'babelrc': false,
			'sourceMap': 'inline',
			'retainLines': true,
			'presets': [
				[
					'@babel/preset-env',
					{
						'targets': {
							'browsers': 'last 2 versions',
							'node': 'current',
						},
					},
				],
			],
			'plugins': [
				'@babel/plugin-proposal-class-properties',
			],
		}),
		progress(),
	],
};

export default baseConfig;
