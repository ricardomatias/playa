import { MidiNotes } from '../../lib/constants';
import { Chord } from '../../lib/core';
import { findNearest, findNearestChord, findNearestVoicings } from '../../lib/tools/midi';

const toNotes = (midiNotes: number[]) => {
	return midiNotes.map((midi) => MidiNotes[midi]);
};

describe('A Midi test suite', () => {
	describe('#findNearestChord', () => {
		// A - 69 ; C - 72 ; E - 76
		const Am = [ 69, 72, 76 ];

		it('should return the nearest chord - basic', () => {
			const nearestChord = findNearestChord(Am, [ 'C', 'E', 'G' ], { sort: true });

			expect(nearestChord).toEqual([ 67, 72, 76 ]);
			expect(toNotes(nearestChord)).toEqual([ 'G3', 'C4', 'E4' ]);
		});

		it('should return the nearest chord - sharp', () => {
			const nearestChord = findNearestChord(Am, [ 'C#', 'F', 'G#' ], { sort: true });

			expect(nearestChord).toEqual([ 68, 73, 77 ]);
			expect(toNotes(nearestChord)).toEqual([ 'G#3', 'C#4', 'F4' ]);
		});

		it('should return the nearest chord - flat', () => {
			const nearestChord = findNearestChord(Am, [ 'Db', 'Gb', 'Eb', 'Bb' ], { sort: true });

			expect(nearestChord).toEqual([ 70, 73, 75, 78 ]);
			expect(toNotes(nearestChord)).toEqual([ 'A#3', 'C#4', 'D#4', 'F#4' ]);
		});

		it('should return the nearest chord - less notes', () => {
			const nearestChord = findNearestChord([ 70, 73, 75, 78 ], [ 'C', 'B' ], { sort: true });

			expect(nearestChord).toEqual([ 71, 72 ]);
			expect(toNotes(nearestChord)).toEqual([ 'B3', 'C4' ]);
		});

		it('should return the nearest chord - octaves', () => {
			const nearestChord = findNearestChord([ 70, 73, 75, 78 ], [ 'A', 'E', 'A' ], { sort: true });

			expect(nearestChord).toEqual([ 69, 76, 81 ]);
			expect(toNotes(nearestChord)).toEqual([ 'A3', 'E4', 'A4' ]);
		});
	});

	describe('#findNearestVoicing', () => {
		it('should return the nearest voicing', () => {
			const c = [
				{ time: 0, dur: 480, next: 480, midi: 60, note: 'C3', isRest: false },
				{ time: 480, dur: 480, next: 960, midi: 67, note: 'G3', isRest: false, },
				{ time: 960, dur: 480, next: 1440, midi: 65, note: 'F3', isRest: false, },
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

			expect(nearest).toEqual(72);
		});

		it('should return the nearest note - middle', () => {
			// A - 69
			const nearest = findNearest(69, 'D');

			expect(nearest).toEqual(74);
		});

		it('should return the nearest note - sharp', () => {
			// A - 69
			const nearest = findNearest(69, 'F#');

			expect(nearest).toEqual(66);
		});

		it('should return the nearest note - flat', () => {
			// Gb - 66
			const nearest = findNearest(66, 'Db');

			expect(nearest).toEqual(61);
		});

		it('should return the nearest note - flat 2', () => {
			// A - 69
			const nearest = findNearest(69, 'Eb');

			expect(nearest).toEqual(63);
		});
	});
});
