import { interval, add, subtract, invert } from '../../lib/tools';

describe('An Interval test suite', () => {
	describe('#get', () => {
		it('should return interval when given semitones', () => {
			const result = interval(4);

			expect(result).toEqual(['3M']);
		});

		it('should return null', () => {
			const result = interval(100);

			expect(result).toBeNull();
		});
	});

	describe('#invert', () => {
		it('should invert 3m -> 6M', () => {
			const result = invert('3m');

			expect(result).toEqual(['6M']);
		});

		it('should invert 7m -> 6M', () => {
			const result = invert('7m');

			expect(result).toEqual(['2M']);
		});

		it('should invert 3m -> 6M', () => {
			const result = invert('9m');

			expect(result).toBeNull();
		});
	});

	describe('#add', () => {
		it('should add 3M + 3M', () => {
			const result = add('3M', '3M');

			expect(result).toEqual(['5A', '6m']);
		});

		it('should add 7m + 3M', () => {
			const result = add('7m', '3M');

			expect(result).toEqual(['9M']);
		});

		it('should be null', () => {
			const result = add('13M', '3M');

			expect(result).toBeNull();
		});
	});

	describe('#subtract', () => {
		it('should add 9m - 3m', () => {
			const result = subtract('9m', '3m');

			expect(result).toEqual(['7m']);
		});

		it('should be null', () => {
			const result = subtract('2m', '3m');

			expect(result).toBeNull();
		});
	});
});
