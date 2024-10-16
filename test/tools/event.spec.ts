import { describe, it, expect } from 'vitest';
import * as R from 'ramda';
import { createPercussion } from '../../lib/composition/percussion';
import { convertBinaryEvents, expandDuration, mapStartToEvent } from '../../lib/tools/event';

describe('An Event tools test suite', () => {
	describe('#convertBinaryEvents', () => {
		it('should convert', () => {
			const perc = createPercussion(8, [4, 2]);
			const events = convertBinaryEvents(perc.patterns[0], perc.subdivision, 'C-2');
			const events2 = convertBinaryEvents(perc.patterns[1], perc.subdivision, 'C2');

			expect(events).toMatchInlineSnapshot(`
			[
			  {
			    "dur": 240,
			    "isRest": false,
			    "midi": 0,
			    "next": 240,
			    "note": "C-2",
			    "time": 0,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 480,
			    "note": "",
			    "time": 240,
			  },
			  {
			    "dur": 240,
			    "isRest": false,
			    "midi": 0,
			    "next": 720,
			    "note": "C-2",
			    "time": 480,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 960,
			    "note": "",
			    "time": 720,
			  },
			  {
			    "dur": 240,
			    "isRest": false,
			    "midi": 0,
			    "next": 1200,
			    "note": "C-2",
			    "time": 960,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 1440,
			    "note": "",
			    "time": 1200,
			  },
			  {
			    "dur": 240,
			    "isRest": false,
			    "midi": 0,
			    "next": 1680,
			    "note": "C-2",
			    "time": 1440,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 1920,
			    "note": "",
			    "time": 1680,
			  },
			]
		`);
			expect(events2).toMatchInlineSnapshot(`
			[
			  {
			    "dur": 240,
			    "isRest": false,
			    "midi": 48,
			    "next": 240,
			    "note": "C2",
			    "time": 0,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 480,
			    "note": "",
			    "time": 240,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 720,
			    "note": "",
			    "time": 480,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 960,
			    "note": "",
			    "time": 720,
			  },
			  {
			    "dur": 240,
			    "isRest": false,
			    "midi": 48,
			    "next": 1200,
			    "note": "C2",
			    "time": 960,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 1440,
			    "note": "",
			    "time": 1200,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 1680,
			    "note": "",
			    "time": 1440,
			  },
			  {
			    "dur": 240,
			    "isRest": true,
			    "midi": -1,
			    "next": 1920,
			    "note": "",
			    "time": 1680,
			  },
			]
		`);
		});
	});

	describe('#expandDuration', () => {
		it('should map pattern - string[]', () => {
			const patt = ['8n', '4n', '2nt'];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
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
			    "dur": 640,
			    "isRest": false,
			    "next": 1360,
			    "time": 720,
			  },
			]
		`);
		});

		it('should return the same - Event[]', () => {
			const patt = [
				{
					time: 0,
					dur: 480,
					next: 240,
					isRest: false,
				},
				{
					dur: 600,
					time: 0,
					next: 480,
					isRest: false,
				},
				{
					dur: 640,
					time: 0,
					isRest: false,
					next: 1360,
				},
			];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
			[
			  {
			    "dur": 480,
			    "isRest": false,
			    "next": 240,
			    "time": 0,
			  },
			  {
			    "dur": 600,
			    "isRest": false,
			    "next": 720,
			    "time": 240,
			  },
			  {
			    "dur": 640,
			    "isRest": false,
			    "next": 1360,
			    "time": 720,
			  },
			]
		`);
		});
	});

	describe('#mapStartToEvent', () => {
		const events = [
			{
				dur: 480,
				isRest: false,
				next: 240,
				time: 0,
			},
			{
				dur: 600,
				isRest: false,
				next: 720,
				time: 240,
			},
			{
				dur: 640,
				isRest: false,
				next: 1360,
				time: 720,
			},
		];

		it('should map single', () => {
			// when
			const mapd = mapStartToEvent(480, events[0]);

			// then
			expect(mapd).toMatchInlineSnapshot(`
			{
			  "dur": 480,
			  "isRest": false,
			  "next": 720,
			  "time": 480,
			}
		`);
		});

		it('should map multiple', () => {
			// when
			const mapd = R.map((e) => mapStartToEvent(480, e), events);

			// then
			expect(mapd).toMatchInlineSnapshot(`
			[
			  {
			    "dur": 480,
			    "isRest": false,
			    "next": 720,
			    "time": 480,
			  },
			  {
			    "dur": 600,
			    "isRest": false,
			    "next": 1200,
			    "time": 720,
			  },
			  {
			    "dur": 640,
			    "isRest": false,
			    "next": 1840,
			    "time": 1200,
			  },
			]
		`);
		});
	});
});
