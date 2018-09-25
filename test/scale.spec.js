import Scale from '../lib/Scale';

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

	describe('#mapScaleOctaves', () => {
		it('should map - natural', () => {
			const scale = new Scale('C', Scale.MAJOR, TYPE);
			const octaves = scale.mapScaleOctaves();

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('C-1');
			expect(octaves[half].noct).to.eql('F4');
			expect(octaves[octaves.length - 1].noct).to.eql('G9');
			expect(octaves).to.have.length(75);
		});

		it('should map - sharp', () => {
			const scale = new Scale('E', Scale.MAJOR, TYPE);
			const octaves = scale.mapScaleOctaves([ 3, 2 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('E3');
			expect(octaves[half].noct).to.eql('F#4');
			expect(octaves[octaves.length - 1].noct).to.eql('E5');
			expect(octaves).to.have.length(15);
		});

		it('should map - flat', () => {
			const scale = new Scale('Ab', Scale.MAJOR, TYPE);
			const octaves = scale.mapScaleOctaves([ 4, 4 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('Ab4');
			expect(octaves[half].noct).to.eql('Bb6');
			expect(octaves[octaves.length - 1].noct).to.eql('Ab8');
			expect(octaves).to.have.length(29);
		});

		it('should map - pentatonic', () => {
			const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC, TYPE);
			const octaves = scale.mapScaleOctaves([ -1 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('Eb-1');
			expect(octaves[half].noct).to.eql('Bb-1');
			expect(octaves[octaves.length - 1].noct).to.eql('C0');
			expect(octaves).to.have.length(5);
		});
	});
});
