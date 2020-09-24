import * as R from 'ramda';
import { TICKS } from '../../../lib/constants';
import { Random, Rhythm, distribute, chooseMany } from '../../../lib/tools';

const { free: generateFreeRhythm } = Rhythm;

const ONE_BAR = TICKS.get('1n');

const { mixed, slow, robotic, straight } = Rhythm.presets;

describe('#generateFreeRhythm', () => {
	it('should generate rhythm - decreasing', () => {
		// given
		Random.setSeed('test');

		// when
		const rhythm = generateFreeRhythm(
			ONE_BAR,
			mixed,
			[],
			distribute.decreasing,
		);

		// then
		expect(rhythm).toLastAround(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 480,
		    "time": 0,
		  },
		  Object {
		    "dur": 160,
		    "isRest": false,
		    "next": 640,
		    "time": 480,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 880,
		    "time": 640,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1000,
		    "time": 880,
		  },
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "next": 1320,
		    "time": 1000,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1560,
		    "time": 1320,
		  },
		  Object {
		    "dur": 360,
		    "isRest": false,
		    "next": 1920,
		    "time": 1560,
		  },
		]
	`);
	});

	it('should generate rhythm - slow', () => {
		// given
		Random.setSeed('test');

		// when
		const rhythm = generateFreeRhythm(ONE_BAR * 2, slow, [ '4n', '4nd' ]);

		// then
		expect(rhythm).toLastAround(ONE_BAR * 2);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 480,
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 720,
		    "time": 480,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 1200,
		    "time": 720,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 1920,
		    "time": 1200,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 2400,
		    "time": 1920,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 3120,
		    "time": 2400,
		  },
		  Object {
		    "dur": 720,
		    "isRest": true,
		    "next": 3840,
		    "time": 3120,
		  },
		]
	`);
	});

	it('should generate rhythm - robotic', () => {
		// given
		Random.setSeed('test');

		// when
		const rhythm = generateFreeRhythm(ONE_BAR, robotic);

		// then
		expect(rhythm).toLastAround(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 240,
		    "time": 0,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 300,
		    "time": 240,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 420,
		    "time": 300,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 480,
		    "time": 420,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 600,
		    "time": 480,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 720,
		    "time": 600,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 780,
		    "time": 720,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 840,
		    "time": 780,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 960,
		    "time": 840,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 1020,
		    "time": 960,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 1080,
		    "time": 1020,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 1140,
		    "time": 1080,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1260,
		    "time": 1140,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1380,
		    "time": 1260,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1620,
		    "time": 1380,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1740,
		    "time": 1620,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1860,
		    "time": 1740,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "next": 1920,
		    "time": 1860,
		  },
		]
	`);
	});

	it('should generate rhythm - straight', () => {
		// given
		Random.setSeed('test');

		// when
		const rhythm = generateFreeRhythm(ONE_BAR, straight, [ '8n' ]);

		// then
		expect(rhythm).toLastAround(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 240,
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 480,
		    "time": 240,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 600,
		    "time": 480,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 840,
		    "time": 600,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1080,
		    "time": 840,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1200,
		    "time": 1080,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1440,
		    "time": 1200,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 1680,
		    "time": 1440,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1920,
		    "time": 1680,
		  },
		]
	`);
	});

	it('should generate mixed', () => {
		Random.setSeed('test');

		// when
		const durations = chooseMany(mixed, Random.int(R.length(mixed)));
		const rhythm = Rhythm.free(
			'1:0:0',
			mixed,
			durations,
			distribute.decreasing,
		);

		// then
		expect(rhythm).toLastAround(ONE_BAR);
	});

	it('should break', () => {
		// given
		Random.setSeed('test');

		// when
		const error = () => generateFreeRhythm(ONE_BAR / 8, slow);

		// then
		expect(error).toThrowError();
	});
});
