import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
// import includePaths from 'rollup-plugin-includepaths';


import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

const ignoredFolders = new RegExp(/utils|core/gi);

const removeExt = (file) => file.replace(/\.[^.]+$/, '');

const isDirectory = (source) => lstatSync(source).isDirectory();

const getIndex = (dir) =>
	join(dir, readdirSync(dir).find((file) => /^index/.test(file)));

const getFiles = (dir) =>
	readdirSync(dir)
		.filter((file) => !/^_/.test(file))
		.reduce((acc, file) => {
			const path = join(dir, file);

			if (ignoredFolders.test(path)) {
				return acc;
			}

			try {
				const finalPath = isDirectory(path) ? getIndex(path) : path;
				return {
					...acc,
					[removeExt(file)]: finalPath,
				};
			} catch (e) {
				console.log(dir, path);
				console.error(e);
				return acc;
			}
		}, {});

const publicFiles = getFiles(join(__dirname, 'lib'));

const includePathOptions = {
	include: {},
	paths: [ 'lib/core', 'lib/functional', 'lib/tools', 'lib/utils' ],
	external: [],
	extensions: [ '.js' ],
};

export default [
	{
		input: {
			'playa': 'lib/index.js',
			'playa/core': 'lib/core/index.js',
			'playa/functional': 'lib/functional/index.js',
			'playa/tools': 'lib/tools/index.js',
			'playa/constants': 'lib/constants/index.js',
			'playa/utils': 'lib/utils/index.js',
		},
		output: [
			{
				dir: 'build',
				entryFileNames: '[name].esm.js',
				format: 'es',
				sourcemap: true,
			},
			{
				dir: 'build',
				entryFileNames: '[name].cjs.js',
				format: 'cjs',
				sourcemap: true,
			},
		],
		plugins: [
			cleanup(),
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**',
			}),
			terser({
				output: {
					comments: 'all',
				},
			}),
			// includePaths(includePathOptions),
		],
	},
	{
		input: 'lib/index.js',
		output: {
			dir: 'build',
			input: '[name].umd.js',
			format: 'umd',
			name: 'playa',
			sourcemap: true,
		},
		plugins: [
			cleanup(),
			resolve(),
			commonjs(),
			babel({
				exclude: 'node_modules/**',
			}),
			terser({
				output: {
					comments: 'all',
				},
			}),
			// includePaths(includePathOptions),
		],
	},
];
