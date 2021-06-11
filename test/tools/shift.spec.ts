import random from '../../lib/tools/random';
import { shift } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G', 'B', 'Eb' ];

describe('A Rotate test suite', () => {
	it('should rotate the array', () => {
		random.setSeed('test');

		let shifted = shift(AM7);

		expect(shifted).toEqual([ 'Eb', 'A', 'C', 'E', 'G', 'B' ]);

		shifted = shift(shifted, 3);

		expect(shifted).toEqual([ 'E', 'G', 'B', 'Eb', 'A', 'C' ]);
	});
});
