import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';

import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';

const ignoredFolders = new RegExp(/utils|core/gi);

const removeExt = file => file.replace(/\.[^.]+$/, "");

const isDirectory = source => lstatSync(source).isDirectory();

const getIndex = dir =>
	join(dir, readdirSync(dir).find(file => /^index/.test(file)));

const getFiles = dir =>
	readdirSync(dir)
		.filter(file => !/^_/.test(file))
		.reduce((acc, file) => {
			const path = join(dir, file);

			if (ignoredFolders.test(path)) {
				return acc;
			}

			try {
				const finalPath = isDirectory(path) ? getIndex(path) : path;
				return {
					...acc,
					[removeExt(file)]: finalPath
				};
			} catch(e) {
				console.log(dir, path);
				console.error(e);
				return acc;
			}
		}, {});

const publicFiles = getFiles(join(__dirname, 'lib'));


const baseConfig = {
	input: 'index.js',
	output: {
		file: 'build/playa.js',
		format: 'cjs'
	},
	external: [
		'tone',
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
	],
};

// const outputCJS = {
// 	dir: 'build',
// 	entryFileNames: '[name].js',
// 	exports: 'named',
// 	format: 'cjs',
// 	name: 'playa',
// 	sourcemap: true,
// };

// const outputESM = {
// 	dir: 'build',
// 	entryFileNames: '[name].js',
// 	exports: 'named',
// 	format: 'esm',
// 	name: 'playa',
// 	sourcemap: true,
// };

export default [
	Object.assign({}, baseConfig),
	// Object.assign({}, baseConfig, { output: outputCJS }),
];
