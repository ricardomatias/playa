import { distance } from '../../lib/tools';
import Note from '../../lib/core/Note';

const { semitones, interval, transpose } = distance;


describe('A Distance test suite', () => {
	describe('#semitones', () => {
		it('should return the distance between: C, D', () => {
			const dist = semitones(new Note('C'), new Note('D'));

			expect(dist).to.equal(2);
		});

		it('should return the distance between: Db, Gb', () => {
			const dist = semitones(new Note('Db'), new Note('Gb'));

			expect(dist).to.equal(5);
		});

		it('should return the distance between: F#, A#', () => {
			const dist = semitones(new Note('F#'), new Note('A#'));

			expect(dist).to.equal(4);
		});

		it('should return the distance between: Gb, Db', () => {
			const dist = semitones(new Note('Gb'), new Note('Db'));

			expect(dist).to.equal(7);
		});

		it('should return the distance between: Bb, F', () => {
			const dist = semitones(new Note('Bb'), new Note('F'));

			expect(dist).to.equal(7);
		});

		it('should return the distance between: B, C', () => {
			const dist = semitones(new Note('B'), new Note('C'));

			expect(dist).to.equal(1);
		});

		it('should return the distance between: Gb, E', () => {
			const dist = semitones(new Note('Gb'), new Note('E'));

			expect(dist).to.equal(10);
		});

		it('should return the distance between: E, E', () => {
			const dist = semitones(new Note('E'), new Note('E'));

			expect(dist).to.equal(12);
		});
	});

	describe('#interval', () => {
		it('should return the interval between: C, D', () => {
			const dist = interval(new Note('C'), new Note('D'));

			expect(dist).to.equal('2M');
		});

		it('should return the interval between: Db, Gb', () => {
			const dist = interval(new Note('Db'), new Note('Gb'));

			expect(dist).to.equal('4P');
		});

		it('should return the interval between: F#, A#', () => {
			const dist = interval(new Note('F#'), new Note('A#'));

			expect(dist).to.equal('3M');
		});

		it('should return the interval between: Gb, Db', () => {
			const dist = interval(new Note('Gb'), new Note('Db'));

			expect(dist).to.equal('5P');
		});

		it('should return the interval between: B, C', () => {
			const dist = interval(new Note('B'), new Note('C'));

			expect(dist).to.equal('2m');
		});

		it('should return the interval between: Gb, E', () => {
			const dist = interval(new Note('Gb'), new Note('E'));

			expect(dist).to.equal('7m');
		});
	});

	describe('#transpose', () => {
		it('should return the transposed of: C, 2M', () => {
			const dist = transpose(new Note('C'), '2M');

			expect(dist).to.equal('D');
		});

		it('should return the transposed of: Db, 4P', () => {
			const dist = transpose(new Note('Db'), '4P');

			expect(dist).to.equal('Gb');
		});

		it('should return the transposed of: F#, A#', () => {
			const dist = transpose(new Note('F#'), '3M');

			expect(dist).to.equal('A#');
		});

		it('should return the transposed of: Gb, Db', () => {
			const dist = transpose(new Note('Gb'), '5P');

			expect(dist).to.equal('Db');
		});

		it('should return the transposed of: B, C', () => {
			const dist = transpose(new Note('B'), '2m');

			expect(dist).to.equal('C');
		});

		it('should return the transposed of: Gb, E', () => {
			const dist = transpose(new Note('Gb'), '7m');

			expect(dist).to.equal('E');
		});
	});
});
