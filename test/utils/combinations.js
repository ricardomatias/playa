import findCombinationsSum from '../../lib/utils/combinations';

describe('A CombinationSum test suite', () => {
	it('should find combinations', () => {
		const total = 7;

		const combinations = findCombinationsSum(total);

		expect(combinations).toMatchSnapshot();
	});

	it('should find combinations with 3 max ones', () => {
		const total = 9;

		const combinations = findCombinationsSum(total, 3);

		expect(combinations).toMatchSnapshot();
	});
});

