import { Ticks } from '../../../lib/constants';
import { Time } from '../../../lib/core';
import { Rhythm } from '../../../lib/composition';
import { random } from '../../../lib/tools';
import '../../matchers';

const ONE_BAR = Ticks['1n'];

describe('#turn', () => {
	it('should generate turn rhythm', () => {
		// given
		random.setSeed('test');

		// when
		const rhythm = Rhythm.turn(new Time('2:0:0'), 7);

		// then
		expect(rhythm).toLastAround(ONE_BAR * 2);
		expect(rhythm).toHaveLength(7);
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
		    "dur": 640,
		    "isRest": false,
		    "next": 2080,
		    "time": 1440,
		  },
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "next": 2400,
		    "time": 2080,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 3120,
		    "time": 2400,
		  },
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 3840,
		    "time": 3120,
		  },
		]
	`);
	});

	it('should generate turn rhythm with 3/4 time signature', () => {
		// given
		random.setSeed('test');

		const length = new Time('2:0:0', [ 3, 4 ]);

		// when
		const rhythm = Rhythm.turn(length, 6);

		// then
		expect(rhythm).toLastAround(length.ticks);
		expect(rhythm).toHaveLength(6);
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
		  Object {
		    "dur": 720,
		    "isRest": false,
		    "next": 2400,
		    "time": 1680,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 2880,
		    "time": 2400,
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
		    "dur": 640,
		    "isRest": false,
		    "next": 2080,
		    "time": 1440,
		  },
		  Object {
		    "dur": 640,
		    "isRest": false,
		    "next": 2720,
		    "time": 2080,
		  },
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "next": 3040,
		    "time": 2720,
		  },
		  Object {
		    "dur": 800,
		    "isRest": false,
		    "next": 3840,
		    "time": 3040,
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
		Array [
		  Object {
		    "dur": 640,
		    "isRest": false,
		    "next": 640,
		    "time": 0,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "next": 1600,
		    "time": 640,
		  },
		  Object {
		    "dur": 640,
		    "isRest": false,
		    "next": 2240,
		    "time": 1600,
		  },
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "next": 2560,
		    "time": 2240,
		  },
		  Object {
		    "dur": 640,
		    "isRest": false,
		    "next": 3200,
		    "time": 2560,
		  },
		  Object {
		    "dur": 640,
		    "isRest": false,
		    "next": 3840,
		    "time": 3200,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "next": 4800,
		    "time": 3840,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "next": 5760,
		    "time": 4800,
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
		expect(rhythm).toLastAround(ONE_BAR * 3);
		expect(rhythm).toHaveLength(5);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 640,
		    "isRest": false,
		    "next": 640,
		    "time": 0,
		  },
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "next": 960,
		    "time": 640,
		  },
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "next": 1280,
		    "time": 960,
		  },
		  Object {
		    "dur": 640,
		    "isRest": false,
		    "next": 1920,
		    "time": 1280,
		  },
		  Object {
		    "dur": 3840,
		    "isRest": false,
		    "next": 5760,
		    "time": 1920,
		  },
		]
	`);
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
		Array [
		  Object {
		    "dur": 3840,
		    "isRest": false,
		    "next": 3840,
		    "time": 0,
		  },
		  Object {
		    "dur": 3840,
		    "isRest": false,
		    "next": 7680,
		    "time": 3840,
		  },
		  Object {
		    "dur": 3840,
		    "isRest": false,
		    "next": 11520,
		    "time": 7680,
		  },
		  Object {
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
		Array [
		  Object {
		    "dur": 320,
		    "isRest": false,
		    "next": 320,
		    "time": 0,
		  },
		  Object {
		    "dur": 160,
		    "isRest": false,
		    "next": 480,
		    "time": 320,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "next": 960,
		    "time": 480,
		  },
		]
	`);
	});
});
