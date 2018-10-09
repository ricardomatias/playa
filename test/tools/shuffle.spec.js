import { shuffle } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G', 'B', 'Eb' ];

describe('A Shuffle test suite', () => {
	it('should shuffle the array', () => {
		for (let index = 0; index < 25; index++) {
			shuffle(AM7);

			expect(AM7).to.not.eql([ 'A', 'C', 'E', 'G', 'B', 'Eb' ]);
		}
	});
});
