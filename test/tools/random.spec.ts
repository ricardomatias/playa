import random, { Random } from '../../lib/tools/random';

describe('A random test suite', () => {
	it('should return singleton', () => {
		random.setSeed('test');

		expect(random.int(10)).toEqual(2);
	});

	it('should create new random', () => {
		const rnd = new Random();

		expect(rnd.int(10)).toEqual(3);
	});
});
