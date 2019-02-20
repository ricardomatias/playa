import { distribute } from '../../lib/tools';

describe('A Distribute test suite', () => {
	it('should distribute equally', () => {
		expect(distribute.equal(5)).toEqual([ '0.200', '0.400', '0.600', '0.800', '1.000' ]);
	});

	it('should distribute descending', () => {
		expect(distribute.descending(5)).toEqual([ '0.400', '0.640', '0.800', '0.914', '1.000' ]);
	});
});
