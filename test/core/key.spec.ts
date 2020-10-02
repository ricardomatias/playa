import { Key, Chord } from '../../lib/core';
import Random from '../../lib/tools/random';
import '../matchers';

function modesToChords(modes) {
	return modes.map((mode) => {
		const chord = new Chord({
			root: mode.root,
			intervals: mode.scale,
			structure: Chord.Structures.Seventh,
		});

		return chord.name;
	});
}

function modesToScales(modes) {
	return modes.map((mode) => {
		return Key.getModeName(mode.scale);
	});
}

function testModulation(key) {
	return {
		root: key.root,
		name: Key.getModeName(key.intervals),
		chordName: key.chord.name,
		notes: key.string,
		modePositionRoman: key.modePositionRoman,
	};
}

describe('Key Test Suite', () => {
	it('should be the same scale', () => {
		const key = new Key('C', Key.Major);

		expect(key).toHaveMidiNotes([ 60, 62, 64, 65, 67, 69, 71 ]);
		expect(key.chord).toHaveMidiNotes([ 60, 64, 67, 71 ]);
	});

	describe('Modes', () => {
		it('should have chords for C Major', () => {
			const key = new Key('C', Key.Major);

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
			const key = new Key('Ab', Key.Minor);

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
			const key = new Key('E', Key.Dorian);

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

		it('should allow accessing a mode through roman numeral', () => {
			const key = new Key('A', Key.Major);

			const cMin = key.III;

			expect(cMin.chord.name).toBe('C#m7');
			expect(cMin).toHaveStringNotes([
				'C#3',
				'D3',
				'E3',
				'F#3',
				'G#3',
				'A3',
				'B3',
			]);

			const eMaj = key['V'];
			expect(eMaj.chord.name).toBe('E7');
			expect(eMaj).toHaveStringNotes([
				'E3',
				'F#3',
				'G#3',
				'A3',
				'B3',
				'C#4',
				'D4',
			]);
		});
	});

	describe('#modulate', () => {
		it('should modulate UP', () => {
			const key = new Key('C', Key.Major);

			key.modulateUp();

			expect(key).toHaveStringNotes([
				'G3',
				'A3',
				'B3',
				'C4',
				'D4',
				'E4',
				'F#4',
			]);
		});

		it('should modulate DOWN', () => {
			const key = new Key('A', Key.Major);

			key.modulateDown();

			expect(key).toHaveStringNotes([
				'D3',
				'E3',
				'F#3',
				'G3',
				'A3',
				'B3',
				'C#4',
			]);
		});

		it('should modulate DORIAN - with interval', () => {
			const key = new Key('E', Key.Dorian);

			key.modulate(Key.ModulateDown, '2M');

			expect(key).toHaveStringNotes([
				'D3',
				'E3',
				'F3',
				'G3',
				'A3',
				'B3',
				'C4',
			]);
		});

		it('should modulate PHRYGIAN - with interval', () => {
			const key = new Key('G', Key.Phrygian);

			key.modulate(Key.ModulateUp, '6M');

			expect(key).toHaveStringNotes([
				'E3',
				'F3',
				'G3',
				'A3',
				'B3',
				'C4',
				'D4',
			]);
		});

		it('should modulate B - with interval', () => {
			const key = new Key('B', Key.Ionian);

			expect(key).toHaveStringNotes([
				'B3',
				'C#4',
				'D#4',
				'E4',
				'F#4',
				'G#4',
				'A#4',
			]);

			key.modulate(Key.ModulateUp, '5P');

			expect(key).toHaveStringNotes([
				'F#3',
				'G#3',
				'A#3',
				'B3',
				'C#4',
				'D#4',
				'F4',
			]);
		});

		it('should modulate UP with interval and direction', () => {
			const key = new Key('Db', Key.Lydian);

			key.modulate(Key.ModulateUp, '7m');

			expect(key).toHaveStringNotes([
				'B3',
				'C#4',
				'D#4',
				'F4',
				'F#4',
				'G#4',
				'A#4',
			]);
		});
	});

	describe('#modulateMode', () => {
		const key = new Key('Eb', Key.Mixolydian);

		it('should have key', () => {
			expect(key.root).toBe('Eb');
			expect(key.intervals).toBe(Key.Mixolydian);
			expect(key.chord.name).toBe('Eb7');

			expect(modesToChords(key.modes)).toEqual([
				'Eb7',
				'Fm7',
				'Gm7b5',
				'AbM7',
				'Bbm7',
				'Cm7',
				'DbM7',
			]);

			expect(modesToScales(key.modes)).toEqual([
				'Mixolydian',
				'Aeolian',
				'Locrian',
				'Ionian',
				'Dorian',
				'Phrygian',
				'Lydian',
			]);

			expect(key.modePositionRoman).toBe('I');
		});

		it('should modulate to another mode - Aeolian', () => {
			Random.setSeed('test');

			key.modulateMode();

			expect(testModulation(key)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "Fm7",
			  "modePositionRoman": "II",
			  "name": "Aeolian",
			  "notes": Array [
			    "F3",
			    "G3",
			    "Ab3",
			    "Bb3",
			    "C4",
			    "Db4",
			    "Eb4",
			  ],
			  "root": "F",
			}
		`);
		});

		it('should modulate to another mode based on direction - DOWN', () => {
			Random.setSeed('test-2');

			key.modulateMode({ direction: Key.ModulateDown });

			expect(testModulation(key)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "Eb7",
			  "modePositionRoman": "I",
			  "name": "Mixolydian",
			  "notes": Array [
			    "Eb3",
			    "F3",
			    "G3",
			    "Ab3",
			    "Bb3",
			    "C4",
			    "Db4",
			  ],
			  "root": "Eb",
			}
		`);
		});

		it('should modulate to another mode - F', () => {
			Random.setSeed('test-2');

			key.modulateMode();

			expect(testModulation(key)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "Fm7",
			  "modePositionRoman": "II",
			  "name": "Aeolian",
			  "notes": Array [
			    "F3",
			    "G3",
			    "Ab3",
			    "Bb3",
			    "C4",
			    "Db4",
			    "Eb4",
			  ],
			  "root": "F",
			}
		`);
		});

		it('should modulate to another mode based on direction - UP from last element', () => {
			Random.setSeed('test-2');

			key.modulateMode({ direction: Key.ModulateUp });

			expect(testModulation(key)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "Bbm7",
			  "modePositionRoman": "V",
			  "name": "Dorian",
			  "notes": Array [
			    "Bb3",
			    "C4",
			    "Db4",
			    "Eb4",
			    "F4",
			    "G4",
			    "Ab4",
			  ],
			  "root": "Bb",
			}
		`);
		});

		it('should modulate to another mode based on direction - UP', () => {
			Random.setSeed('test-2');

			key.modulateMode({ direction: Key.ModulateUp });

			expect(testModulation(key)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "Cm7",
			  "modePositionRoman": "VI",
			  "name": "Phrygian",
			  "notes": Array [
			    "C3",
			    "Db3",
			    "Eb3",
			    "F3",
			    "G3",
			    "Ab3",
			    "Bb3",
			  ],
			  "root": "C",
			}
		`);
		});

		it('should modulate to another mode based on direction - UP', () => {
			Random.setSeed('test-2');

			const newKey = new Key('G', Key.Lydian);

			newKey.modulateMode({ direction: Key.ModulateDown });

			expect(testModulation(newKey)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "Bm7",
			  "modePositionRoman": "III",
			  "name": "Aeolian",
			  "notes": Array [
			    "B3",
			    "C#4",
			    "D4",
			    "E4",
			    "F#4",
			    "G4",
			    "A4",
			  ],
			  "root": "B",
			}
		`);
		});

		it('should modulate to another mode based on direction & INTERVAL', () => {
			Random.setSeed('test-2');

			const newKey = new Key('G', Key.Lydian);

			newKey.modulateMode({ direction: Key.ModulateDown, interval: 3 });

			expect(testModulation(newKey)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "Em7",
			  "modePositionRoman": "VI",
			  "name": "Dorian",
			  "notes": Array [
			    "E3",
			    "F#3",
			    "G3",
			    "A3",
			    "B3",
			    "C#4",
			    "D4",
			  ],
			  "root": "E",
			}
		`);
		});

		it('should modulate to another mode based on direction & INTERVAL', () => {
			Random.setSeed('test-2');

			const newKey = new Key('G', Key.Lydian);

			newKey.modulateMode({ direction: Key.ModulateUp, interval: 5 });

			expect(testModulation(newKey)).toMatchInlineSnapshot(`
			Object {
			  "chordName": "DM7",
			  "modePositionRoman": "V",
			  "name": "Ionian",
			  "notes": Array [
			    "D3",
			    "E3",
			    "F#3",
			    "G3",
			    "A3",
			    "B3",
			    "C#4",
			  ],
			  "root": "D",
			}
		`);
		});
	});
});
