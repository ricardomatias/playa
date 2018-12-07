import { seedRandom } from '../../lib/tools/random';
import { rotate } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G', 'B', 'Eb' ];

describe('A Rotate test suite', () => {
	it('should rotate the array', () => {
		seedRandom('test');

		let rotatedAM7 = rotate(AM7);

		expect(rotatedAM7).to.not.eql([ 'C', 'E', 'G', 'B', 'Eb', 'A' ]);

		rotatedAM7 = rotate(rotatedAM7, 3);

		expect(rotatedAM7).to.not.eql([ 'B', 'Eb', 'A', 'C', 'E', 'G' ]);
	});
});
