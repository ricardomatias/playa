import Scale from '../../lib/core/Scale';

const TYPE = { noteType: 'str' };

describe('Scale Test Suite', () => {
	describe('types', () => {
		it('should return MIDI', () => {
			const scale = new Scale('C', Scale.MAJOR);

			expect(scale.notes).toEqual([ 60, 62, 64, 65, 67, 69, 71 ]);
		});
	});

	describe('#_createScale', () => {
		it('should create scale - chromatic', () => {
			const scale = new Scale('C', Scale.CHROMATIC, TYPE);

			expect(scale.notes).toEqual([ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ]);
		});

		it('should create scale - natural', () => {
			const scale = new Scale('C', Scale.MAJOR, TYPE);

			expect(scale.notes).toEqual([ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]);
		});

		it('should create scale - sharp', () => {
			const scale = new Scale('G#', Scale.MINOR, TYPE);

			expect(scale.notes).toEqual([ 'G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#' ]);
		});

		it('should create scale - flat', () => {
			const scale = new Scale('Db', Scale.LYDIAN, TYPE);

			expect(scale.notes).toEqual([ 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C' ]);
		});

		it('should create scale - locrian', () => {
			const scale = new Scale('A', Scale.LOCRIAN, TYPE);

			expect(scale.notes).toEqual([ 'A', 'Bb', 'C', 'D', 'Eb', 'F', 'G' ]);
		});

		it('should create scale - phrygian', () => {
			const scale = new Scale('G', Scale.PHRYGIAN, TYPE);

			expect(scale.notes).toEqual([ 'G', 'Ab', 'Bb', 'C', 'D', 'Eb', 'F' ]);
		});

		it('should create scale - pentatonic', () => {
			const scale = new Scale('C', Scale.MINOR_PENTATONIC, TYPE);

			expect(scale.notes).toEqual([ 'C', 'D#', 'F', 'G', 'A#' ]);
		});

		it('should create scale - MELODIC_MINOR', () => {
			const scale = new Scale('C', Scale.MELODIC_MINOR, TYPE);

			expect(scale.notes).toEqual([ 'C', 'D', 'Eb', 'F', 'G', 'A', 'B' ]);
		});

		it('should create scale - ALTERED', () => {
			const scale = new Scale('F#', Scale.ALTERED, TYPE);

			expect(scale.notes).toEqual([ 'F#', 'G', 'A', 'A#', 'C', 'D', 'E' ]);
		});

		it('should create scale - LYDIAN', () => {
			const scale = new Scale('B', Scale.LYDIAN, TYPE);

			expect(scale.notes).toEqual([ 'B', 'C#', 'D#', 'F', 'F#', 'G#', 'A#' ]);
		});
	});
});
