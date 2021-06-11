import babel from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import typescript from 'rollup-plugin-typescript2';
import rename from 'rollup-plugin-rename';
import renameNodeModules from "rollup-plugin-rename-node-modules";
import packageJson from './package.json';

const extensions = [
	'.js', '.ts',
];

export default [
	{
		input: './lib/index.ts',
		output: [
			{
				dir: 'build/esm',
				format: 'esm',
				sourcemap: true,
				preserveModules: true,
				preserveModulesRoot: 'lib',
				exports: 'named',
			},
			{
				dir: 'build/umd',
				format: 'umd',
				name: 'Playa',
				sourcemap: true,
			},
		],
		plugins: [
			del({ targets: 'build/*' }),
			resolve({ extensions }),
			commonjs({ exclude: 'node_modules' }),
			cleanup({ comments: 'none' }),
			typescript({ useTsconfigDeclarationDir: true }),
			babel({
				extensions,
				babelHelpers: 'bundled',
				babelrc: false,
				retainLines: false,
				// 'sourceMap': false,
				exclude: 'node_modules/**',
				// presets: [
				// 	[
				// 		'@babel/preset-env',
				// 		{
				// 			// targets: {
				// 			// 	browsers: 'defaults',
				// 			// 	node: 'current',
				// 			// },
				// 			modules: false,
				// 		},
				// 	],
				// ],
				plugins: [ 'ramda' ],
			}),
			{
				transform(code, id) {
					return code.replace(/\/\*\* @class \*\//g, "\/*@__PURE__*\/");
				}
			},
			// terser(),
			// rename({
			// 	include: [ '**/*.ts', '**/*.js' ],
			// 	map: (name) => {
			// 		if (name.includes('alea')) {
			// 			console.log(name);

			// 		}
			// 		return name.replace('lib/', '')
			// 			.replace('node_modules/', 'external/')
			// 			.replace('../../external', '../external')
			// 			.replace('../../_virtual', '../_virtual')
			// 			.replace('../_virtual/_commonjsHelpers.js', '../../_virtual/_commonjsHelpers.js');
			// 	}
			// }),
			renameNodeModules('external'),
			progress(),
		],
	},
];
