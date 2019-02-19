import { Chord, Scale } from '../../lib/core';
import { seedRandom } from '../../lib/tools/random';

const TEST = { noteType: 'str' };

describe('Chord Test Suite', () => {
	describe('create with chord name', () => {
		it('should return MIDI by default', () => {
			const chord = new Chord('Am7');

			expect(chord.root).to.eql('A');
			expect(chord.type).to.eql('m7');
			expect(chord.notes).to.eql([ 57, 60, 64, 67 ]);
		});

		it('should set natural', () => {
			const chord = new Chord('Am7', TEST);

			expect(chord.root).to.eql('A');
			expect(chord.type).to.eql('m7');
			expect(chord.notes).to.eql([ 'A3', 'C4', 'E4', 'G4' ]);
		});

		it('should set sharp', () => {
			const chord = new Chord('D#m6', TEST);

			expect(chord.root).to.eql('D#');
			expect(chord.type).to.eql('m6');
			expect(chord.notes).to.eql([ 'D#3', 'F#3', 'A#3', 'C4' ]);
		});

		it('should set flat', () => {
			const chord = new Chord('Bbm9', TEST);

			expect(chord.root).to.eql('Bb');
			expect(chord.type).to.eql('m9');
			expect(chord.notes).to.eql([ 'Bb3', 'Db4', 'F4', 'Ab4', 'C5' ]);
		});

		it('should set 13 chord', () => {
			const chord = new Chord('E13', TEST);

			expect(chord.root).to.eql('E');
			expect(chord.type).to.eql('13');
			expect(chord.notes).to.eql([ 'E3', 'G#3', 'B3', 'D4', 'F#4', 'C#5' ]);
		});

		it('should set M11 chord', () => {
			const chord = new Chord('GbM11', TEST);

			expect(chord.root).to.eql('Gb');
			expect(chord.type).to.eql('M11');
			expect(chord.notes).to.eql([ 'Gb3', 'Bb3', 'Db4', 'F4', 'Ab4', 'B4' ]);
		});
	});

	describe('create with scale', () => {
		describe('with Structure', () => {
			it('should set natural', () => {
				seedRandom('test');

				const chord = new Chord({ root: 'A', type: Scale.EGYPTIAN, structure: Chord.TRIAD }, TEST);

				expect(chord.root).to.eql('A');
				expect(chord.type).to.eql('sus2');
				expect(chord.notes).to.eql([ 'A3', 'B3', 'E4' ]);
			});

			it('should set sixth & midi note type', () => {
				const chord = new Chord({ root: 'G', type: Scale.DORIAN, structure: Chord.SIXTH });

				expect(chord.root).to.eql('G');
				expect(chord.type).to.eql('m6');
				expect(chord.notes).to.eql([ 55, 58, 62, 64 ]);
			});

			it('should set 13 chord', () => {
				const chord = new Chord({ root: 'A', type: Scale.MINOR, structure: Chord.THIRTEENTH }, TEST);

				expect(chord.root).to.eql('A');
				expect(chord.type).to.eql('m9add13');
				expect(chord.notes).to.eql([ 'A3', 'C4', 'E4', 'G4', 'B4', 'F5' ]);
			});
		});

		describe('withOUT Structure', () => {
			it('should set natural', () => {
				seedRandom('test');

				const chord = new Chord({ root: 'A', type: Scale.MINOR }, TEST);

				expect(chord.root).to.eql('A');
				expect(chord.type).to.eql('m');
				expect(chord.notes).to.eql([ 'A3', 'C4', 'E4' ]);
			});

			it('should set flat', () => {
				seedRandom('test-2');

				const chord = new Chord({ root: 'F', type: Scale.MAJOR }, TEST);

				expect(chord.root).to.eql('F');
				expect(chord.type).to.eql('maj');
				expect(chord.notes).to.eql([ 'F3', 'A3', 'C4' ]);
			});
		});
	});

	describe('inversions', () => {
		it('should create 1st inversion', () => {
			const chord = new Chord({ root: 'A', type: Scale.MINOR, structure: Chord.TRIAD }, TEST);

			chord.invert(1);

			expect(chord.notes).to.eql([ 'C3', 'E3', 'A3' ]);

			chord.assignOctaves([ 4, 1 ]);

			expect(chord.notes).to.eql([ 'C4', 'E4', 'A4' ]);
		});

		it('should create 2nd inversion', () => {
			const chord = new Chord({ root: 'A', type: Scale.MINOR, structure: Chord.TRIAD }, TEST);

			chord.invert(2);

			expect(chord.notes).to.eql([ 'E3', 'A3', 'C4' ]);
		});

		it('should create 3rd inversion', () => {
			const chord = new Chord({ root: 'A', type: Scale.MINOR, structure: Chord.SEVENTH }, TEST);

			chord.invert(3);

			expect(chord.notes).to.eql([ 'G3', 'A3', 'C4', 'E4' ]);
		});

		it('should create random inversion', () => {
			seedRandom('test-foddds');

			const chord = new Chord({ root: 'A', type: Scale.MINOR, structure: Chord.THIRTEENTH }, TEST);

			chord.invert();

			expect(chord.notes).to.eql([ 'B3', 'F4', 'A4', 'C5', 'E5', 'G5' ]);

			chord.assignOctaves([ 4, 1 ]);
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
