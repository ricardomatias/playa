import { choose } from '../../lib/tools';
import { seedRandom } from '../../lib/tools/random';

const AM7 = [ 'A', 'C', 'E', 'G' ];

describe('A Choose test suite', () => {
	beforeAll(() => seedRandom('CHOOSE'));

	it('should return a random element', () => {
		expect(choose(AM7)).toBe('C');
		expect(choose(AM7)).toBe('E');
	});

	it('should return 2 random elements', () => {
		const [ first, second ] = choose(AM7, 2);

		expect(first).toBe('E');
		expect(second).toBe('G');
	});

	it('should return 2 random elements but never a C', () => {
		const [ first, second ] = choose(AM7, 2, 'C');

		expect(first).toBe('E');
		expect(second).toBe('A');
	});
});
