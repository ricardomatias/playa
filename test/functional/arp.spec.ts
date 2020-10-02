import Random from '../../lib/tools/random';
import { createArp } from '../../lib/functional/arp';
import { Scale, Chord, TOff } from '../../lib/core';
import { free } from '../../lib/tools/rhythm';

describe('An Arp test suite', () => {
	it('should create arp', () => {
		Random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

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
		    "next": 720,
		    "note": "E4",
		    "time": 480,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 74,
		    "next": 1680,
		    "note": "D4",
		    "time": 720,
		  },
		]
	`);
	});

	it('should create with custom start time', () => {
		Random.setSeed('test');

		const chord = new Chord('Amaj');

		const arp = createArp(chord, [ 1, 5, 3 ], [ '4n', '8n', '2n' ], '0:0:2');

		expect(arp).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 69,
		    "next": 720,
		    "note": "A3",
		    "time": 240,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 960,
		    "note": "E4",
		    "time": 720,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 73,
		    "next": 1920,
		    "note": "C#4",
		    "time": 960,
		  },
		]
	`);
	});

	it('should wrap around when there are more notes', () => {
		Random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

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
		    "next": 720,
		    "note": "E4",
		    "time": 480,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 74,
		    "next": 1680,
		    "note": "D4",
		    "time": 720,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 76,
		    "next": 2160,
		    "note": "E4",
		    "time": 1680,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 71,
		    "next": 2400,
		    "note": "B3",
		    "time": 2160,
		  },
		  Object {
		    "dur": 960,
		    "isRest": false,
		    "midi": 69,
		    "next": 3360,
		    "note": "A3",
		    "time": 2400,
		  },
		  Object {
		    "dur": 480,
		    "isRest": false,
		    "midi": 71,
		    "next": 3840,
		    "note": "B3",
		    "time": 3360,
		  },
		]
	`);
	});

	it('should create complex arp', () => {
		Random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		const arp = createArp(
			scale,
			[ 2, 5, 3 ],
			free('0:3:2', [ '8n', '16n' ], [ '16n', '4n' ]),
			TOff.ticks,
		);

		expect(arp).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 71,
		    "next": 480,
		    "note": "B3",
		    "time": 240,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 600,
		    "note": "E4",
		    "time": 480,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 73,
		    "next": 720,
		    "note": "C#4",
		    "time": 600,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 840,
		    "note": "B3",
		    "time": 720,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 960,
		    "note": "E4",
		    "time": 840,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 73,
		    "next": 1200,
		    "note": "C#4",
		    "time": 960,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 1320,
		    "note": "B3",
		    "time": 1200,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 1440,
		    "note": "E4",
		    "time": 1320,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 73,
		    "next": 1680,
		    "note": "C#4",
		    "time": 1440,
		  },
		  Object {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 1800,
		    "note": "B3",
		    "time": 1680,
		  },
		  Object {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 2040,
		    "note": "E4",
		    "time": 1800,
		  },
		]
	`);
	});
});
