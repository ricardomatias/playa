import { TICKS } from '../../../lib/constants';
import { Random, Rhythm, Time } from '../../../lib/tools';

const { calcDuration } = Time;

const ONE_BAR = TICKS.get('1n');

describe('#turn', () => {
	it('should generate turn rhythm', () => {
		// given
		Random.setSeed('test');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 2, 7, {
			combSorting: { diverseFirst: true },
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 2);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "time": 0,
		  },
		  Object {
		    "dur": 480,
		    "time": 480,
		  },
		  Object {
		    "dur": 480,
		    "time": 960,
		  },
		  Object {
		    "dur": 640,
		    "time": 1440,
		  },
		  Object {
		    "dur": 640,
		    "time": 2080,
		  },
		  Object {
		    "dur": 480,
		    "time": 2720,
		  },
		  Object {
		    "dur": 640,
		    "time": 3200,
		  },
		]
	`);
	});

	it('should generate interesting turn rhythm', () => {
		// given
		Random.setSeed('foobar');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 2, 7, {
			combSorting: { diverseFirst: true },
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 2);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "time": 240,
		  },
		  Object {
		    "dur": 240,
		    "time": 480,
		  },
		  Object {
		    "dur": 240,
		    "time": 720,
		  },
		  Object {
		    "dur": 240,
		    "time": 960,
		  },
		  Object {
		    "dur": 1440,
		    "time": 1200,
		  },
		  Object {
		    "dur": 1200,
		    "time": 2640,
		  },
		]
	`);
	});

	it('should generate turn rhythm - with min note value', () => {
		// given
		Random.setSeed('test');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 3, 8, {
			minNoteValue: 4,
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 3);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 640,
		    "time": 0,
		  },
		  Object {
		    "dur": 960,
		    "time": 640,
		  },
		  Object {
		    "dur": 640,
		    "time": 1600,
		  },
		  Object {
		    "dur": 320,
		    "time": 2240,
		  },
		  Object {
		    "dur": 640,
		    "time": 2560,
		  },
		  Object {
		    "dur": 320,
		    "time": 3200,
		  },
		  Object {
		    "dur": 960,
		    "time": 3520,
		  },
		  Object {
		    "dur": 1280,
		    "time": 4480,
		  },
		]
	`);
	});

	it('should generate turn rhythm - with sorting similar first', () => {
		// given
		Random.setSeed('foo-bar');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 3, 5, {
			combSorting: { similarFirst: true },
			minNoteValue: 2,
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 3);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 960,
		    "time": 0,
		  },
		  Object {
		    "dur": 960,
		    "time": 960,
		  },
		  Object {
		    "dur": 960,
		    "time": 1920,
		  },
		  Object {
		    "dur": 960,
		    "time": 2880,
		  },
		  Object {
		    "dur": 1920,
		    "time": 3840,
		  },
		]
	`);
	});

	it('should generate turn rhythm long bar', () => {
		// given
		Random.setSeed('foo-bar');

		// when
		const rhythm = Rhythm.turn(ONE_BAR * 8, 4, {
			minNoteValue: 8,
			combSorting: {
				diverseFirst: true,
			},
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 8);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 3840,
		    "time": 0,
		  },
		  Object {
		    "dur": 3840,
		    "time": 3840,
		  },
		  Object {
		    "dur": 3840,
		    "time": 7680,
		  },
		  Object {
		    "dur": 3840,
		    "time": 11520,
		  },
		]
	`);
	});
});
