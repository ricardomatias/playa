import * as R from 'ramda';
import { TICKS } from '../../../lib/constants';
import { calcDuration } from '../../../lib/utils';
import { Random, Rhythm, distribute, choose } from '../../../lib/tools';

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
		expect(calcDuration(rhythm)).toBe(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": -1,
		    "next": 480,
		    "note": "",
		    "time": 0,
		  },
		  Object {
		    "dur": 160,
		    "isRest": false,
		    "midi": -1,
		    "next": 160,
		    "note": "",
		    "time": 480,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 640,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 880,
		  },
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "midi": -1,
		    "next": 320,
		    "note": "",
		    "time": 1000,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 1320,
		  },
		  Object {
		    "dur": 360,
		    "isRest": false,
		    "midi": -1,
		    "next": 360,
		    "note": "",
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
		expect(calcDuration(rhythm)).toBe(ONE_BAR * 2);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": -1,
		    "next": 480,
		    "note": "",
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 480,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "midi": -1,
		    "next": 480,
		    "note": "",
		    "time": 720,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "midi": -1,
		    "next": 720,
		    "note": "",
		    "time": 1200,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": -1,
		    "next": 480,
		    "note": "",
		    "time": 1920,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "midi": -1,
		    "next": 720,
		    "note": "",
		    "time": 2400,
		  },
		  Object {
		    "dur": 720,
		    "isRest": true,
		    "midi": -1,
		    "next": 720,
		    "note": "",
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
		expect(calcDuration(rhythm)).toBe(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 0,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
		    "time": 240,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 300,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
		    "time": 420,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 480,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 600,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
		    "time": 720,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
		    "time": 780,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 840,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
		    "time": 960,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
		    "time": 1020,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
		    "time": 1080,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 1140,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 1260,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 1380,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 1620,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 1740,
		  },
		  Object {
		    "dur": 60,
		    "isRest": false,
		    "midi": -1,
		    "next": 60,
		    "note": "",
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
		expect(calcDuration(rhythm)).toBe(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 240,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 480,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 600,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 840,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 120,
		    "note": "",
		    "time": 1080,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 1200,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 1440,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "midi": -1,
		    "next": 240,
		    "note": "",
		    "time": 1680,
		  },
		]
	`);
	});

	it('should generate mixed', () => {
		Random.setSeed('test');

		// when
		const durations = choose(mixed, Random.int(R.length(mixed)));
		const rhythm = Rhythm.free(
			'1:0:0',
			mixed,
			durations,
			distribute.decreasing,
		);

		// then
		expect(calcDuration(rhythm)).toBe(ONE_BAR);
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
