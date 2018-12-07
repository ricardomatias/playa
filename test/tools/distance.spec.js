import { distance } from '../../lib/tools';

const { semitones, interval, transposeUp, transposeDown } = distance;


describe('A Distance test suite', () => {
	describe('#semitones', () => {
		it('should return the distance between: C, D', () => {
			const dist = semitones('C', 'D');

			expect(dist).to.equal(2);
		});

		it('should return the distance between: Db, Gb', () => {
			const dist = semitones('Db', 'Gb');

			expect(dist).to.equal(5);
		});

		it('should return the distance between: F#, A#', () => {
			const dist = semitones('F#', 'A#');
			expect(dist).to.equal(4);
		});

		it('should return the distance between: Gb, Db', () => {
			const dist = semitones('Gb', 'Db');

			expect(dist).to.equal(7);
		});

		it('should return the distance between: Bb, F', () => {
			const dist = semitones('Bb', 'F');

			expect(dist).to.equal(7);
		});

		it('should return the distance between: B, C', () => {
			const dist = semitones('B', 'C');

			expect(dist).to.equal(1);
		});

		it('should return the distance between: Gb, E', () => {
			const dist = semitones('Gb', 'E');

			expect(dist).to.equal(10);
		});

		it('should return the distance between: E, E', () => {
			const dist = semitones('E', 'E');

			expect(dist).to.equal(12);
		});
	});

	describe('#interval', () => {
		it('should return the interval between: C, D', () => {
			const dist = interval('C', 'D');

			expect(dist).to.equal('2M');
		});

		it('should return the interval between: Db, Gb', () => {
			const dist = interval('Db', 'Gb');

			expect(dist).to.equal('4P');
		});

		it('should return the interval between: F#, A#', () => {
			const dist = interval('F#', 'A#');

			expect(dist).to.equal('3M');
		});

		it('should return the interval between: Gb, Db', () => {
			const dist = interval('Gb', 'Db');

			expect(dist).to.equal('5P');
		});


		it('should return the interval between: B, C', () => {
			const dist = interval('B', 'C');

			expect(dist).to.equal('2m');
		});

		it('should return the interval between: Gb, E', () => {
			const dist = interval('Gb', 'E');
			expect(dist).to.equal('7m');
		});
	});

	describe('#transposeUp', () => {
		it('should return the transposed of: C, 2M', () => {
			const dist = transposeUp('C', '2M');

			expect(dist).to.equal('D');
		});

		it('should return the transposed of: Db, 4P', () => {
			const dist = transposeUp('Db', '4P');

			expect(dist).to.equal('Gb');
		});

		it('should return the transposed of: F#, A#', () => {
			const dist = transposeUp('F#', '3M');

			expect(dist).to.equal('A#');
		});

		it('should return the transposed of: Gb, Db', () => {
			const dist = transposeUp('Gb', '5P');

			expect(dist).to.equal('Db');
		});

		it('should return the transposed of: B, C', () => {
			const dist = transposeUp('B', '2m');

			expect(dist).to.equal('C');
		});

		it('should return the transposed of: Gb, E', () => {
			const dist = transposeUp('Gb', '7m');

			expect(dist).to.equal('E');
		});
	});

	describe('#transposeDown', () => {
		it('should return the transposed of: C, 2M', () => {
			const dist = transposeDown('C', '2M');

			expect(dist).to.equal('Bb');
		});

		it('should return the transposed of: Db, 4P', () => {
			const dist = transposeDown('Db', '4P');

			expect(dist).to.equal('Ab');
		});

		it('should return the transposed of: F#, 3M', () => {
			const dist = transposeDown('F#', '3M');

			expect(dist).to.equal('D');
		});

		it('should return the transposed of: Gb, 5P', () => {
			const dist = transposeDown('Gb', '5P');

			expect(dist).to.equal('B');
		});

		it('should return the transposed of: B, 2m', () => {
			const dist = transposeDown('B', '2m');

			expect(dist).to.equal('A#');
		});

		it('should return the transposed of: Gb, 7m', () => {
			const dist = transposeDown('Gb', '7m');

			expect(dist).to.equal('Ab');
		});
	});
});
