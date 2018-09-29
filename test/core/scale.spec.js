import Scale from '../../lib/core/Scale';

const TYPE = { noteType: 'str' };

describe('Scale Test Suite', () => {
	describe('types', () => {
		it('should return MIDI', () => {
			const scale = new Scale('C', Scale.MAJOR);

			expect(scale.notes).to.eql([ 60, 62, 64, 65, 67, 69, 71, 72 ] );
		});
	});

	describe('#_createScale', () => {
		it('should create scale - chromatic', () => {
			const scale = new Scale('C', Scale.CHROMATIC, TYPE);

			expect(scale.notes).to.eql([ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ]);
		});

		it('should create scale - natural', () => {
			const scale = new Scale('C', Scale.MAJOR, TYPE);

			expect(scale.notes).to.eql([ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]);
		});

		it('should create scale - sharp', () => {
			const scale = new Scale('G#', Scale.MINOR, TYPE);

			expect(scale.notes).to.eql([ 'G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#' ]);
		});

		it('should create scale - flat', () => {
			const scale = new Scale('Db', Scale.LYDIAN, TYPE);

			expect(scale.notes).to.eql([ 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C' ]);
		});

		it('should create scale - pentatonic', () => {
			const scale = new Scale('C', Scale.MINOR_PENTATONIC, TYPE);

			expect(scale.notes).to.eql([ 'C', 'D#', 'F', 'G', 'A#' ]);
		});
	});
});
