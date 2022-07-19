import { ScaleIntervals } from '../../lib/constants';
import { Chord, Note } from '../../lib/core';
import random from '../../lib/tools/random';
import '../matchers';

describe('Chord Test Suite', () => {
	describe('create from symbol', () => {
		it('should create Am7', () => {
			const chord = Chord.fromName('Am7');

			expect(chord.root.note).toBe('A');
			expect(chord.symbol).toBe('m7');
			expect(chord.toString()).toBe('[object Chord: A3,C4,E4,G4]');
			expect(chord.intervals).toBe('1P 3m 5P 7m');
			expect(chord.structure).toBe(Chord.Structures.Seventh);
			expect(chord.name).toBe('Am7');
			expect(chord).toHaveMidiNotes([ 69, 72, 76, 79 ]);
		});

		// TODO: v2.0
		it.skip('should create Fm9add13', () => {
			const chord = Chord.fromName('Fm9add13');

			expect(chord.root.note).toBe('F');
			expect(chord.symbol).toBe('m7');
			expect(chord.intervals).toBe('1P 3m 5P 7m');
			expect(chord.structure).toBe(Chord.Structures.Seventh);
			expect(chord.name).toBe('Fm7');
			expect(chord).toHaveMidiNotes([ 69, 72, 76, 79 ]);
		});
	});

	describe('create from chord name', () => {
		it('should return MIDI by default', () => {
			const chord = new Chord('A', Chord.Symbols.MinorSeventh);

			expect(chord.root.note).toBe('A');
			expect(chord.symbol).toBe('m7');
			expect(chord.intervals).toBe('1P 3m 5P 7m');
			expect(chord.structure).toBe(Chord.Structures.Seventh);
			expect(chord.name).toBe('Am7');
			expect(chord).toHaveMidiNotes([ 69, 72, 76, 79 ]);
			expect(chord).toHaveStringNotes([ 'A3', 'C4', 'E4', 'G4' ]);
		});

		it('should create Am7 via note octave', () => {
			const chord = new Chord('A4', Chord.Symbols.MinorSeventh);

			expect(chord.root.note).toBe('A');
			expect(chord.symbol).toBe('m7');
			expect(chord.intervals).toBe('1P 3m 5P 7m');
			expect(chord.structure).toBe(Chord.Structures.Seventh);
			expect(chord.name).toBe('Am7');
			expect(chord).toHaveStringNotes([ 'A4', 'C5', 'E5', 'G5' ]);
			expect(chord).toHaveMidiNotes([ 81, 84, 88, 91 ]);
		});

		it('should set sharp', () => {
			const chord = new Chord('D#', Chord.Symbols.MinorMajorSixth);

			expect(chord.root.note).toBe('D#');
			expect(chord.symbol).toBe('m6');
			expect(chord.intervals).toBe('1P 3m 5P 6M');
			expect(chord.structure).toBe(Chord.Structures.Sixth);
			expect(chord.name).toBe('D#m6');
			expect(chord.hasFlats).toBeFalsy();
			expect(chord.hasSharps).toBeTruthy();
			expect(chord).toHaveStringNotes([ 'D#3', 'F#3', 'A#3', 'C4' ]);
		});

		it('should set flat', () => {
			const chord = new Chord('Bb', Chord.Symbols.MinorNinth);

			expect(chord.root.note).toBe('Bb');
			expect(chord.symbol).toBe('m9');
			expect(chord.intervals).toBe('1P 3m 5P 7m 9M');
			expect(chord.structure).toBe(Chord.Structures.Ninth);
			expect(chord.name).toBe('Bbm9');
			expect(chord.hasFlats).toBeTruthy();
			expect(chord.hasSharps).toBeFalsy();
			expect(chord).toHaveStringNotes([ 'Bb3', 'Db4', 'F4', 'Ab4', 'C5' ]);
		});

		it('should have Cm6', () => {
			const chord = new Chord('C', '1P 3m 5P 6M');

			expect(chord.root.note).toBe('C');
			expect(chord.symbol).toBe('m6');
			expect(chord.intervals).toBe('1P 3m 5P 6M');
			expect(chord.structure).toBe(Chord.Structures.Sixth);
			expect(chord.name).toBe('Cm6');
			expect(chord.hasFlats).toBeTruthy();
			expect(chord.hasSharps).toBeFalsy();
			expect(chord).toHaveStringNotes([ 'C3', 'Eb3', 'G3', 'A3' ]);
		});

		it('should have Gm', () => {
			const chord = new Chord('G', Chord.Symbols.Minor);

			expect(chord.root.note).toBe('G');
			expect(chord.symbol).toBe('m');
			expect(chord.intervals).toBe('1P 3m 5P');
			expect(chord.structure).toBe(Chord.Structures.Triad);
			expect(chord.name).toBe('Gm');
			expect(chord.hasFlats).toBeTruthy();
			expect(chord.hasSharps).toBeFalsy();
			expect(chord).toHaveStringNotes([ 'G3', 'Bb3', 'D4' ]);
		});

		it('should have Fdim', () => {
			const chord = new Chord('F', Chord.Symbols.Dim, [ 4, 1 ]);

			expect(chord.root.note).toBe('F');
			expect(chord.symbol).toBe('dim');
			expect(chord.intervals).toBe('1P 3m 5d');
			expect(chord.structure).toBe(Chord.Structures.Triad);
			expect(chord.name).toBe('Fdim');
			expect(chord.hasFlats).toBeTruthy();
			expect(chord.hasSharps).toBeFalsy();
			expect(chord).toHaveStringNotes([ 'F4', 'Ab4', 'B4' ]);
		});

		it('should set 13 chord', () => {
			const chord = new Chord('E', Chord.Symbols.Thirteenth);

			expect(chord.root.note).toBe('E');
			expect(chord.symbol).toBe('13');
			expect(chord.intervals).toBe('1P 3M 5P 7m 9M 13M');
			expect(chord.structure).toBe(Chord.Structures.Thirteenth);
			expect(chord.name).toBe('E13');
			expect(chord.hasFlats).toBeFalsy();
			expect(chord.hasSharps).toBeTruthy();
			expect(chord).toHaveStringNotes([ 'E3', 'G#3', 'B3', 'D4', 'F#4', 'C#5' ]);
		});

		it('should set M11 chord', () => {
			const chord = new Chord('Gb', Chord.Symbols.MajorEleventh);

			expect(chord.root.note).toBe('Gb');
			expect(chord.symbol).toBe('M11');
			expect(chord.intervals).toBe('1P 3M 5P 7M 9M 11P');
			expect(chord.structure).toBe(Chord.Structures.Eleventh);
			expect(chord.name).toBe('GbM11');
			expect(chord.hasFlats).toBeTruthy();
			expect(chord.hasSharps).toBeFalsy();
			expect(chord).toHaveStringNotes([ 'Gb3', 'Bb3', 'Db4', 'F4', 'Ab4', 'B4' ]);
		});

		// it('should throw', () => {
		// 	const toThrow = () => {
		// 		new Chord('foo bar', 'foo');
		// 	};

		// 	expect(toThrow).toThrowErrorMatchingInlineSnapshot(
		// 		`"[foo bar] isn't a recognizable chord"`,
		// 	);
		// });
	});

	describe('create from intervals', () => {
		describe('with Structure', () => {
			it('should set natural', () => {
				random.setSeed('test');

				const chord = Chord.fromIntervals('A', ScaleIntervals.Egyptian, Chord.Structures.Triad);

				expect(chord.root.note).toBe('A');
				expect(chord.symbol).toBe('5');
				expect(chord.intervals).toBe('1P 5P 8P');
				expect(chord.structure).toBe(Chord.Structures.Triad);
				expect(chord.name).toBe('A5');
				expect(chord.hasFlats).toBeFalsy();
				expect(chord.hasSharps).toBeFalsy();
				expect(chord).toHaveStringNotes([ 'A3', 'E4', 'A4' ]);
			});

			it('should set sixth', () => {
				random.setSeed('test');

				const chord = Chord.fromIntervals('G', ScaleIntervals.Dorian, Chord.Structures.Sixth);

				expect(chord.root.note).toBe('G');
				expect(chord.symbol).toBe('m6');
				expect(chord.intervals).toBe('1P 3m 5P 6M');
				expect(chord.structure).toBe(Chord.Structures.Sixth);
				expect(chord.name).toBe('Gm6');
				expect(chord.hasFlats).toBeTruthy();
				expect(chord.hasSharps).toBeFalsy();
				expect(chord).toHaveMidiNotes([ 67, 70, 74, 76 ]);
			});

			it('should set 13 chord', () => {
				random.setSeed('test');

				const chord = Chord.fromIntervals('A', ScaleIntervals.Minor, Chord.Structures.Thirteenth);

				expect(chord.root.note).toBe('A');
				expect(chord.symbol).toBe('m9add13');
				expect(chord.intervals).toBe('1P 3m 5P 7m 9M 13m');
				expect(chord.structure).toBe(Chord.Structures.Thirteenth);
				expect(chord.name).toBe('Am9add13');
				expect(chord.hasFlats).toBeFalsy();
				expect(chord.hasSharps).toBeFalsy();
				expect(chord).toHaveStringNotes([ 'A3', 'C4', 'E4', 'G4', 'B4', 'F5' ]);
			});

			it('should create custom', () => {
				random.setSeed('test');

				const chord = Chord.fromIntervals('C', '1P 2M 3M 4A 5P 6m 7m', [ '1 3 5 6 7' ]);

				expect(chord.root.note).toBe('C');
				expect(chord.symbol).toBe('majadd7');
				expect(chord.intervals).toBe('1P 3M 5P 6m 7m');
				expect(chord.structure).toEqual([ '1 3 5 6 7' ]);
				expect(chord.name).toBe('Cmajadd7');
				expect(chord.hasFlats).toBeTruthy();
				expect(chord.hasSharps).toBeFalsy();
				expect(chord).toHaveStringNotes([ 'C3', 'E3', 'G3', 'Ab3', 'Bb3' ]);
			});

			it('should create custom - D', () => {
				random.setSeed('test');

				const chord = Chord.fromIntervals('D', '1P 2m 3M 4A 5P 6m 7m', [ '1 2 6 7' ]);

				expect(chord.root.note).toBe('D');
				expect(chord.symbol).toBeUndefined();
				expect(chord.intervals).toBe('1P 2m 6m 7m');
				expect(chord.structure).toEqual([ '1 2 6 7' ]);
				expect(chord.name).toBeUndefined();
				expect(chord.hasFlats).toBeTruthy();
				expect(chord.hasSharps).toBeFalsy();
				expect(chord).toHaveStringNotes([ 'D3', 'Eb3', 'Bb3', 'C4' ]);
			});

			it('should throw with unrecognized intervals', () => {
				random.setSeed('test');

				const toThrow = () => {
					Chord.fromIntervals('A', '1P 100P', Chord.Structures.Ninth);
				};

				expect(toThrow).toThrowErrorMatchingInlineSnapshot(`"[1P 100P] has unrecognized intervals."`);
			});
		});

		describe('withOUT Structure', () => {
			it('should set natural', () => {
				random.setSeed('test');

				const chord = Chord.fromIntervals('A', ScaleIntervals.Minor);

				expect(chord.root.note).toBe('A');
				expect(chord.symbol).toBe('m');
				expect(chord.name).toBe('Am');
				expect(chord.intervals).toBe('1P 3m 5P');
				expect(chord.structure).toBe(Chord.Structures.Triad);
				expect(chord).toHaveStringNotes([ 'A3', 'C4', 'E4' ]);
			});

			it('should set flat', () => {
				random.setSeed('test');

				const chord = Chord.fromIntervals('F', ScaleIntervals.Major);

				expect(chord.root.note).toBe('F');
				expect(chord.symbol).toBe('maj');
				expect(chord.name).toBe('Fmaj');
				expect(chord.intervals).toBe('1P 3M 5P');
				expect(chord.structure).toBe(Chord.Structures.Triad);
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

	describe('create from notes', () => {
		it('should create Am7', () => {
			const chord = Chord.fromNotes([ 'A', 'C', 'E', 'G' ]);

			expect(chord.root.note).toBe('A');
			expect(chord.symbol).toBe('m7');
			expect(chord.toString()).toBe('[object Chord: A3,C4,E4,G4]');
			expect(chord.intervals).toBe('1P 3m 5P 7m');
			expect(chord.structure).toBe(Chord.Structures.Seventh);
			expect(chord.name).toBe('Am7');
			expect(chord).toHaveMidiNotes([ 69, 72, 76, 79 ]);
		});

		it('should create unknown chord', () => {
			const chord = Chord.fromNotes([ 'A', 'C', 'F#', 'G' ]);

			expect(chord.root.note).toBe('A');
			expect(chord.symbol).toBeUndefined();
			expect(chord.toString()).toBe('[object Chord: A3,C4,F#4,G4]');
			expect(chord.intervals).toBe('1P 3m 6M 7m');
			expect(chord.structure).toBeUndefined();
			expect(chord.name).toBeUndefined();
			expect(chord).toHaveMidiNotes([ 69, 72, 78, 79 ]);
		});
	});

	describe('inversions', () => {
		it('should invert', () => {
			const invertedChord = Chord.fromName('Am7').invert();

			expect(invertedChord).toHaveStringNotes([ 'C3', 'E3', 'G3', 'A3' ]);
		});

		it('should create 1st inversion', () => {
			random.setSeed('test');

			const chord = Chord.fromIntervals('A', ScaleIntervals.Minor, Chord.Structures.Triad);

			chord.invert();

			expect(chord).toHaveStringNotes([ 'C3', 'E3', 'A3' ]);

			chord.assignOctaves([ 4, 1 ]);

			expect(chord).toHaveStringNotes([ 'C4', 'E4', 'A4' ]);
		});

		it('should create 2nd inversion', () => {
			random.setSeed('test');

			const chord = Chord.fromIntervals('A', ScaleIntervals.Minor, Chord.Structures.Triad);

			chord.invert(2);

			expect(chord).toHaveStringNotes([ 'E3', 'A3', 'C4' ]);
		});

		it('should create 3rd inversion', () => {
			random.setSeed('test');

			const chord = Chord.fromIntervals('A', ScaleIntervals.Minor, Chord.Structures.Seventh);

			chord.invert(3);

			expect(chord).toHaveStringNotes([ 'G3', 'A3', 'C4', 'E4' ]);
		});
	});

	describe('#noteAt', () => {
		it('should get root', () => {
			const chord = new Chord('A', 'm7');
			const root = chord.noteAt(1);

			expect(root).toBeInstanceOf(Note);
			expect(root.pitch).toEqual('A3');
		});

		it('should get structure notes', () => {
			const chord = new Chord('A', 'm7');
			const third = chord.noteAt(3);
			const fifth = chord.noteAt(5);
			const seventh = chord.noteAt(7);

			expect(third.pitch).toEqual('C4');
			expect(fifth.pitch).toEqual('E4');
			expect(seventh.pitch).toEqual('G4');
		});

		it("should throw when it doesn't have interval", () => {
			const toThrow = () => {
				const chord = new Chord('A', 'm7');
				chord.noteAt(2);
			};

			expect(toThrow).toThrowErrorMatchingInlineSnapshot(`"[1,3,5,7] structure doesn't contain position: 2"`);
		});
	});

	describe('find chord symbols', () => {
		it('should find existing chords', () => {
			expect(Chord.findChordSymbol('1P 3M 5P')).toBe('maj');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordSymbol('1P 3m 5P 7m 9M 13m')).toBe('m9add13');
		});

		it('should create for inexisting chords', () => {
			expect(Chord.findChordSymbol('1P 3M 5P 7m 9M 11m')).toBe('9add11');
		});

		it('should not create for inexisting', () => {
			expect(Chord.findChordSymbol('1P 2m 5P 7m 8M 11m')).toBeUndefined();
		});
	});
});
