import { findNearest, findNearestChord } from '../../lib/tools/midi';

describe.only('A Midi test suite', () => {
	describe('#findNearestChord', () => {
		it('should return the nearest chord', () => {
			// A - 69 ; C - 72 ; E - 76
			const nearestChord = findNearestChord([ 69, 72, 76 ], [ 'C', 'E', 'G' ]);

			expect(nearestChord).toEqual([ 67, 72, 76 ]);
		});

		it('should return the nearest chord - sharp', () => {
			// A - 69 ; C - 72 ; E - 76
			const nearestChord = findNearestChord([ 69, 72, 76 ], [ 'C#', 'F', 'G#' ]);

			expect(nearestChord).toEqual([ 68, 73, 77 ]);
		});

		it('should return the nearest chord - flat', () => {
			// A - 69 ; C - 72 ; E - 76
			const nearestChord = findNearestChord([ 69, 72, 76 ], [ 'Db', 'Gb', 'Eb', 'Bb' ]);

			expect(nearestChord).toEqual([ 70, 73, 75, 78 ]);
		});

		it('should return the nearest chord - less notes', () => {
			// A - 69 ; C - 72 ; E - 76
			const nearestChord = findNearestChord([ 70, 73, 75, 78 ], [ 'C', 'B' ]);

			expect(nearestChord).toEqual([ 71, 72 ]);
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
