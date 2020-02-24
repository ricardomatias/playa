import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';
import progress from 'rollup-plugin-progress';
// import includePaths from 'rollup-plugin-includepaths';

const extensions = [
	'.js', '.ts',
];

const OUT_DIR = '../playa-release';


export default [
	{
		input: {
			'index': 'lib/index.js',
			'core/index': 'lib/core/index.js',
			'functional/index': 'lib/functional/index.js',
			'tools/index': 'lib/tools/index.js',
			'constants/index': 'lib/constants/index.js',
			'utils/index': 'lib/utils/index.js',
		},
		output: [
			{
				dir: OUT_DIR,
				entryFileNames: '[name].js',
				format: 'esm',
				sourcemap: true,
			},
			{
				dir: 'build/cjs',
				entryFileNames: '[name].js',
				format: 'cjs',
			},
		],
		manualChunks: {
			ramda: [ 'ramda' ],
		},
		plugins: [
			del({ targets: 'build/*' }),
			resolve({ extensions }),
			commonjs(),
			cleanup({
				comments: 'jsdoc',
				compactComments: false,
			}),
			babel({
				extensions,
				exclude: 'node_modules/**',
			}),
			// terser({
			// 	output: {
			// 		comments: 'all',
			// 	},
			// }),
			// includePaths(includePathOptions),
			copy({
				targets: [
					{ src: 'types/*.ts', dest: OUT_DIR },
				],
			}),
			progress(),
		],
	},
	// {
	// 	input: {
	// 		'index': 'lib/index.js',
	// 		'core/index': 'lib/core/index.js',
	// 		'functional/index': 'lib/functional/index.js',
	// 		'tools/index': 'lib/tools/index.js',
	// 		'constants/index': 'lib/constants/index.js',
	// 		'utils/index': 'lib/utils/index.js',
	// 	},
	// 	output: [
	// 		{
	// 			dir: 'build/cjs',
	// 			entryFileNames: '[name].js',
	// 			format: 'cjs',
	// 		},
	// 	],
	// 	manualChunks: {
	// 		ramda: [ 'ramda' ],
	// 	},
	// 	plugins: [
	// 		resolve(),
	// 		commonjs(),
	// 		cleanup({
	// 			comments: 'jsdoc',
	// 			compactComments: false,
	// 		}),
	// 		babel({
	// 			exclude: 'node_modules/**',
	// 		}),
	// 		terser({
	// 			output: {
	// 				comments: 'all',
	// 			},
	// 		}),
	// 		// includePaths(includePathOptions),
	// 		progress(),
	// 	],
	// },
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
