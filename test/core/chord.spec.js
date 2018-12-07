import { Chord, Scale } from '../../lib/core';

const TEST = { noteType: 'str' };

describe('Chord Test Suite', () => {
	describe('create with chord name', () => {
		it('should return MIDI by default', () => {
			const chord = new Chord('Am7');

			expect(chord.root).to.eql('A');
			expect(chord.type).to.eql('m7');
			expect(chord.notes).to.eql([ 69, 72, 76, 79 ]);
		});

		it('should set natural', () => {
			const chord = new Chord('Am7', TEST);

			expect(chord.root).to.eql('A');
			expect(chord.type).to.eql('m7');
			expect(chord.notes).to.eql([ 'A', 'C', 'E', 'G' ]);
		});

		it('should set sharp', () => {
			const chord = new Chord('D#m6', TEST);

			expect(chord.root).to.eql('D#');
			expect(chord.type).to.eql('m6');
			expect(chord.notes).to.eql([ 'D#', 'F#', 'A#', 'C' ]);
		});

		it('should set flat', () => {
			const chord = new Chord('Bbm9', TEST);

			expect(chord.root).to.eql('Bb');
			expect(chord.type).to.eql('m9');
			expect(chord.notes).to.eql([ 'Bb', 'Db', 'F', 'Ab', 'C' ]);
		});

		it('should set 13 chord', () => {
			const chord = new Chord('E13', TEST);

			expect(chord.root).to.eql('E');
			expect(chord.type).to.eql('13');
			expect(chord.notes).to.eql([ 'E', 'G#', 'B', 'D', 'F#', 'C#' ]);
		});

		it('should set M11 chord', () => {
			const chord = new Chord('GbM11', TEST);

			expect(chord.root).to.eql('Gb');
			expect(chord.type).to.eql('M11');
			expect(chord.notes).to.eql([ 'Gb', 'Bb', 'Db', 'F', 'Ab', 'B' ]);
		});
	});

	describe('create with scale', () => {
		it('should set natural without structure', () => {
			const chord = new Chord({ root: 'A', type: Scale.MINOR }, TEST);

			expect(chord.root).to.eql('A');
			expect(chord.type).to.eql('m');
			expect(chord.notes).to.eql([ 'A', 'C', 'E' ]);
		});

		it('should set natural with structure', () => {
			const chord = new Chord({ root: 'A', type: Scale.EGYPTIAN, structure: Chord.TRIAD }, TEST);

			expect(chord.root).to.eql('A');
			expect(chord.type).to.eql('sus2');
			expect(chord.notes).to.eql([ 'A', 'B', 'E' ]);
		});

		it('should set 13 chord', () => {
			const chord = new Chord({ root: 'A', type: Scale.MINOR, structure: Chord.THIRTEENTH }, TEST);

			expect(chord.root).to.eql('A');
			expect(chord.type).to.eql('m9add13');
			expect(chord.notes).to.eql([ 'A', 'C', 'E', 'G', 'B', 'F' ]);
		});
	});

	describe('find chord name', () => {
		it('should find existing chords', () => {
			expect(Chord.findChordName('1P 3M 5P')).to.eql('maj');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordName('1P 3m 5P 7m 9M 13m')).to.eql('m9add13');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordName('1P 3M 5P 7m 9M 11m')).to.eql('9add11');
		});

		it('should not create for inexisting', () => {
			expect(Chord.findChordName('1P 2m 5P 7m 8M 11m')).to.eql('');
		});
	});
});
