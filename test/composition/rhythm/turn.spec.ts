import { describe, it, expect, beforeEach } from 'vitest';
import { Ticks } from '../../../lib/constants';
import { Time } from '../../../lib/core';
import { Rhythm } from '../../../lib/composition';
import { random } from '../../../lib/tools';
import '../../matchers';

const ONE_BAR = Ticks['1n'];

describe('#turn', () => {
	beforeEach(random.reset);

	it('should generate turn rhythm basic', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.turn(new Time('2:0:0'), 7);

		// then
		expect(rhythm).toLastAround(ONE_BAR * 2);
		expect(rhythm).toHaveLength(7);
		expect(rhythm).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 160,
		    "time": 0,
		  },
		  {
		    "dur": 80,
		    "isRest": false,
		    "next": 240,
		    "time": 160,
		  },
		  {
		    "dur": 720,
		    "isRest": false,
		    "next": 960,
		    "time": 240,
		  },
		  {
		    "dur": 720,
		    "isRest": false,
		    "next": 1680,
		    "time": 960,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "next": 1920,
		    "time": 1680,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "next": 2880,
		    "time": 1920,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "next": 3840,
		    "time": 2880,
		  },
		]
	`);
	});

	it('should generate turn rhythm with 3/4 time signature', () => {
		// given
		random.setSeed('test');

		const length = new Time('2:0:0', [3, 4]);

		// when
		const rhythm = Rhythm.turn(length, 6);

		// then
		expect(rhythm).toLastAround(length.ticks);
		expect(rhythm).toHaveLength(6);
		expect(rhythm).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 160,
		    "time": 0,
		  },
		  {
		    "dur": 80,
		    "isRest": false,
		    "next": 240,
		    "time": 160,
		  },
		  {
		    "dur": 80,
		    "isRest": false,
		    "next": 320,
		    "time": 240,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "next": 1280,
		    "time": 320,
		  },
		  {
		    "dur": 320,
		    "isRest": false,
		    "next": 1600,
		    "time": 1280,
		  },
		  {
		    "dur": 1280,
		    "isRest": false,
		    "next": 2880,
		    "time": 1600,
		  },
		]
	`);
	});

	it('should generate with sorting diverseFirst', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 2, 7, {
			combSorting: { diverseFirst: true },
		});

		// then
		expect(rhythm).toLastAround(ONE_BAR * 2);
		expect(rhythm).toHaveLength(7);
		expect(rhythm).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 160,
		    "time": 0,
		  },
		  {
		    "dur": 80,
		    "isRest": false,
		    "next": 240,
		    "time": 160,
		  },
		  {
		    "dur": 80,
		    "isRest": false,
		    "next": 320,
		    "time": 240,
		  },
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 480,
		    "time": 320,
		  },
		  {
		    "dur": 1280,
		    "isRest": false,
		    "next": 1760,
		    "time": 480,
		  },
		  {
		    "dur": 1440,
		    "isRest": false,
		    "next": 3200,
		    "time": 1760,
		  },
		  {
		    "dur": 640,
		    "isRest": false,
		    "next": 3840,
		    "time": 3200,
		  },
		]
	`);
	});

	it('should generate with min note value', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 3, 8, {
			minNoteValue: 4,
		});

		// then
		expect(rhythm).toLastAround(ONE_BAR * 3);
		expect(rhythm).toHaveLength(8);
		expect(rhythm).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 320,
		    "isRest": false,
		    "next": 320,
		    "time": 0,
		  },
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 480,
		    "time": 320,
		  },
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 640,
		    "time": 480,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "next": 1600,
		    "time": 640,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "next": 2560,
		    "time": 1600,
		  },
		  {
		    "dur": 640,
		    "isRest": false,
		    "next": 3200,
		    "time": 2560,
		  },
		  {
		    "dur": 1280,
		    "isRest": false,
		    "next": 4480,
		    "time": 3200,
		  },
		  {
		    "dur": 1280,
		    "isRest": false,
		    "next": 5760,
		    "time": 4480,
		  },
		]
	`);
	});

	it('should generate with sorting similar first', () => {
		// given
		random.setSeed('foo-bar');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 3, 5, {
			combSorting: { similarFirst: true },
			minNoteValue: 2,
		});

		// then
		expect(rhythm).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 640,
		    "isRest": false,
		    "next": 640,
		    "time": 0,
		  },
		  {
		    "dur": 320,
		    "isRest": false,
		    "next": 960,
		    "time": 640,
		  },
		  {
		    "dur": 320,
		    "isRest": false,
		    "next": 1280,
		    "time": 960,
		  },
		  {
		    "dur": 1920,
		    "isRest": false,
		    "next": 3200,
		    "time": 1280,
		  },
		  {
		    "dur": 1920,
		    "isRest": false,
		    "next": 5120,
		    "time": 3200,
		  },
		]
	`);

		expect(rhythm).toLastAround(5120);
		expect(rhythm).toHaveLength(5);
	});

	it('should generate turn rhythm long bar', () => {
		// given
		random.setSeed('foo-bar');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 8, 4);

		// then
		expect(rhythm).toLastAround(ONE_BAR * 8);
		expect(rhythm).toHaveLength(4);
		expect(rhythm).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 3840,
		    "isRest": false,
		    "next": 3840,
		    "time": 0,
		  },
		  {
		    "dur": 3840,
		    "isRest": false,
		    "next": 7680,
		    "time": 3840,
		  },
		  {
		    "dur": 3840,
		    "isRest": false,
		    "next": 11520,
		    "time": 7680,
		  },
		  {
		    "dur": 3840,
		    "isRest": false,
		    "next": 15360,
		    "time": 11520,
		  },
		]
	`);
	});

	it('should generate a short turn rhythm', () => {
		// given
		random.setSeed('foo-bar');

		// when
		const rhythm = Rhythm.turn(960, 3, {
			minNoteValue: 4,
			combSorting: {
				diverseFirst: true,
			},
		});

		// then
		expect(rhythm).toLastAround(960);
		expect(rhythm).toHaveLength(3);
		expect(rhythm).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 320,
		    "isRest": false,
		    "next": 320,
		    "time": 0,
		  },
		  {
		    "dur": 160,
		    "isRest": false,
		    "next": 480,
		    "time": 320,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "next": 960,
		    "time": 480,
		  },
		]
	`);
	});
});
