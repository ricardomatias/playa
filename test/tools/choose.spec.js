import { choose } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G' ];

describe('A Choose test suite', () => {
	it('should return an element', () => {
		for (let index = 0; index < 100; index++) {
			expect(choose(AM7)).to.not.be.empty;
		}
	});
});
