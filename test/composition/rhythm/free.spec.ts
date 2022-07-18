import * as R from 'ramda';
import { Ticks } from '../../../lib/constants';
import { Time } from '../../../lib/core';
import { random, distribute, chooseMany } from '../../../lib/tools';
import * as Rhythm from '../../../lib/composition/rhythm';
import '../../matchers';

const ONE_BAR = Ticks['1n'];

describe('#Rhythm.free', () => {
	it('should generate rhythm - decreasing', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.free(ONE_BAR, Rhythm.Presets.Mixed, [], distribute.decreasing);

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
		    "dur": 480,
		    "isRest": false,
		    "next": 720,
		    "time": 240,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 1200,
		    "time": 720,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1440,
		    "time": 1200,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 1920,
		    "time": 1440,
		  },
		]
	`);
	});

	it('should generate rhythm - slow', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.free(ONE_BAR * 2, Rhythm.Presets.Slow, ['4n', '4nd']);

		// then
		expect(rhythm).toLastAround(ONE_BAR * 2);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 240,
		    "time": 0,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 720,
		    "time": 240,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 1440,
		    "time": 720,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 2160,
		    "time": 1440,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 2640,
		    "time": 2160,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 2880,
		    "time": 2640,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 3600,
		    "time": 2880,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 3840,
		    "time": 3600,
		  },
		]
	`);
	});

	it('should generate rhythm - robotic', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.free(ONE_BAR, Rhythm.Presets.Robotic);

		// then
		expect(rhythm).toLastAround(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 120,
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 360,
		    "time": 120,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 600,
		    "time": 360,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 720,
		    "time": 600,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 960,
		    "time": 720,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1200,
		    "time": 960,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1440,
		    "time": 1200,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1560,
		    "time": 1440,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1680,
		    "time": 1560,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1800,
		    "time": 1680,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "next": 1920,
		    "time": 1800,
		  },
		]
	`);
	});

	it('should generate rhythm - straight', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.free(ONE_BAR, Rhythm.Presets.Straight, ['8n']);

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
		    "dur": 240,
		    "isRest": true,
		    "next": 480,
		    "time": 240,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 720,
		    "time": 480,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 960,
		    "time": 720,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 1200,
		    "time": 960,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1440,
		    "time": 1200,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1680,
		    "time": 1440,
		  },
		  Object {
		    "dur": 240,
		    "isRest": true,
		    "next": 1920,
		    "time": 1680,
		  },
		]
	`);
	});

	it('should generate mixed', () => {
		random.setSeed('test');

		// when
		const durations = chooseMany(Rhythm.Presets.Mixed, random.int(R.length(Rhythm.Presets.Mixed)));
		const rhythm = Rhythm.free('1:0:0', Rhythm.Presets.Mixed, durations, distribute.decreasing);

		// then
		expect(rhythm).toLastAround(ONE_BAR);
	});

	it('should respect different time signature', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.free(new Time('1:0:0', [7, 8]), ['4n', '8n']);

		// then
		expect(rhythm).toLastAround(Ticks['8n'] * 7);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 480,
		    "time": 0,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 960,
		    "time": 480,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 1440,
		    "time": 960,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "next": 1680,
		    "time": 1440,
		  },
		]
	`);
	});

	it('should break', () => {
		// given
		random.setSeed('test');

		// when
		const error = () => Rhythm.free(ONE_BAR / 8, Rhythm.Presets.Slow);

		// then
		expect(error).toThrowError();
	});
});
