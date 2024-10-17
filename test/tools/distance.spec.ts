import { describe, it, expect } from 'vitest';
import { distance } from '../../lib/tools';

const { semitones, naturalPosition } = distance;

describe('A Distance test suite', () => {
	describe('#semitones', () => {
		it('should return the distance between: C, D', () => {
			const dist = semitones('C', 'D');

			expect(dist).toBe(2);
		});

		it('should return the distance between: C, G', () => {
			const dist = semitones('C', 'G');

			expect(dist).toBe(7);
		});

		it('should return the distance between: Db, Gb', () => {
			const dist = semitones('Db', 'Gb');

			expect(dist).toBe(5);
		});

		it('should return the distance between: F#, A#', () => {
			const dist = semitones('F#', 'A#');
			expect(dist).toBe(4);
		});

		it('should return the distance between: Gb, Db', () => {
			const dist = semitones('Gb', 'Db');

			expect(dist).toBe(7);
		});

		it('should return the distance between: Bb, F', () => {
			const dist = semitones('Bb', 'F');

			expect(dist).toBe(7);
		});

		it('should return the distance between: B, C', () => {
			const dist = semitones('B', 'C');

			expect(dist).toBe(1);
		});

		it('should return the distance between: Gb, E', () => {
			const dist = semitones('Gb', 'E');

			expect(dist).toBe(10);
		});

		it('should return the distance between: E, E', () => {
			const dist = semitones('E', 'E');

			expect(dist).toBe(12);
		});

		it('should return the distance between: A3, E4', () => {
			const dist = semitones('A3', 'E4');

			expect(dist).toBe(7);
		});

		it('should return the distance between: A3, Bb4', () => {
			const dist = semitones('A3', 'Bb4');

			expect(dist).toBe(13);
		});

		it('should return the distance between: A3, Bb7', () => {
			const dist = semitones('A3', 'Bb7');

			expect(dist).toBe(13);
		});

		it('should fail', () => {
			expect(() => semitones('E', 'Z')).toThrowError("[Note]: <Z> isn't a recognized musical note");
		});
	});

	describe('#naturalPosition', () => {
		it('should return natural position C - G', () => {
			const dist = naturalPosition('C', 'G');

			expect(dist).toBe(5);
		});

		it('should return natural position D - B', () => {
			const dist = naturalPosition('D', 'B');

			expect(dist).toBe(6);
		});

		it('should return natural position B - C', () => {
			const dist = naturalPosition('B', 'C');

			expect(dist).toBe(2);
		});

		it('should return natural position F - A', () => {
			const dist = naturalPosition('F', 'A');

			expect(dist).toBe(3);
		});

		it('should return natural position C - B', () => {
			const dist = naturalPosition('C', 'B');

			expect(dist).toBe(7);
		});

		it('should return natural position E - C', () => {
			const dist = naturalPosition('E', 'C');

			expect(dist).toBe(6);
		});
	});
});
