import { Chord, Scale, Note } from '../../lib/core';
import Random from '../../lib/tools/random';
import '../matchers';

describe('Chord Test Suite', () => {
	describe('create with chord name', () => {
		it('should return MIDI by default', () => {
			const chord = new Chord('Am7');

			expect(chord.root).toBe('A');
			expect(chord.symbol).toBe('m7');
			expect(chord.intervals).toBe('1P 3m 5P 7m');
			expect(chord.structure).toBe(Chord.Structures.Seventh);
			expect(chord.name).toBe('Am7');
			expect(chord).toHaveMidiNotes([ 69, 72, 76, 79 ]);
		});

		it('should set natural', () => {
			const chord = new Chord('Am7');

			expect(chord).toHaveStringNotes([ 'A3', 'C4', 'E4', 'G4' ]);
		});

		it('should set sharp', () => {
			const chord = new Chord('D#m6');

			expect(chord.root).toBe('D#');
			expect(chord.symbol).toBe('m6');
			expect(chord.intervals).toBe('1P 3m 5P 6M');
			expect(chord.structure).toBe(Chord.Structures.Sixth);
			expect(chord.name).toBe('D#m6');
			expect(chord).toHaveStringNotes([ 'D#3', 'F#3', 'A#3', 'C4' ]);
		});

		it('should set flat', () => {
			const chord = new Chord('Bbm9');

			expect(chord.root).toBe('Bb');
			expect(chord.symbol).toBe('m9');
			expect(chord.intervals).toBe('1P 3m 5P 7m 9M');
			expect(chord.structure).toBe(Chord.Structures.Ninth);
			expect(chord.name).toBe('Bbm9');
			expect(chord).toHaveStringNotes([ 'Bb3', 'Db4', 'F4', 'Ab4', 'C5' ]);
		});

		it('should set 13 chord', () => {
			const chord = new Chord('E13');

			expect(chord.root).toBe('E');
			expect(chord.symbol).toBe('13');
			expect(chord.intervals).toBe('1P 3M 5P 7m 9M 13M');
			expect(chord.structure).toBe(Chord.Structures.Thirteenth);
			expect(chord.name).toBe('E13');
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
			expect(chord.symbol).toBe('M11');
			expect(chord.intervals).toBe('1P 3M 5P 7M 9M 11P');
			expect(chord.structure).toBe(Chord.Structures.Eleventh);
			expect(chord.name).toBe('GbM11');
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
			expect(chord.symbol).toBe('M11');
			expect(chord.intervals).toBe('1P 3M 5P 7M 9M 11P');
			expect(chord.name).toBe('GbM11');
			expect(chord.structure).toEqual(Chord.Structures.Eleventh);
		});

		it('should throw', () => {
			const toThrow = () => {
				new Chord('foo bar');
			};

			expect(toThrow).toThrowErrorMatchingInlineSnapshot(
				`"[foo bar] isn't a recognizable chord"`,
			);
		});
	});

	describe('create with scale', () => {
		describe('with Structure', () => {
			it('should set natural', () => {
				Random.setSeed('test');

				const chord = new Chord({
					root: 'A',
					intervals: Scale.Egyptian,
					structure: Chord.Structures.Triad,
				});

				expect(chord.root).toBe('A');
				expect(chord.symbol).toBe('sus2');
				expect(chord.intervals).toBe('1P 2M 5P');
				expect(chord.structure).toBe(Chord.Structures.Triad);
				expect(chord.name).toBe('Asus2');
				expect(chord).toHaveStringNotes([ 'A3', 'B3', 'E4' ]);
			});

			it('should set sixth', () => {
				const chord = new Chord({
					root: 'G',
					intervals: Scale.Dorian,
					structure: Chord.Structures.Sixth,
				});

				expect(chord.root).toBe('G');
				expect(chord.symbol).toBe('m6');
				expect(chord.intervals).toBe('1P 3m 5P 6M');
				expect(chord.structure).toBe(Chord.Structures.Sixth);
				expect(chord.name).toBe('Gm6');
				expect(chord).toHaveMidiNotes([ 67, 70, 74, 76 ]);
			});

			it('should set 13 chord', () => {
				const chord = new Chord({
					root: 'A',
					intervals: Scale.Minor,
					structure: Chord.Structures.Thirteenth,
				});

				expect(chord.root).toBe('A');
				expect(chord.symbol).toBe('m9add13');
				expect(chord.intervals).toBe('1P 3m 5P 7m 9M 13m');
				expect(chord.structure).toBe(Chord.Structures.Thirteenth);
				expect(chord.name).toBe('Am9add13');
				expect(chord).toHaveStringNotes([
					'A3',
					'C4',
					'E4',
					'G4',
					'B4',
					'F5',
				]);
			});

			it('should throw with unrecognized intervals', () => {
				const toThrow = () => {
					new Chord({
						root: 'A',
						intervals: '1P 100P',
						structure: Chord.Structures.Ninth,
					});
				};

				expect(toThrow).toThrowErrorMatchingInlineSnapshot(
					`"[1P 100P] has unrecognized intervals."`,
				);
			});
		});

		describe('withOUT Structure', () => {
			it('should set natural', () => {
				Random.setSeed('test');

				const chord = new Chord({ root: 'A', intervals: Scale.Minor });

				expect(chord.root).toBe('A');
				expect(chord.symbol).toBe('m');
				expect(chord).toHaveStringNotes([ 'A3', 'C4', 'E4' ]);
			});

			it('should set flat', () => {
				Random.setSeed('test-2');

				const chord = new Chord({ root: 'F', intervals: Scale.Major });

				expect(chord.root).toBe('F');
				expect(chord.symbol).toBe('maj');
				expect(chord).toHaveStringNotes([ 'F3', 'A3', 'C4' ]);
			});

			// TODO: verify typescript does something to prevent this
			// it('should throw with undefined intervals', () => {
			// 	const toThrow = () => {
			// 		new Chord({
			// 			root: 'A',
			// 		});
			// 	};

			// 	expect(toThrow).toThrowErrorMatchingInlineSnapshot(
			// 		`"Could not create <{\\"root\\":\\"A\\"}>"`,
			// 	);
			// });
		});
	});

	describe('inversions', () => {
		it('should create 1st inversion', () => {
			const chord = new Chord({
				root: 'A',
				intervals: Scale.Minor,
				structure: Chord.Structures.Triad,
			});

			chord.invert(1);

			expect(chord).toHaveStringNotes([ 'C3', 'E3', 'A3' ]);

			chord.assignOctaves([ 4, 1 ]);

			expect(chord).toHaveStringNotes([ 'C4', 'E4', 'A4' ]);
		});

		it('should create 2nd inversion', () => {
			const chord = new Chord({
				root: 'A',
				intervals: Scale.Minor,
				structure: Chord.Structures.Triad,
			});

			chord.invert(2);

			expect(chord).toHaveStringNotes([ 'E3', 'A3', 'C4' ]);
		});

		it('should create 3rd inversion', () => {
			const chord = new Chord({
				root: 'A',
				intervals: Scale.Minor,
				structure: Chord.Structures.Seventh,
			});

			chord.invert(3);

			expect(chord).toHaveStringNotes([ 'G3', 'A3', 'C4', 'E4' ]);
		});

		it('should invert randomly', () => {
			Random.setSeed('test-foddds');

			const chord = new Chord({
				root: 'A',
				intervals: Scale.Minor,
				structure: Chord.Structures.Thirteenth,
			});

			chord.invert();

			expect(chord).toHaveStringNotes([
				'E3', 'G3', 'B3', 'F4', 'A4', 'C5',
			]);

			chord.assignOctaves([ 4, 1 ]);

			expect(chord).toHaveStringNotes([
				'E4', 'G4', 'B4', 'F5', 'A5', 'C6',
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

	describe('find chord symbols', () => {
		it('should find existing chords', () => {
			expect(Chord.findChordSymbols('1P 3M 5P')).toBe('maj');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordSymbols('1P 3m 5P 7m 9M 13m')).toBe('m9add13');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordSymbols('1P 3M 5P 7m 9M 11m')).toBe('9add11');
		});

		it('should not create for inexisting', () => {
			expect(Chord.findChordSymbols('1P 2m 5P 7m 8M 11m')).toBeUndefined();
		});
	});
});
