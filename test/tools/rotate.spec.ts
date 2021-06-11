import random from '../../lib/tools/random';
import { rotate } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G', 'B', 'Eb' ];

describe('A Rotate test suite', () => {
	it('should rotate the array', () => {
		random.setSeed('test');

		let rotatedAM7 = rotate(AM7);

		expect(rotatedAM7).toEqual([ 'C', 'E', 'G', 'B', 'Eb', 'A' ]);

		rotatedAM7 = rotate(rotatedAM7, 3);

		expect(rotatedAM7).toEqual([ 'B', 'Eb', 'A', 'C', 'E', 'G' ]);
	});
});
