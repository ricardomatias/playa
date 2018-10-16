import { choose } from '../../lib/tools';
import { seedRandom } from '../../lib/tools/random';

const AM7 = [ 'A', 'C', 'E', 'G' ];

describe('A Choose test suite', () => {
	before(() => seedRandom('CHOOSE'));

	it('should return a random element', () => {
		expect(choose(AM7)).to.eql('E');
		expect(choose(AM7)).to.eql('C');
		expect(choose(AM7)).to.eql('E');
		expect(choose(AM7)).to.eql('E');
		expect(choose(AM7)).to.eql('G');
	});
});
