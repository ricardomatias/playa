import dts from 'rollup-plugin-dts';


const baseConfig = {
	input: './build/types/index.d.ts',
	output: [
		{
			file: 'build/playa.d.ts',
			format: 'es',
		},
	],
	plugins: [
		dts(),
	],
};

export default baseConfig;
