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
		[
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 240,
		    "time": 0,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 720,
		    "time": 240,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 1200,
		    "time": 720,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 1440,
		    "time": 1200,
		  },
		  {
		    "dur": 320,
		    "isRest": false,
		    "next": 1760,
		    "time": 1440,
		  },
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 1920,
		    "time": 1760,
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
		[
		  {
		    "dur": 720,
		    "isRest": false,
		    "next": 720,
		    "time": 0,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 1200,
		    "time": 720,
		  },
		  {
		    "dur": 480,
		    "isRest": true,
		    "next": 1680,
		    "time": 1200,
		  },
		  {
		    "dur": 720,
		    "isRest": false,
		    "next": 2400,
		    "time": 1680,
		  },
		  {
		    "dur": 960,
		    "isRest": true,
		    "next": 3360,
		    "time": 2400,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 3840,
		    "time": 3360,
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
		[
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 120,
		    "time": 0,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 360,
		    "time": 120,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 600,
		    "time": 360,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 720,
		    "time": 600,
		  },
		  {
		    "dur": 60,
		    "isRest": false,
		    "next": 780,
		    "time": 720,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 900,
		    "time": 780,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 1020,
		    "time": 900,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 1140,
		    "time": 1020,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 1260,
		    "time": 1140,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 1380,
		    "time": 1260,
		  },
		  {
		    "dur": 60,
		    "isRest": false,
		    "next": 1440,
		    "time": 1380,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 1680,
		    "time": 1440,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "next": 1800,
		    "time": 1680,
		  },
		  {
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
		[
		  {
		    "dur": 240,
		    "isRest": true,
		    "next": 240,
		    "time": 0,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 480,
		    "time": 240,
		  },
		  {
		    "dur": 720,
		    "isRest": true,
		    "next": 1200,
		    "time": 480,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 1440,
		    "time": 1200,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 1680,
		    "time": 1440,
		  },
		  {
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
		[
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 480,
		    "time": 0,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 960,
		    "time": 480,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 1440,
		    "time": 960,
		  },
		  {
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
