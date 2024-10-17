import { describe, it, expect } from 'vitest';
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

	describe('#between', () => {
		it('should return the interval between: C, D', () => {
			const dist = interval.between('C', 'D');

			expect(dist).toBe('2M');
		});

		it('should return the interval between: Db, Gb', () => {
			const dist = interval.between('Db', 'Gb');

			expect(dist).toBe('4P');
		});

		it('should return the interval between: F#, A#', () => {
			const dist = interval.between('F#', 'A#');

			expect(dist).toBe('3M');
		});

		it('should return the interval between: Gb, Db', () => {
			const dist = interval.between('Gb', 'Db');

			expect(dist).toBe('5P');
		});

		it('should return the interval between: B, C', () => {
			const dist = interval.between('B', 'C');

			expect(dist).toBe('2m');
		});

		it('should return the interval between: Gb, E', () => {
			const dist = interval.between('Gb', 'E');

			expect(dist).toBe('7m');
		});

		it('should return the interval between: F#, D', () => {
			const dist = interval.between('F#', 'D');

			expect(dist).toBe('6m');
		});

		it('should return the interval between: G, Eb', () => {
			const dist = interval.between('G', 'Eb');

			expect(dist).toBe('6m');
		});

		it('should return the interval between: D, Bb', () => {
			const dist = interval.between('D', 'Bb');

			expect(dist).toBe('6m');
		});
	});

	describe('#detect', () => {
		it('should detect CM', () => {
			const result = interval.detect('C E G');

			expect(result).toEqual(['1P', '3M', '5P']);
		});

		it('should detect Fm6', () => {
			const result = interval.detect('F Ab C D');

			expect(result).toEqual(['1P', '3m', '5P', '6M']);
		});

		it('should detect more', () => {
			const result = interval.detect('Bb E A');

			expect(result).toEqual(['1P', '4A', '7M']);
		});

		it('should detect pitches', () => {
			const result = interval.detect('A3 E4 Bb4');

			expect(result).toEqual(['1P', '5P', '9m']);
		});

		it('should detect pitches complex', () => {
			const result = interval.detect('C3 Gb3 Ab3 D4');

			expect(result).toEqual(['1P', '5d', '6m', '9M']);
		});
	});
});
