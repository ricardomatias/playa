import { choose } from '../../lib/tools';
import { seedRandom } from '../../lib/tools/random';

const AM7 = [ 'A', 'C', 'E', 'G' ];

describe('A Choose test suite', () => {
	beforeAll(() => seedRandom('CHOOSE'));

	it('should return a random element', () => {
		expect(choose(AM7)).toBe('E');
		expect(choose(AM7)).toBe('C');
		expect(choose(AM7)).toBe('E');
		expect(choose(AM7)).toBe('E');
		expect(choose(AM7)).toBe('G');
	});
});
