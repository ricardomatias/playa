import { interval } from '../../lib/tools';

describe('An Interval test suite', () => {
	describe('#get', () => {
		it('should return interval when given semitones', () => {
			const result = interval.fromSemitones(4);

			expect(result).toEqual(['3M']);
		});

		it('should return null', () => {
			const result = interval.fromSemitones(100);

			expect(result).toBeNull();
		});
	});

	describe('#invert', () => {
		it('should invert 3m -> 6M', () => {
			const result = interval.invert('3m');

			expect(result).toEqual(['6M']);
		});

		it('should invert 7m -> 6M', () => {
			const result = interval.invert('7m');

			expect(result).toEqual(['2M']);
		});

		it('should invert 3m -> 6M', () => {
			const result = interval.invert('9m');

			expect(result).toBeNull();
		});
	});

	describe('#add', () => {
		it('should add 3M + 3M', () => {
			const result = interval.add('3M', '3M');

			expect(result).toEqual(['5A', '6m']);
		});

		it('should add 7m + 3M', () => {
			const result = interval.add('7m', '3M');

			expect(result).toEqual(['9M']);
		});

		it('should be null', () => {
			const result = interval.add('13M', '3M');

			expect(result).toBeNull();
		});
	});

	describe('#subtract', () => {
		it('should add 9m - 3m', () => {
			const result = interval.subtract('9m', '3m');

			expect(result).toEqual(['7m']);
		});

		it('should be null', () => {
			const result = interval.subtract('2m', '3m');

			expect(result).toBeNull();
		});
	});

	describe('#exist', () => {
		it('should exist', () => {
			const result = interval.exists('9m');

			expect(result).toBeTruthy();
		});

		it('should not exist', () => {
			const result = interval.exists('55P' as any);

			expect(result).toBeFalsy();
		});
	});

	describe('#separate', () => {
		it('should work', () => {
			const result = interval.separate('1P 2M 9M');

			expect(result).toEqual(['1P', '2M', '9M']);
		});

		it('should filter out invalid', () => {
			const result = interval.separate('1P 55P 9M');

			expect(result).toEqual(['1P', '9M']);
		});
	});

	describe('#positions', () => {
		it('should work', () => {
			const result = interval.positions('1P 3m 4A 5d 9M 13M');

			expect(result).toEqual([1, 3, 4, 5, 9, 13]);
		});
		it('should filter out invalid', () => {
			const result = interval.positions('1P 55P 9M');

			expect(result).toEqual([1, 9]);
		});
	});
});
