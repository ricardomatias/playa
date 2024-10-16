import { describe, it, expect } from 'vitest';
import { Events, Rhythm } from '../../../lib/composition';
import { random } from '../../../lib/tools';
import '../../matchers';

describe('#splitAt', () => {
	it('should splitAt simple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', ['4n']);

		// when
		const result = Events.splitAt(rhythm, '1:0:0');

		// then
		expect(result[0]).toLastAround(1920);
		expect(result).toMatchInlineSnapshot(`
		[
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
		      "dur": 480,
		      "isRest": false,
		      "next": 1920,
		      "time": 1440,
		    },
		  ],
		  [
		    {
		      "dur": 480,
		      "isRest": false,
		      "next": 2400,
		      "time": 1920,
		    },
		    {
		      "dur": 480,
		      "isRest": false,
		      "next": 2880,
		      "time": 2400,
		    },
		    {
		      "dur": 480,
		      "isRest": false,
		      "next": 3360,
		      "time": 2880,
		    },
		    {
		      "dur": 480,
		      "isRest": false,
		      "next": 3840,
		      "time": 3360,
		    },
		  ],
		]
	`);
	});

	it('should splitAt all complex', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const result = Events.splitAt(rhythm, '1:0:0');

		// then
		expect(result[0]).toLastAround(1920);
		// expect(result).toMatchInlineSnapshot();
	});

	it('should splitAt complex', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', ['1nt', '2nd']);

		// when
		const result = Events.splitAt(rhythm, '1:0:0');

		// then
		expect(result[0]).toLastAround(1920);
		expect(result).toMatchInlineSnapshot(`
		[
		  [
		    {
		      "dur": 1280,
		      "isRest": false,
		      "next": 1280,
		      "time": 0,
		    },
		    {
		      "dur": 1280,
		      "isRest": false,
		      "next": 2560,
		      "time": 1280,
		    },
		  ],
		  [
		    {
		      "dur": 1280,
		      "isRest": false,
		      "next": 3840,
		      "time": 2560,
		    },
		  ],
		]
	`);
	});
});
