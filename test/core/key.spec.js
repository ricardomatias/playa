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
	it('should be the same scale', () => {
		const key = new Key('C', Key.MAJOR);

		expect(key.notes).toEqual([ 60, 62, 64, 65, 67, 69, 71 ]);
		expect(key.chord.notes).toEqual([ 60, 64, 67, 71 ]);
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

		it('should modulate DORIAN - with interval', () => {
			const key = new Key('E', Key.DORIAN, TEST);

			key.modulate(Key.MOD_DOWN, '2M');

			expect(key.notes).toEqual([ 'D', 'E', 'F', 'G', 'A', 'B', 'C' ]);
		});

		it('should modulate PHRYGIAN - with interval', () => {
			const key = new Key('G', Key.PHRYGIAN, TEST);

			key.modulate(Key.MOD_UP, '6M');

			expect(key.notes).toEqual([ 'E', 'F', 'G', 'A', 'B', 'C', 'D' ]);
		});

		it('should modulate B - with interval', () => {
			const key = new Key('B', Key.IONIAN, TEST);

			expect(key.notes).toEqual([ 'B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#' ]);

			key.modulate(Key.MOD_UP, '5P');

			expect(key.notes).toEqual([ 'F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F' ]);
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

			expect(key.modePositionRoman).toBe('I');
		});

		it('should modulate to another mode - IONIAN', () => {
			seedRandom('test');

			key.modulateMode();

			expect(key.root).toBe('Ab');
			expect(Key.NAMES[key.type]).toBe('IONIAN');
			expect(key.chord.name).toBe('AbM7');
			expect(key.notes).toEqual([ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]);

			expect(key.modePositionRoman).toBe('IV');
		});

		it('should modulate to another mode based on direction - DOWN', () => {
			seedRandom('test-2');

			key.modulateMode({ direction: Key.MOD_DOWN });

			expect(key.root).toBe('G');
			expect(Key.NAMES[key.type]).toBe('LOCRIAN');
			expect(key.chord.name).toBe('Gm7b5');
			expect(key.notes).toEqual([ 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F' ]);

			expect(key.modePositionRoman).toBe('III');
		});

		it('should modulate to another mode', () => {
			seedRandom('test-2');

			key.modulateMode();

			expect(key.root).toBe('Db');
			expect(Key.NAMES[key.type]).toBe('LYDIAN');
			expect(key.chord.name).toBe('DbM7');
			expect(key.notes).toEqual([ 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C' ]);

			expect(key.modePositionRoman).toBe('VII');
		});

		it('should modulate to another mode based on direction - UP from last element', () => {
			seedRandom('test-2');

			key.modulateMode({ direction: Key.MOD_UP });

			expect(key.root).toBe('C');
			expect(Key.NAMES[key.type]).toBe('PHRYGIAN');
			expect(key.chord.name).toBe('Cm7');
			expect(key.notes).toEqual([ 'C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb' ]);

			expect(key.modePositionRoman).toBe('VI');
		});

		it('should modulate to another mode based on direction - UP', () => {
			seedRandom('test-2');

			key.modulateMode({ direction: Key.MOD_UP });

			expect(key.root).toBe('Db');
			expect(Key.NAMES[key.type]).toBe('LYDIAN');
			expect(key.chord.name).toBe('DbM7');
			expect(key.notes).toEqual([ 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C' ]);

			expect(key.modePositionRoman).toBe('VII');
		});

		it('should modulate to another mode based on direction - UP', () => {
			seedRandom('test-2');

			const newKey = new Key('G', Key.LYDIAN, TEST);

			newKey.modulateMode({ direction: Key.MOD_DOWN });

			expect(newKey.root).toBe('F#');
			expect(Key.NAMES[newKey.type]).toBe('PHRYGIAN');
			expect(newKey.chord.name).toBe('F#m7');
			expect(newKey.notes).toEqual([ 'F#', 'G', 'A', 'B', 'C#', 'D', 'E' ]);

			expect(newKey.modePositionRoman).toBe('VII');
		});

		it('should modulate to another mode based on direction & INTERVAL', () => {
			seedRandom('test-2');

			const newKey = new Key('G', Key.LYDIAN, TEST);

			newKey.modulateMode({ direction: Key.MOD_DOWN, interval: 3 });

			expect(newKey.root).toBe('E');
			expect(Key.NAMES[newKey.type]).toBe('DORIAN');
			expect(newKey.chord.name).toBe('Em7');
			expect(newKey.notes).toEqual([ 'E', 'F#', 'G', 'A', 'B', 'C#', 'D' ]);

			expect(newKey.modePositionRoman).toBe('VI');
		});

		it('should modulate to another mode based on direction & INTERVAL', () => {
			seedRandom('test-2');

			const newKey = new Key('G', Key.LYDIAN, TEST);

			newKey.modulateMode({ direction: Key.MOD_UP, interval: 5 });

			expect(newKey.root).toBe('D');
			expect(Key.NAMES[newKey.type]).toBe('IONIAN');
			expect(newKey.chord.name).toBe('DM7');
			expect(newKey.notes).toEqual([ 'D', 'E', 'F#', 'G', 'A', 'B', 'C#' ]);

			expect(newKey.modePositionRoman).toBe('V');
		});
	});
});
