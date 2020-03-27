import { Chord, Scale, Note } from '../../lib/core';
import Random from '../../lib/tools/random';

describe('Chord Test Suite', () => {
	describe('create with chord name', () => {
		it('should return MIDI by default', () => {
			const chord = new Chord('Am7');

			expect(chord.root).toBe('A');
			expect(chord.type).toBe('m7');
			expect(chord).toHaveMidiNotes([ 69, 72, 76, 79 ]);
		});

		it('should set natural', () => {
			const chord = new Chord('Am7');

			expect(chord.root).toBe('A');
			expect(chord.type).toBe('m7');
			expect(chord).toHaveStringNotes([ 'A3', 'C4', 'E4', 'G4' ]);
		});

		it('should set sharp', () => {
			const chord = new Chord('D#m6');

			expect(chord.root).toBe('D#');
			expect(chord.type).toBe('m6');
			expect(chord).toHaveStringNotes([ 'D#3', 'F#3', 'A#3', 'C4' ]);
		});

		it('should set flat', () => {
			const chord = new Chord('Bbm9');

			expect(chord.root).toBe('Bb');
			expect(chord.type).toBe('m9');
			expect(chord).toHaveStringNotes([ 'Bb3', 'Db4', 'F4', 'Ab4', 'C5' ]);
		});

		it('should set 13 chord', () => {
			const chord = new Chord('E13');

			expect(chord.root).toBe('E');
			expect(chord.type).toBe('13');
			expect(chord).toHaveStringNotes([
				'E3',
				'G#3',
				'B3',
				'D4',
				'F#4',
				'C#5',
			]);
		});

		it('should set M11 chord', () => {
			const chord = new Chord('GbM11');

			expect(chord.root).toBe('Gb');
			expect(chord.type).toBe('M11');
			expect(chord).toHaveStringNotes([
				'Gb3',
				'Bb3',
				'Db4',
				'F4',
				'Ab4',
				'B4',
			]);
		});

		it('should have chord structure', () => {
			const chord = new Chord('GbM11');

			expect(chord.root).toBe('Gb');
			expect(chord.type).toBe('M11');
			expect(chord.structure).toEqual([ 6, '1 3 5 7 9 11' ]);
		});
	});

	describe('create with scale', () => {
		describe('with Structure', () => {
			it('should set natural', () => {
				Random.setSeed('test');

				const chord = new Chord({
					root: 'A',
					type: Scale.EGYPTIAN,
					structure: Chord.TRIAD,
				});

				expect(chord.root).toBe('A');
				expect(chord.type).toBe('sus2');
				expect(chord).toHaveStringNotes([ 'A3', 'B3', 'E4' ]);
			});

			it('should set sixth & midi note type', () => {
				const chord = new Chord({
					root: 'G',
					type: Scale.DORIAN,
					structure: Chord.SIXTH,
				});

				expect(chord.root).toBe('G');
				expect(chord.type).toBe('m6');
				expect(chord).toHaveMidiNotes([ 67, 70, 74, 76 ]);
			});

			it('should set 13 chord', () => {
				const chord = new Chord({
					root: 'A',
					type: Scale.MINOR,
					structure: Chord.THIRTEENTH,
				});

				expect(chord.root).toBe('A');
				expect(chord.type).toBe('m9add13');
				expect(chord).toHaveStringNotes([
					'A3',
					'C4',
					'E4',
					'G4',
					'B4',
					'F5',
				]);
			});
		});

		describe('withOUT Structure', () => {
			it('should set natural', () => {
				Random.setSeed('test');

				const chord = new Chord({ root: 'A', type: Scale.MINOR });

				expect(chord.root).toBe('A');
				expect(chord.type).toBe('m');
				expect(chord).toHaveStringNotes([ 'A3', 'C4', 'E4' ]);
			});

			it('should set flat', () => {
				Random.setSeed('test-2');

				const chord = new Chord({ root: 'F', type: Scale.MAJOR });

				expect(chord.root).toBe('F');
				expect(chord.type).toBe('maj');
				expect(chord).toHaveStringNotes([ 'F3', 'A3', 'C4' ]);
			});
		});
	});

	describe('inversions', () => {
		it('should create 1st inversion', () => {
			const chord = new Chord({
				root: 'A',
				type: Scale.MINOR,
				structure: Chord.TRIAD,
			});

			chord.invert(1);

			expect(chord).toHaveStringNotes([ 'C3', 'E3', 'A3' ]);

			chord.assignOctaves([ 4, 1 ]);

			expect(chord).toHaveStringNotes([ 'C4', 'E4', 'A4' ]);
		});

		it('should create 2nd inversion', () => {
			const chord = new Chord({
				root: 'A',
				type: Scale.MINOR,
				structure: Chord.TRIAD,
			});

			chord.invert(2);

			expect(chord).toHaveStringNotes([ 'E3', 'A3', 'C4' ]);
		});

		it('should create 3rd inversion', () => {
			const chord = new Chord({
				root: 'A',
				type: Scale.MINOR,
				structure: Chord.SEVENTH,
			});

			chord.invert(3);

			expect(chord).toHaveStringNotes([ 'G3', 'A3', 'C4', 'E4' ]);
		});

		it('should invert randomly', () => {
			Random.setSeed('test-foddds');

			const chord = new Chord({
				root: 'A',
				type: Scale.MINOR,
				structure: Chord.THIRTEENTH,
			});

			chord.invert();

			expect(chord).toHaveStringNotes([
				'C3',
				'E3',
				'G3',
				'B3',
				'F4',
				'A4',
			]);

			chord.assignOctaves([ 4, 1 ]);

			expect(chord).toHaveStringNotes([
				'C4', 'E4', 'G4', 'B4', 'F5', 'A5',
			]);
		});
	});

	describe('#noteAt', () => {
		it('should get root', () => {
			const chord = new Chord('Am7');
			const root = chord.noteAt(1);

			expect(root).toBeInstanceOf(Note);
			expect(root.n).toEqual('A3');
		});

		it('should get structure notes', () => {
			const chord = new Chord('Am7');
			const third = chord.noteAt(3);
			const fifth = chord.noteAt(5);
			const seventh = chord.noteAt(7);

			expect(third.n).toEqual('C4');
			expect(fifth.n).toEqual('E4');
			expect(seventh.n).toEqual('G4');
		});

		it('should throw when it doesn\'t have interval', () => {
			const toThrow = () => {
				const chord = new Chord('Am7');
				chord.noteAt(2);
			};

			expect(toThrow).toThrowErrorMatchingInlineSnapshot(
				`"[1,3,5,7] structure doesn't contain interval: 2"`,
			);
		});
	});

	describe('find chord name', () => {
		it('should find existing chords', () => {
			expect(Chord.findChordName('1P 3M 5P')).toBe('maj');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordName('1P 3m 5P 7m 9M 13m')).toBe('m9add13');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordName('1P 3M 5P 7m 9M 11m')).toBe('9add11');
		});

		it('should not create for inexisting', () => {
			expect(Chord.findChordName('1P 2m 5P 7m 8M 11m')).toBe('');
		});
	});
});
