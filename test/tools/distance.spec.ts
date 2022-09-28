import { distance } from '../../lib/tools';

const { semitones, interval, transposeUp, transposeDown, position, naturalPosition } = distance;

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

		it('should fail', () => {
			expect(() => semitones('E', 'Z')).toThrowError("[Note]: <Z> isn't a recognized musical note");
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

		it('should return the interval between: F#, D', () => {
			const dist = interval('F#', 'D');

			expect(dist).toBe('6m');
		});

		it('should return the interval between: G, Eb', () => {
			const dist = interval('G', 'Eb');

			expect(dist).toBe('6m');
		});

		it('should return the interval between: D, Bb', () => {
			const dist = interval('D', 'Bb');

			expect(dist).toBe('6m');
		});
	});

	describe('#position', () => {
		it('should return C position', () => {
			const dist = position('C');

			expect(dist).toBe(0);
		});

		it('should return Eb position', () => {
			const dist = position('Eb');

			expect(dist).toBe(3);
		});

		it('should return A# position', () => {
			const dist = position('A#');

			expect(dist).toBe(10);
		});
	});

	describe('#transposeUp', () => {
		it('should return the transposed of: C, 2M', () => {
			const newNote = transposeUp('C', '2M');

			expect(newNote).toBe('D');
		});

		it('should return the transposed of: A, 3m', () => {
			const newNote = transposeUp('A4', '3m');

			expect(newNote).toBe('C');
		});

		it('should return the transposed of: Db, 4P', () => {
			const newNote = transposeUp('Db', '4P');

			expect(newNote).toBe('Gb');
		});

		it('should return the transposed of: F#, A#', () => {
			const newNote = transposeUp('F#', '3M');

			expect(newNote).toBe('A#');
		});

		it('should return the transposed of: Gb, Db', () => {
			const newNote = transposeUp('Gb', '5P');

			expect(newNote).toBe('Db');
		});

		it('should return the transposed of: B, C', () => {
			const newNote = transposeUp('B', '2m');

			expect(newNote).toBe('C');
		});

		it('should return the transposed of: Gb, E', () => {
			const newNote = transposeUp('Gb', '7m');

			expect(newNote).toBe('E');
		});
	});

	describe('#transposeDown', () => {
		it('should return the transposed of: C, 2M', () => {
			const newNote = transposeDown('C', '2M');

			expect(newNote).toBe('Bb');
		});

		it('should return the transposed of: Db, 4P', () => {
			const newNote = transposeDown('Db', '4P');

			expect(newNote).toBe('Ab');
		});

		it('should return the transposed of: F#, 3M', () => {
			const newNote = transposeDown('F#', '3M');

			expect(newNote).toBe('D');
		});

		it('should return the transposed of: Gb, 5P', () => {
			const newNote = transposeDown('Gb', '5P');

			expect(newNote).toBe('B');
		});

		it('should return the transposed of: B, 2m', () => {
			const newNote = transposeDown('B', '2m');

			expect(newNote).toBe('A#');
		});

		it('should return the transposed of: Gb, 7m', () => {
			const newNote = transposeDown('Gb', '7m');

			expect(newNote).toBe('Ab');
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
