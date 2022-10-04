import { Events, Rhythm } from '../../../lib/composition';
import { Ticks } from '../../../lib/constants';
import { random } from '../../../lib/tools';
import '../../matchers';

describe('#splitEvery', () => {
	it('should splitEvery simple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('4:0:0', ['1n']);

		// when
		const result = Events.splitEvery(rhythm, '1:0:0');

		// then
		expect(result[0]).toLastAround(1920);
		expect(result).toMatchInlineSnapshot(`
		[
		  [
		    {
		      "dur": 1920,
		      "isRest": false,
		      "next": 1920,
		      "time": 0,
		    },
		  ],
		  [
		    {
		      "dur": 1920,
		      "isRest": false,
		      "next": 3840,
		      "time": 1920,
		    },
		  ],
		  [
		    {
		      "dur": 1920,
		      "isRest": false,
		      "next": 5760,
		      "time": 3840,
		    },
		  ],
		  [
		    {
		      "dur": 1920,
		      "isRest": false,
		      "next": 7680,
		      "time": 5760,
		    },
		  ],
		]
	`);
	});

	it('should splitEvery 8n simple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const result = Events.splitEvery(rhythm, '4n');

		// then
		expect(result[0]).toLastAround(480);
		expect(result).toMatchInlineSnapshot(`
		[
		  [
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 240,
		      "time": 0,
		    },
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 480,
		      "time": 240,
		    },
		  ],
		  [
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 720,
		      "time": 480,
		    },
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 960,
		      "time": 720,
		    },
		  ],
		  [
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 1200,
		      "time": 960,
		    },
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 1440,
		      "time": 1200,
		    },
		  ],
		  [
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 1680,
		      "time": 1440,
		    },
		    {
		      "dur": 240,
		      "isRest": false,
		      "next": 1920,
		      "time": 1680,
		    },
		  ],
		]
	`);
	});

	it('should splitEvery complex', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', ['16n', '8n', '8nt', '16nt']);

		// when
		const result = Events.splitEvery(rhythm, '4n');

		// then
		expect(result[0]).toLastAround(Ticks['4n']);
		expect(result).toMatchSnapshot();
	});

	it('should splitEveryIndicies', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n', '4nd']);

		// when
		const pattern = Events.splitEvery(rhythm, '4n');
		const result = Events.splitEveryIndices(rhythm, '4n');
		const convert = result.map((bracket) => bracket.map((i) => rhythm[i]));

		// then
		expect(convert).toEqual(expect.arrayContaining(pattern));
	});
});
