import { seedRandom } from '../../lib/tools/random';
import { times } from '../../lib/tools';

describe('A times test suite', () => {
	it('should do something n times', () => {
		seedRandom('test');

		const result = [];

		times(() => (result.push(0)), 5);

		expect(result).to.have.length(5);
	});
});
