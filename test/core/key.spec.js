import { Key, Chord } from '../../lib/core';
import NoteType from '../../lib/core/types';
import { seedRandom } from '../../lib/tools';

const TEST = { noteType: NoteType.STR };


function modesToChords(modes) {
	return modes.map((mode) => {
		const chord = new Chord({
			root: mode.root,
			type: mode.scale,
			structure: Chord.SEVENTH,
		}, TEST);

		return chord.name;
	});
}

function modesToScales(modes) {
	return modes.map((mode) => {
		return Key.NAMES[mode.scale];
	});
}


describe('Key Test Suite', () => {
	describe('memoize', () => {
		it('should be the same scale', () => {
			const key = new Key('C', Key.MAJOR, TEST);

			expect(key.scale).toBe(key.scale);
		});
	});

	describe('Modes', () => {
		it('should have chords for C Major', () => {
			const key = new Key('C', Key.MAJOR, TEST);

			expect(modesToChords(key.modes)).toEqual([
				'CM7',
				'Dm7',
				'Em7',
				'FM7',
				'G7',
				'Am7',
				'Bm7b5',
			]);
		});

		it('should have chords for Ab Minor', () => {
			const key = new Key('Ab', Key.MINOR, TEST);

			expect(modesToChords(key.modes)).toEqual([
				'Abm7',
				'Bbm7b5',
				'BM7',
				'Dbm7',
				'Ebm7',
				'EM7',
				'Gb7',
			]);
		});

		it('should have chords for E Dorian', () => {
			const key = new Key('E', Key.DORIAN, TEST);

			expect(modesToChords(key.modes)).toEqual([
				'Em7',
				'F#m7',
				'GM7',
				'A7',
				'Bm7',
				'C#m7b5',
				'DM7',
			]);
		});

		it('should allow accessing a mode through Proxy - E MIXOLYDIAN', () => {
			const key = new Key('E', Key.MAJOR, TEST);

			const eMyxo = key.MIXOLYDIAN;

			expect(eMyxo.chord.name).toBe('B7');
			expect(eMyxo.notes).toEqual([ 'B', 'C#', 'D#', 'E', 'F#', 'G#', 'A' ]);
		});

		it('should allow accessing a mode through Proxy - E LYDIAN', () => {
			const key = new Key('E', Key.MAJOR, TEST);

			const eLyd = key.LYDIAN;

			expect(eLyd.chord.name).toBe('AM7');
			expect(eLyd.notes).toEqual([ 'A', 'B', 'C#', 'D#', 'E', 'F#', 'G#' ]);
		});
	});

	describe('#modulate', () => {
		it('should modulate UP', () => {
			const key = new Key('C', Key.MAJOR, TEST);

			key.modulate(Key.MOD_UP);

			expect(key.notes).toEqual([ 'G', 'A', 'B', 'C', 'D', 'E', 'F#' ]);
		});

		it('should modulate DOWN', () => {
			const key = new Key('A', Key.MAJOR, TEST);

			key.modulate(Key.MOD_DOWN);

			expect(key.notes).toEqual([ 'D', 'E', 'F#', 'G', 'A', 'B', 'C#' ]);
		});

		it('should modulate DORIAN', () => {
			const key = new Key('E', Key.DORIAN, TEST);

			key.modulate(Key.MOD_DOWN, '2M');

			expect(key.notes).toEqual([ 'D', 'E', 'F', 'G', 'A', 'B', 'C' ]);
		});

		it('should modulate PHRYGIAN', () => {
			const key = new Key('G', Key.PHRYGIAN, TEST);

			key.modulate(Key.MOD_UP, '6M');

			expect(key.notes).toEqual([ 'E', 'F', 'G', 'A', 'B', 'C', 'D' ]);
		});
	});

	describe('#modulateMode', () => {
		const key = new Key('Eb', Key.MIXOLYDIAN, TEST);

		it('should have key', () => {
			expect(key.root).toBe('Eb');
			expect(Key.NAMES[key.type]).toBe('MIXOLYDIAN');
			expect(key.chord.name).toBe('Eb7');

			expect(modesToChords(key.modes)).toEqual([
				'Eb7', 'Fm7', 'Gm7b5', 'AbM7', 'Bbm7', 'Cm7', 'DbM7',
			]);

			expect(modesToScales(key.modes)).toEqual([
				'MIXOLYDIAN',
				'AEOLIAN',
				'LOCRIAN',
				'IONIAN',
				'DORIAN',
				'PHRYGIAN',
				'LYDIAN',
			]);

			expect(key.modePosition).toBe('V');
		});

		it('should modulate to another mode - IONIAN', () => {
			seedRandom('test');

			key.modulateMode();

			expect(key.root).toBe('Ab');
			expect(Key.NAMES[key.type]).toBe('IONIAN');
			expect(key.chord.name).toBe('AbM7');
			expect(key.notes).toEqual([ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]);

			expect(key.modePosition).toBe('I');
		});

		it('should modulate to another mode', () => {
			seedRandom('test-2');

			key.modulateMode();

			expect(key.root).toBe('Db');
			expect(Key.NAMES[key.type]).toBe('LYDIAN');
			expect(key.chord.name).toBe('DbM7');
			expect(key.notes).toEqual([ 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C' ]);

			expect(key.modePosition).toBe('IV');
		});
	});
});
