import { MidiNotes } from '../../lib/constants';
import { findNearest, findNearestChord } from '../../lib/tools/midi';

const toNotes = (midiNotes: number[]) => {
	return midiNotes.map((midi) => MidiNotes[midi]);
};

describe('A Midi test suite', () => {
	describe('#findNearestChord', () => {
		// A - 69 ; C - 72 ; E - 76
		const Am = [ 69, 72, 76 ];

		it('should return the nearest chord', () => {
			const nearestChord = findNearestChord(Am, [ 'C', 'E', 'G' ]);

			expect(nearestChord).toEqual([ 67, 72, 76 ]);
			expect(toNotes(nearestChord)).toEqual([ 'G3', 'C4', 'E4' ]);
		});

		it('should return the nearest chord - sharp', () => {
			const nearestChord = findNearestChord(Am, [ 'C#', 'F', 'G#' ]);

			expect(nearestChord).toEqual([ 68, 73, 77 ]);
			expect(toNotes(nearestChord)).toEqual([ 'G#3', 'C#4', 'F4' ]);
		});

		it('should return the nearest chord - flat', () => {
			const nearestChord = findNearestChord(Am, [ 'Db', 'Gb', 'Eb', 'Bb' ]);

			expect(nearestChord).toEqual([ 70, 73, 75, 78 ]);
			expect(toNotes(nearestChord)).toEqual([ 'A#3', 'C#4', 'D#4', 'F#4' ]);
		});

		it('should return the nearest chord - less notes', () => {
			// Bb - 70 ; Db - 72 ; Eb - 75 ; 78 - Gb
			const nearestChord = findNearestChord([ 70, 73, 75, 78 ], [ 'C', 'B' ]);

			expect(nearestChord).toEqual([ 71, 72 ]);
			expect(toNotes(nearestChord)).toEqual([ 'B3', 'C4' ]);
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
