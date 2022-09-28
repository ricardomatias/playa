import random from '../../lib/tools/random';
import { createArp, genHarmonicShift } from '../../lib/composition/arp';
import { Scale, Chord, Time } from '../../lib/core';
import { free } from '../../lib/composition/rhythm';

describe('An Arp test suite', () => {
	it('should create arp', () => {
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		const arp = createArp(scale, [1, 5, 4], ['4n', '8n', '2n']);

		expect(arp).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 480,
		    "isRest": false,
		    "midi": 69,
		    "next": 480,
		    "note": "A3",
		    "time": 0,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 720,
		    "note": "E4",
		    "time": 480,
		  },
		  {
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
		random.setSeed('test');

		const chord = Chord.fromName('Amaj');

		const arp = createArp(chord, [1, 5, 3], ['4n', '8n', '2n'], '0:0:2');

		expect(arp).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 480,
		    "isRest": false,
		    "midi": 69,
		    "next": 720,
		    "note": "A3",
		    "time": 240,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 960,
		    "note": "E4",
		    "time": 720,
		  },
		  {
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
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		const arp = createArp(scale, [1, 5, 4, 5, 2, 1, 2], ['4n', '8n', '2n']);

		expect(arp).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 480,
		    "isRest": false,
		    "midi": 69,
		    "next": 480,
		    "note": "A3",
		    "time": 0,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 720,
		    "note": "E4",
		    "time": 480,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "midi": 74,
		    "next": 1680,
		    "note": "D4",
		    "time": 720,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "midi": 76,
		    "next": 2160,
		    "note": "E4",
		    "time": 1680,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 71,
		    "next": 2400,
		    "note": "B3",
		    "time": 2160,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "midi": 69,
		    "next": 3360,
		    "note": "A3",
		    "time": 2400,
		  },
		  {
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
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		const arp = createArp(scale, [2, 5, 3], free('0:3:2', ['8n', '16n'], ['16n', '4n']), Time.TOff.ticks);

		expect(arp).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 71,
		    "next": 480,
		    "note": "B3",
		    "time": 240,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 600,
		    "note": "E4",
		    "time": 480,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 73,
		    "next": 840,
		    "note": "C#4",
		    "time": 600,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 960,
		    "note": "B3",
		    "time": 840,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 1080,
		    "note": "E4",
		    "time": 960,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 73,
		    "next": 1200,
		    "note": "C#4",
		    "time": 1080,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 71,
		    "next": 1320,
		    "note": "B3",
		    "time": 1200,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 76,
		    "next": 1440,
		    "note": "E4",
		    "time": 1320,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 73,
		    "next": 1560,
		    "note": "C#4",
		    "time": 1440,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "midi": 71,
		    "next": 2040,
		    "note": "B3",
		    "time": 1560,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 76,
		    "next": 2280,
		    "note": "E4",
		    "time": 2040,
		  },
		  {
		    "dur": 120,
		    "isRest": false,
		    "midi": 73,
		    "next": 2400,
		    "note": "C#4",
		    "time": 2280,
		  },
		]
	`);
	});

	it('should create with harmonic shifts', () => {
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		const arp = createArp(scale, ['2', '+2', 3, '+3', 7, '--7'] as any, ['4n', '8n', '2n']);

		expect(arp).toMatchInlineSnapshot(`
		[
		  {
		    "dur": 480,
		    "isRest": false,
		    "midi": 71,
		    "next": 480,
		    "note": "B3",
		    "time": 0,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 83,
		    "next": 720,
		    "note": "B4",
		    "time": 480,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "midi": 73,
		    "next": 1680,
		    "note": "C#4",
		    "time": 720,
		  },
		  {
		    "dur": 480,
		    "isRest": false,
		    "midi": 85,
		    "next": 2160,
		    "note": "C#5",
		    "time": 1680,
		  },
		  {
		    "dur": 240,
		    "isRest": false,
		    "midi": 80,
		    "next": 2400,
		    "note": "G#4",
		    "time": 2160,
		  },
		  {
		    "dur": 960,
		    "isRest": false,
		    "midi": 56,
		    "next": 3360,
		    "note": "G#2",
		    "time": 2400,
		  },
		]
	`);
	});

	it('should generate harmonic shift', () => {
		random.setSeed('test');

		expect(genHarmonicShift(10)).toMatchInlineSnapshot(`
		[
		  "+6",
		  "4",
		  "-4",
		  "+3",
		  "+4",
		  "++5",
		  "+4",
		  "-4",
		  "-3",
		  "3",
		]
	`);
	});
});
