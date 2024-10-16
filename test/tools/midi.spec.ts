import { describe, it, expect } from 'vitest';
import { Chord, Note } from '../../lib/core';
import { findNearest, findNearestChord, findNearestVoicings, spreadVoicing, transposeIfLower } from '../../lib/tools/midi';

const toNotes = (midiNotes: number[]) => {
	return midiNotes.map((midi) => {
		const note = new Note(midi);

		return !note.isSharp ? note.toEnharmonic().pitch : note.pitch;
	});
};

const assureSeparation = (midiNotes: number[], min: number) => {
	return midiNotes.slice(1).every((midi, i) => midi - midiNotes[i] >= min);
};

describe('A Midi test suite', () => {
	describe('#findNearestChord', () => {
		// A - 69 ; C - 72 ; E - 76
		const Am = [69, 72, 76];

		it('should return the nearest chord - basic', () => {
			const nearestChord = findNearestChord(Am, Chord.fromName('Cmaj').noteSymbols, { sort: true });

			expect(nearestChord).toEqual([67, 72, 76]);
			expect(toNotes(nearestChord)).toEqual(['G3', 'C4', 'E4']);
		});

		it('should return the nearest chord - sharp', () => {
			const nearestChord = findNearestChord(Am, ['C#', 'F', 'G#'], { sort: true });

			expect(nearestChord).toEqual([68, 73, 77]);
			expect(toNotes(nearestChord)).toEqual(['G#3', 'C#4', 'F4']);
		});

		it('should return the nearest chord - flat', () => {
			const nearestChord = findNearestChord(Am, ['Db', 'Gb', 'Eb', 'Bb'], { sort: true });

			expect(nearestChord).toEqual([70, 73, 75, 78]);
			expect(toNotes(nearestChord)).toEqual(['A#3', 'C#4', 'D#4', 'F#4']);
		});

		it('should return the nearest chord - less notes', () => {
			const nearestChord = findNearestChord([70, 73, 75, 78], ['C', 'B'], { sort: true });

			expect(nearestChord).toEqual([71, 72]);
			expect(toNotes(nearestChord)).toEqual(['B3', 'C4']);
		});

		it('should return the nearest chord - octaves', () => {
			const nearestChord = findNearestChord([70, 73, 75, 78], ['A', 'E', 'A'], { sort: true });

			expect(nearestChord).toEqual([69, 76, 81]);
			expect(toNotes(nearestChord)).toEqual(['A3', 'E4', 'A4']);
		});

		it('should return the nearest chord - keeping the bass note', () => {
			// A - 69 ; C - 72 ; E - 76
			const nearestChord = findNearestChord(Am, ['Db', 'Gb', 'Eb', 'Bb'], { sort: true, keepBass: true });

			expect(nearestChord).toEqual([61, 70, 75, 78]);
			expect(toNotes(nearestChord)).toEqual(['C#3', 'A#3', 'D#4', 'F#4']);
		});

		it('should return the nearest chord - keeping the bass note #2', () => {
			// A - 69 ; C - 72 ; E - 76
			const nearestChord = findNearestChord(Am, ['E', 'G', 'B', 'D'], { sort: true, keepBass: true });

			expect(nearestChord).toEqual([64, 67, 71, 74]);
			expect(toNotes(nearestChord)).toEqual(['E3', 'G3', 'B3', 'D4']);
		});
	});

	describe('#spreadVoicing', () => {
		it('should return the nearest voicing - min 2 semitones distance', () => {
			const Bb6 = [55, 58, 62, 65];
			const Cm13 = [55, 57, 58, 60, 62, 63];

			// * Define minimum distance between notes
			// * min 2 notes dist
			// 57 -> 69 (57 + 12) and 45 (-12)
			// 58 -> 70 (58 + 12) and 46 (-12)
			// choose closest result to the edges which respects min dist
			// = 69 (57)
			// * [55, 58, 60, 62, 63, 69]
			// 62 -> 74 (+12) and 50 (-12)
			// 63 -> 75 (+12) and 51 (-12)
			// = 51 (63)
			// * [51, 55, 58, 60, 62, 69]

			const nearest = findNearestChord(Bb6, Chord.fromName('Cm13').noteSymbols, { sort: true });

			expect(toNotes(nearest)).toEqual(['G2', 'A2', 'A#2', 'C3', 'D3', 'D#3']);

			const spread = spreadVoicing(Cm13, 2);

			expect(assureSeparation(spread, 2)).toBeTruthy();

			// * from [ 'G2', 'A2', 'A#2', 'C3', 'D3', 'D#3' ] to ...below..
			expect(toNotes(spread)).toEqual(['D#2', 'G2', 'A#2', 'C3', 'D3', 'A3']);
		});

		it('should return the nearest voicing - min 3 semitones distance', () => {
			// ["F#3", "G3", "A3", "B3", "C4", "E4"]
			const Am13 = [66, 67, 69, 71, 72, 76];

			const spread = spreadVoicing(Am13, 3);

			expect(assureSeparation(spread, 3)).toBeTruthy();

			expect(toNotes(spread)).toEqual(['F#3', 'A3', 'C4', 'E4', 'G4', 'B4']);
		});

		it('should return the nearest voicing - min 4 semitones distance', () => {
			// "F3", "F#3", "A#3", "C4", "G#4", "D#5"
			const Ab13 = [65, 66, 70, 72, 80, 87];

			const spread = spreadVoicing(Ab13, 4);

			expect(assureSeparation(spread, 4)).toBeTruthy();

			expect(toNotes(spread)).toEqual(['G#2', 'C3', 'F3', 'A#3', 'F#4', 'D#5']);
		});
	});

	describe('#findNearestVoicing', () => {
		it('should return the nearest voicing', () => {
			const c = [
				{ time: 0, dur: 480, next: 480, midi: 60, note: 'C3', isRest: false },
				{ time: 480, dur: 480, next: 960, midi: 67, note: 'G3', isRest: false },
				{ time: 960, dur: 480, next: 1440, midi: 65, note: 'F3', isRest: false },
			];
			const f = [
				{ time: 0, dur: 480, next: 480, midi: 65, note: 'F3', isRest: false },
				{ time: 480, dur: 480, next: 960, midi: 72, note: 'C4', isRest: false },
				{ time: 960, dur: 480, next: 1440, midi: 71, note: 'B3', isRest: false },
				{ time: 1080, dur: 480, next: 1440, midi: 60, note: 'C3', isRest: false },
			];

			const nearest = findNearestVoicings(c, f);

			expect(nearest).toEqual([
				{ time: 0, dur: 480, next: 480, midi: 65, note: 'F3', isRest: false },
				{ time: 480, dur: 480, next: 960, midi: 60, note: 'C3', isRest: false },
				{ time: 960, dur: 480, next: 1440, midi: 59, note: 'B2', isRest: false },
				{ time: 1080, dur: 480, next: 1440, midi: 60, note: 'C3', isRest: false },
			]);
		});
	});

	describe('#findNearest', () => {
		it('should return the nearest note - close', () => {
			// A - 69
			const nearest = findNearest(69, 'C');

			expect(nearest[0]).toEqual(72);
		});

		it('should return the nearest note - middle', () => {
			// A - 69
			const nearest = findNearest(69, 'D');

			expect(nearest[0]).toEqual(74);
		});

		it('should return the nearest note - sharp', () => {
			// A - 69
			const nearest = findNearest(69, 'F#');

			expect(nearest[0]).toEqual(66);
		});

		it('should return the nearest note - flat', () => {
			// Gb - 66
			const nearest = findNearest(66, 'Db');

			expect(nearest[0]).toEqual(61);
		});

		it('should return the nearest note - flat 2', () => {
			// A - 69
			const nearest = findNearest(69, 'Eb');

			expect(nearest[0]).toEqual(63);
		});
	});

	describe('#transposeIfLower', () => {
		it('should transpose 1 octave', () => {
			// A3 - 69 ; C4 - 72 ; E4 - 76
			const Am = [57, 60, 64];

			const notes = transposeIfLower(Am, 'C3');

			expect(toNotes(notes)).toEqual(['A3', 'C4', 'E4']);
		});

		it('should transpose 2 octaves', () => {
			// A3 - 69 ; C4 - 72 ; E4 - 76
			const Am = [57, 60, 64];

			const notes = transposeIfLower(Am, 'C4');

			expect(toNotes(notes)).toEqual(['A4', 'C5', 'E5']);
		});
	});
});
