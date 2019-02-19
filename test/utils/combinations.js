import findCombinationsSum from '../../lib/utils/combinations';

describe('A CombinationSum test suite', () => {
	it('should find combinations', () => {
		const total = 7;

		const combinations = findCombinationsSum(total);

		expect(combinations).to.eql([
			[ '1', '1', '2', '3' ],
			[ '1', '1', '5' ],
			[ '1', '2', '2', '2' ],
			[ '1', '2', '4' ],
			[ '1', '3', '3' ],
			[ '1', '6' ],
			[ '2', '2', '3' ],
			[ '2', '5' ],
			[ '3', '4' ],
		]);
	});

	it('should find combinations with 3 max ones', () => {
		const total = 9;

		const combinations = findCombinationsSum(total, 3);

		expect(combinations).to.eql([
			[ '1', '1', '1', '2', '2', '2' ],
			[ '1', '1', '1', '2', '4' ],
			[ '1', '1', '1', '3', '3' ],
			[ '1', '1', '1', '6' ],
			[ '1', '1', '2', '2', '3' ],
			[ '1', '1', '2', '5' ],
			[ '1', '1', '3', '4' ],
			[ '1', '1', '7' ],
			[ '1', '2', '2', '2', '2' ],
			[ '1', '2', '2', '4' ],
			[ '1', '2', '3', '3' ],
			[ '1', '2', '6' ],
			[ '1', '3', '5' ],
			[ '1', '4', '4' ],
			[ '1', '8' ],
			[ '2', '2', '2', '3' ],
			[ '2', '2', '5' ],
			[ '2', '3', '4' ],
			[ '2', '7' ],
			[ '3', '3', '3' ],
			[ '3', '6' ],
			[ '4', '5' ],
		]);
	});
});

