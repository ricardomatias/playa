import { distance } from '../../lib/tools';

const { semitones, interval, transposeUp, transposeDown } = distance;


describe('A Distance test suite', () => {
	describe('#semitones', () => {
		it('should return the distance between: C, D', () => {
			const dist = semitones('C', 'D');

			expect(dist).toBe(2);
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
	});

	describe('#interval', () => {
		it('should return the interval between: C, D', () => {
			const dist = interval('C', 'D');

			expect(dist).toBe('2M');
		});

		it('should return the interval between: Db, Gb', () => {
			const dist = interval('Db', 'Gb');

			expect(dist).toBe('4P');
		});

		it('should return the interval between: F#, A#', () => {
			const dist = interval('F#', 'A#');

			expect(dist).toBe('3M');
		});

		it('should return the interval between: Gb, Db', () => {
			const dist = interval('Gb', 'Db');

			expect(dist).toBe('5P');
		});


		it('should return the interval between: B, C', () => {
			const dist = interval('B', 'C');

			expect(dist).toBe('2m');
		});

		it('should return the interval between: Gb, E', () => {
			const dist = interval('Gb', 'E');
			expect(dist).toBe('7m');
		});
	});

	describe('#transposeUp', () => {
		it('should return the transposed of: C, 2M', () => {
			const dist = transposeUp('C', '2M');

			expect(dist).toBe('D');
		});

		it('should return the transposed of: Db, 4P', () => {
			const dist = transposeUp('Db', '4P');

			expect(dist).toBe('Gb');
		});

		it('should return the transposed of: F#, A#', () => {
			const dist = transposeUp('F#', '3M');

			expect(dist).toBe('A#');
		});

		it('should return the transposed of: Gb, Db', () => {
			const dist = transposeUp('Gb', '5P');

			expect(dist).toBe('Db');
		});

		it('should return the transposed of: B, C', () => {
			const dist = transposeUp('B', '2m');

			expect(dist).toBe('C');
		});

		it('should return the transposed of: Gb, E', () => {
			const dist = transposeUp('Gb', '7m');

			expect(dist).toBe('E');
		});
	});

	describe('#transposeDown', () => {
		it('should return the transposed of: C, 2M', () => {
			const dist = transposeDown('C', '2M');

			expect(dist).toBe('Bb');
		});

		it('should return the transposed of: Db, 4P', () => {
			const dist = transposeDown('Db', '4P');

			expect(dist).toBe('Ab');
		});

		it('should return the transposed of: F#, 3M', () => {
			const dist = transposeDown('F#', '3M');

			expect(dist).toBe('D');
		});

		it('should return the transposed of: Gb, 5P', () => {
			const dist = transposeDown('Gb', '5P');

			expect(dist).toBe('B');
		});

		it('should return the transposed of: B, 2m', () => {
			const dist = transposeDown('B', '2m');

			expect(dist).toBe('A#');
		});

		it('should return the transposed of: Gb, 7m', () => {
			const dist = transposeDown('Gb', '7m');

			expect(dist).toBe('Ab');
		});
	});
});
