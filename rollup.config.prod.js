import { babel } from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';
import progress from 'rollup-plugin-progress';
import typescript from 'rollup-plugin-typescript2';

const extensions = ['.js', '.ts'];

export default [
	{
		input: './lib/index.ts',
		output: [
			{
				dir: 'build/esm',
				format: 'esm',
				sourcemap: true,
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
			commonjs(),
			cleanup({ comments: 'none' }),
			typescript({ useTsconfigDeclarationDir: true }),
			babel({
				extensions,
				babelHelpers: 'bundled',
				babelrc: false,
				retainLines: false,
				// sourceMap: false,
				exclude: 'node_modules/**',
				presets: [
					[
						'@babel/preset-env',
						{
							targets: {
								browsers: 'last 2 versions',
								node: 'current',
							},
						},
					],
				],
				plugins: ['ramda', '@babel/plugin-proposal-class-properties'],
			}),
			terser(),
			progress(),
		],
	},
];
