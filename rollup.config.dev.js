import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import clear from 'rollup-plugin-clear';
import progress from 'rollup-plugin-progress';


const baseConfig = {
	input: 'index.js',
	output: {
		file: 'build/playa.js',
		format: 'cjs',
	},
	external: [
		'tone',
	],
	plugins: [
		clear({
			// required, point out which directories should be clear.
			targets: [ 'build' ],
			// optional, whether clear the directores when rollup recompile on --watch mode.
			watch: true, // default: false
		}),
		resolve(),
		commonjs(),
		babel({
			exclude: 'node_modules/**',
		}),
		progress(),
	],
};

export default baseConfig;
