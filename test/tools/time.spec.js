import {
	ticksToBBS,
	expandDuration,
	timeToTicks,
	timeToTransport,
	ticksToTime,
	bbsToTicks,
} from '../../lib/tools/time';

describe('A Time test suite', () => {
	describe('#expandDuration', () => {
		it('should map pattern', () => {
			const patt = [ '8n', '4n', '2nt' ];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
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

		it('should map pattern', () => {
			const patt = [
				{
					time: 0,
					dur: 480,
					next: 240,
				},
				{
					dur: 600,
					time: 240,
					next: 480,
				},
				{
					dur: 640,
					time: 720,
				},
			];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
Array [
  Object {
    "dur": 480,
    "next": 240,
    "time": 0,
  },
  Object {
    "dur": 600,
    "next": 480,
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

	describe('#bbsToTicks', () => {
		it('should convert - position', () => {
			const scenarios = [
				'1:1:0',
				'2:3:0',
				'2:1:1',
				'7:2:2',
				'5:1:3',
				'9:1:0',
			].map((transport) => bbsToTicks(transport, { positionMode: true }));

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

		it('should convert - interval', () => {
			const scenarios = [
				'0:0:0',
				'1:0:0',
				'1:1:0',
				'1:2:0',
				'1:0:1',
				'6:1:2',
				'4:0:0',
				'8:0:0',
			].map((transport) => bbsToTicks(transport));

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

	describe('#ticksToBBS', () => {
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
			].map((transport) => ticksToBBS(transport, { positionMode: true }));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  "1:2:3",
  "1:3:1",
  "2:1:1",
  "2:2:1",
  "2:3:1",
  "2:1:2",
  "7:2:3",
  "2:4:1",
  "3:4:3",
  "9:1:1",
  "5:1:1",
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
			].map((transport) => ticksToBBS(transport));

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

	describe('#timeToTicks', () => {
		it('should convert from seconds to ticks - 60 bpm', () => {
			const scenarios = [ 0, 0.5, 1, 1.5, 2.1875, 4, 4.125 ].map((seconds) =>
				timeToTicks(seconds, 60),
			);

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  240,
  480,
  720,
  1050,
  1920,
  1980,
]
`);
		});

		it('should convert from seconds to ticks - 104 bpm', () => {
			const scenarios = [
				0,
				0.28846153846153844,
				0.5769230769230769,
				0.8653846153846153,
				1.2620192307692306,
				2.3076923076923075,
				2.379807692307692,
			].map((seconds) => timeToTicks(seconds, 104));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  240,
  480,
  720,
  1050,
  1920,
  1980,
]
`);
		});

		it('should convert from seconds to ticks - 160 bpm', () => {
			const scenarios = [
				0,
				0.1875,
				0.375,
				0.5625,
				0.8203125,
				1.5,
				1.546875,
			].map((seconds) => timeToTicks(seconds, 160));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  240,
  480,
  720,
  1050,
  1920,
  1980,
]
`);
		});
	});

	describe('#ticksToTime', () => {
		it('should convert from ticks to seconds - 60 bpm', () => {
			const scenarios = [
				0,
				240, // 8n
				480, // 4n
				720,
				1050, // 4nd + 4nt
				1920, // 1m
				1980, // 1m + 32n,
				2040, // 1m + 16n
			].map((seconds) => ticksToTime(seconds, 60));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  0.5,
  1,
  1.5,
  2.1875,
  4,
  4.125,
  4.25,
]
`);
		});

		it('should convert from ticks to seconds - 104 bpm', () => {
			const scenarios = [
				0,
				240, // 8n
				480, // 4n
				720,
				1050, // 4nd + 4nt
				1920, // 1m
				1980, // 1m + 32n,
				2040, // 1m + 16n
			].map((seconds) => ticksToTime(seconds, 104));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  0.28846153846153844,
  0.5769230769230769,
  0.8653846153846153,
  1.2620192307692306,
  2.3076923076923075,
  2.379807692307692,
  2.4519230769230766,
]
`);
		});

		it('should convert from ticks to seconds - 160 bpm', () => {
			const scenarios = [
				0,
				240, // 8n
				480, // 4n
				720,
				1050, // 4nd + 4nt
				1920, // 1m
				1980, // 1m + 32n,
				2040, // 1m + 16n
			].map((seconds) => ticksToTime(seconds, 160));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  0,
  0.1875,
  0.375,
  0.5625,
  0.8203125,
  1.5,
  1.546875,
  1.59375,
]
`);
		});
	});

	describe('#timeToTransport', () => {
		it('should convert from seconds to transport - 60 bpm', () => {
			const scenarios = [
				0,
				0.5,
				1,
				1.5,
				2.1875,
				4,
				4.125,
				4.25,
			].map((seconds) => timeToTransport(seconds, 60));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  "0:0:0",
  "0:0:2",
  "0:1:0",
  "0:1:2",
  "0:2:0",
  "1:0:0",
  "1:0:0",
  "1:0:1",
]
`);
		});

		it('should convert from seconds to transport - 104 bpm', () => {
			const scenarios = [
				0,
				0.28846153846153844,
				0.5769230769230769,
				0.8653846153846153,
				1.2620192307692306,
				2.3076923076923075,
				2.379807692307692,
				2.4519230769230766,
			].map((seconds) => timeToTransport(seconds, 104));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  "0:0:0",
  "0:0:2",
  "0:1:0",
  "0:1:2",
  "0:2:0",
  "1:0:0",
  "1:0:0",
  "1:0:1",
]
`);
		});

		it('should convert from seconds to transport - 160 bpm', () => {
			const scenarios = [
				0,
				0.1875,
				0.375,
				0.5625,
				0.8203125,
				1.5,
				1.546875,
				1.59375,
			].map((seconds) => timeToTransport(seconds, 160));

			expect(scenarios).toMatchInlineSnapshot(`
Array [
  "0:0:0",
  "0:0:2",
  "0:1:0",
  "0:1:2",
  "0:2:0",
  "1:0:0",
  "1:0:0",
  "1:0:1",
]
`);
		});
	});
});
