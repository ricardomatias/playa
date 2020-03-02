import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
// import { terser } from 'rollup-plugin-terser';
// import copy from 'rollup-plugin-copy';
import progress from 'rollup-plugin-progress';
import typescript from 'rollup-plugin-typescript2';

const extensions = [
	'.js', '.ts',
];

export default [
	{
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
		manualChunks: {
			vendor: [ 'ramda', 'simplex-noise', 'alea' ],
		},
		plugins: [
			del({ targets: 'build/*' }),
			resolve({ extensions }),
			commonjs(),
			cleanup({ comments: 'none' }),
			typescript(),
			babel({
				extensions,
				'babelrc': false,
				'retainLines': false,
				'sourceMap': false,
				'exclude': 'node_modules/**',
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
					'@babel/plugin-proposal-object-rest-spread',
					'@babel/plugin-proposal-class-properties',
				],
			}),
			// terser(),
			// copy({
			// 	targets: [
			// 		{ src: 'types/*.ts', dest: 'build/esm' },
			// 		{ src: 'types/*.ts', dest: 'build/cjs' },
			// 	],
			// }),
			progress(),
		],
	},
];
