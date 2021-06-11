const esbuild = require('esbuild');
const rimraf = require('rimraf');

rimraf.sync('./build');

esbuild.buildSync({
	entryPoints: [ 'lib/index.ts' ],
	bundle: true,
	minify: false,
	target: 'es6',
	format: 'esm',
	platform: 'browser',
	sourcemap: 'external',
	outdir: 'build/esm/',
	define: {
		'process.env.NODE_ENV': '"production"',
	},
});
