import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
// import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import progress from 'rollup-plugin-progress';
// import includePaths from 'rollup-plugin-includepaths';

export default [
	{
		input: {
			'playa': 'lib/index.js',
			'core': 'lib/core/index.js',
			'functional': 'lib/functional/index.js',
			'tools': 'lib/tools/index.js',
			'constants': 'lib/constants/index.js',
			'utils': 'lib/utils/index.js',
		},
		output: {
			dir: '../playa-release',
			entryFileNames: '[name].js',
			format: 'esm',
			// sourcemap: true,
		},
		manualChunks: {
			ramda: [ 'ramda' ],
		},
		plugins: [
			del({ targets: 'build/*' }),
			resolve(),
			commonjs(),
			cleanup({
				comments: 'jsdoc',
				compactComments: false,
			}),
			// terser({
			// 	output: {
			// 		comments: 'all',
			// 	},
			// }),
			// includePaths(includePathOptions),
			copy({
				targets: [
					{ src: 'types/*.ts', dest: '../playa-release' },
				],
			}),
			progress(),
		],
	},
	{
		input: {
			'playa': 'lib/index.js',
		},
		output: [
			{
				dir: 'build/cjs',
				entryFileNames: '[name].js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		manualChunks: {
			ramda: [ 'ramda' ],
		},
		plugins: [
			del({ targets: 'build/*' }),
			resolve(),
			commonjs(),
			cleanup({
				comments: 'jsdoc',
				compactComments: false,
			}),
			babel({
				exclude: 'node_modules/**',
			}),
			// terser({
			// 	output: {
			// 		comments: 'all',
			// 	},
			// }),
			// includePaths(includePathOptions),
			progress(),
		],
	},
	// {
	// 	input: 'lib/index.js',
	// 	output: {
	// 		dir: 'build',
	// 		input: '[name].umd.js',
	// 		format: 'umd',
	// 		name: 'playa',
	// 		sourcemap: true,
	// 	},
	// 	plugins: [
	// 		cleanup(),
	// 		resolve(),
	// 		commonjs(),
	// 		babel({
	// 			exclude: 'node_modules/**',
	// 		}),
	// 		terser({
	// 			output: {
	// 				comments: 'all',
	// 			},
	// 		}),
	// 		// includePaths(includePathOptions),
	// 	],
	// },
];
