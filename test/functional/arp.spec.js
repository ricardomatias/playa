import Random from '../../lib/tools/random';
import createArp from '../../lib/functional/arp';
import { Scale, Chord } from '../../lib/core';
import { free } from '../../lib/tools/rhythm';
import { TOff } from '../../lib/constants';

describe('An Arp test suite', () => {
	it('should create arp', () => {
		Random.setSeed('test');

		const scale = new Scale('A', Scale.MAJOR);

		const arp = createArp(scale, [ 1, 5, 4 ], [ '4n', '8n', '2n' ]);

		expect(arp).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 69,
		    "next": 480,
		    "note": "A3",
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 240,
		    "note": "E4",
		    "time": 480,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 74,
		    "next": 960,
		    "note": "D4",
		    "time": 720,
		  },
		]
	`);
	});

	it('should create arp with custom start time', () => {
		Random.setSeed('test');

		const chord = new Chord('Amaj');

		const arp = createArp(chord, [ 1, 5, 3 ], [ '4n', '8n', '2n' ], '0:0:2');

		expect(arp).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 69,
		    "next": 480,
		    "note": "A3",
		    "time": 240,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 240,
		    "note": "E4",
		    "time": 720,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 73,
		    "next": 960,
		    "note": "C#4",
		    "time": 960,
		  },
		]
	`);
	});

	it('should wrap around when there are more notes', () => {
		Random.setSeed('test');

		const scale = new Scale('A', Scale.MAJOR);

		const arp = createArp(scale, [ 1, 5, 4, 5, 2, 1, 2 ], [ '4n', '8n', '2n' ]);

		expect(arp).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 69,
		    "next": 480,
		    "note": "A3",
		    "time": 0,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 240,
		    "note": "E4",
		    "time": 480,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 74,
		    "next": 960,
		    "note": "D4",
		    "time": 720,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 76,
		    "next": 480,
		    "note": "E4",
		    "time": 1680,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 71,
		    "next": 240,
		    "note": "B3",
		    "time": 2160,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 69,
		    "next": 960,
		    "note": "A3",
		    "time": 2400,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 71,
		    "next": 480,
		    "note": "B3",
		    "time": 3360,
		  },
		]
	`);
	});

	it('should create complex arp', () => {
		Random.setSeed('test');

		const scale = new Scale('A', Scale.MAJOR);

		const arp = createArp(
			scale,
			[ 2, 5, 3 ],
			free('0:3:2', [ '8n', '16n' ]),
			TOff.ticks,
		);

		expect(arp).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 71,
		    "next": 240,
		    "note": "B3",
		    "time": 240,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 120,
		    "note": "E4",
		    "time": 480,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 73,
		    "next": 240,
		    "note": "C#4",
		    "time": 600,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 120,
		    "note": "B3",
		    "time": 840,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 120,
		    "note": "E4",
		    "time": 960,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 73,
		    "next": 240,
		    "note": "C#4",
		    "time": 1080,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 120,
		    "note": "B3",
		    "time": 1320,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 120,
		    "note": "E4",
		    "time": 1440,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 73,
		    "next": 240,
		    "note": "C#4",
		    "time": 1560,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 120,
		    "note": "B3",
		    "time": 1800,
		  },
		]
	`);
	});
});
