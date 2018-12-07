import { seedRandom } from '../../lib/tools/random';
import { shuffle } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G', 'B', 'Eb' ];

describe('A Shuffle test suite', () => {
	it('should shuffle the array', () => {
		seedRandom('test');

		for (let index = 0; index < 25; index++) {
			const shuffledAM7 = shuffle(AM7);

			expect(shuffledAM7).to.not.eql([ 'A', 'C', 'E', 'G', 'B', 'Eb' ]);
		}
	});
});
