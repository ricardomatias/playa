import Random from '../../lib/tools/random';
import { shuffle } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G', 'B', 'Eb' ];

describe('A Shuffle test suite', () => {
	it('should shuffle the array', () => {
		Random.setSeed('test');

		for (let index = 0; index < 10; index++) {
			const shuffledAM7 = shuffle(AM7);

			expect(shuffledAM7).not.toEqual([ 'A', 'C', 'E', 'G', 'B', 'Eb' ]);
		}
	});
});
