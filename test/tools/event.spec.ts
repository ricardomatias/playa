import * as R from 'ramda';
import { expandDuration, mapStartToEvent } from '../../lib/tools/event';

describe('An Event tools test suite', () => {
	describe('#expandDuration', () => {
		it('should map pattern - string[]', () => {
			const patt = ['8n', '4n', '2nt'];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
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
			Array [
			  Object {
			    "dur": 480,
			    "isRest": false,
			    "next": 240,
			    "time": 0,
			  },
			  Object {
			    "dur": 600,
			    "isRest": false,
			    "next": 720,
			    "time": 240,
			  },
			  Object {
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
			Object {
			  "dur": 480,
			  "isRest": false,
			  "next": 720,
			  "time": 480,
			}
		`);
		});

		it('should map multiple', () => {
			// when
			const mapd = R.map(mapStartToEvent(480), events);

			// then
			expect(mapd).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "dur": 480,
			    "isRest": false,
			    "next": 720,
			    "time": 480,
			  },
			  Object {
			    "dur": 600,
			    "isRest": false,
			    "next": 1200,
			    "time": 720,
			  },
			  Object {
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
