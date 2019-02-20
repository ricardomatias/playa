import { seedRandom } from '../../lib/tools/random';
import drums from '../../lib/functional/drums';


describe('A Drums test suite', () => {
	it('should generate 2 parts', () => {
		seedRandom('test');

		// when
		const drum = drums(4, [ 2, 1 ]);

		// then
		expect(drum.patterns[0]).toEqual([ 'x', '-', 'x', '-' ]);
		expect(drum.patterns[1]).toEqual([ 'x', '-', '-', '-' ]);
		expect(drum.subdivision).toBe('4n');
	});

	it('should generate 4 parts', () => {
		seedRandom('test');

		// when
		const drum = drums(8, [ 4, 2, 8, 5 ]);

		// then
		expect(drum.patterns[0]).toEqual([ 'x', '-', 'x', '-', 'x', '-', 'x', '-' ]);
		expect(drum.patterns[1]).toEqual([ 'x', '-', '-', '-', 'x', '-', '-', '-' ]);
		expect(drum.patterns[2]).toEqual([ 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x' ]);
		expect(drum.patterns[3]).toEqual([ 'x', '-', 'x', '-', 'x', 'x', '-', 'x' ]);
		expect(drum.subdivision).toBe('8n');
	});

	it('should generate 4 parts randomly', () => {
		seedRandom('test2');

		// when
		const drum = drums(8, [ 4, 2, 8, 5 ], true);

		// then
		expect(drum.patterns[0]).toEqual([ 'x', '-', '-', '-', 'x', '-', '-', '-' ]);
		expect(drum.patterns[1]).toEqual([ 'x', '-', '-', 'x', '-', '-', 'x', '-' ]);
		expect(drum.patterns[2]).toEqual([ 'x', '-', 'x', 'x', 'x', '-', 'x', 'x' ]);
		expect(drum.patterns[3]).toEqual([ 'x', '-', 'x', '-', 'x', '-', 'x', '-' ]);
		expect(drum.subdivision).toBe('8n');
	});
});
