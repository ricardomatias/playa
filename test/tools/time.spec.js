import {
	transportToTicks,
	ticksToTransport,
	expandDuration,
} from '../../lib/tools/time';


describe('A Time test suite', () => {
	describe('#expandDuration', () => {
		it('should map pattern', () => {
			const patt = [ '8n', '4n', '2nt' ];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "dur": "8n",
			    "time": 0,
			  },
			  Object {
			    "dur": "4n",
			    "time": 240,
			  },
			  Object {
			    "dur": "2nt",
			    "time": 720,
			  },
			]
		`);
		});

		it('should map pattern - to ticks', () => {
			const patt = [ '8n', '4n', '2nt' ];

			expect(expandDuration(patt, true)).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "dur": 240,
			    "time": 0,
			  },
			  Object {
			    "dur": 480,
			    "time": 240,
			  },
			  Object {
			    "dur": 640,
			    "time": 720,
			  },
			]
		`);
		});
	});

	describe('#transportToTicks', () => {
		it('should convert - interval', () => {
			const scenarios = [
				'1:1:0',
				'2:3:0',
				'2:1:1',
				'7:2:2',
				'5:1:3',
				'9:1:0',
			].map((transport) => transportToTicks(transport, true));

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  0,
			  2880,
			  2040,
			  12240,
			  8040,
			  15360,
			]
		`);
		});
		it('should convert - position', () => {
			const scenarios = [
				'0:0:0',
				'1:0:0',
				'1:1:0',
				'1:2:0',
				'1:0:1',
				'6:1:2',
				'4:0:0',
				'8:0:0',
			].map((transport) => transportToTicks(transport));

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  0,
			  1920,
			  2400,
			  2880,
			  2040,
			  12240,
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
				1920,
				2400,
				2880,
				2154,
				12322,
				3360,
				5520,
				15360,
				7680,
			].map((transport) =>
				ticksToTransport(transport, { positionMode: true }),
			);

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  "1:2:2",
			  "1:3:0",
			  "2:1:0",
			  "2:2:0",
			  "2:3:0",
			  "2:1:1",
			  "7:2:2",
			  "2:4:0",
			  "3:4:2",
			  "9:1:0",
			  "5:1:0",
			]
		`);
		});

		it('should convert - interval', () => {
			const scenarios = [
				720,
				960,
				2880,
				2154,
				12362,
				3360,
				5520,
				15360,
				7680,
			].map((transport) => ticksToTransport(transport));

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  "0:1:2",
			  "0:2:0",
			  "1:2:0",
			  "1:0:1",
			  "6:1:3",
			  "1:3:0",
			  "2:3:2",
			  "8:0:0",
			  "4:0:0",
			]
		`);
		});
	});
});
