import { transportToTicks, ticksToTransport } from '../../lib/tools';

describe('A Time test suite', () => {
	describe('#transportToTicks', () => {
		it('should convert - interval', () => {
			const scenarios = [
				'1.1.0',
				'2.3.0',
				'2.1.234',
				'7.2.322',
				'5.1.0',
				'9.1.0',
			].map((transport) => transportToTicks(transport, true));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  2880,
  2154,
  12322,
  7680,
  15360,
]
`);
		});
		it('should convert - position', () => {
			const scenarios = [
				'0.0.0',
				'1.2.0',
				'1.0.234',
				'6.1.322',
				'4.0.0',
				'8.0.0',
			].map((transport) => transportToTicks(transport));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  2880,
  2154,
  12322,
  7680,
  15360,
]
`);
		});
	});

	describe('#ticksToTransport', () => {
		it('should convert - position', () => {
			const scenarios = [
				720,
				960,
				2880,
				2154,
				12322,
				3360,
				5520,
				15360,
				7680,
			].map((transport) => ticksToTransport(transport, { positionMode: true }));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  "1.2.240",
  "1.3.0",
  "2.3.0",
  "2.1.234",
  "7.2.322",
  "2.4.0",
  "3.4.240",
  "9.1.0",
  "5.1.0",
]
`);
		});

		it('should convert - interval', () => {
			const scenarios = [
				720,
				960,
				2880,
				2154,
				12322,
				3360,
				5520,
				15360,
				7680,
			].map((transport) => ticksToTransport(transport));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  "0.1.240",
  "0.2.0",
  "1.2.0",
  "1.0.234",
  "6.1.322",
  "1.3.0",
  "2.3.240",
  "8.0.0",
  "4.0.0",
]
`);
		});
	});
});
