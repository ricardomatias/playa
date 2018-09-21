const Scale = require('../lib/Scale');

describe('Scale Test Suite', () => {
	describe('#_createScale', () => {
		it('should create scale - chromatic', () => {
			const scale = new Scale('C', Scale.CHROMATIC);

			expect(scale.notesStr).to.eql(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']);
		});

		it('should create scale - natural', () => {
			const scale = new Scale('C', Scale.MAJOR);

			expect(scale.notesStr).to.eql(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
		});

		it('should create scale - sharp', () => {
			const scale = new Scale('G#', Scale.MINOR);

			expect(scale.notesStr).to.eql(['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#']);
		});

		it('should create scale - flat', () => {
			const scale = new Scale('Db', Scale.LYDIAN);

			expect(scale.notesStr).to.eql(['Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C']);
		});

		it('should create scale - pentatonic', () => {
			const scale = new Scale('C', Scale.MINOR_PENTATONIC);

			expect(scale.notesStr).to.eql(['C', 'D#', 'F', 'G', 'A#']);
		});
	});

	describe('#mapScaleOctaves', () => {
		it('should map - natural', () => {
			const scale = new Scale('C', Scale.MAJOR);
			const octaves = scale.mapScaleOctaves();

			const half = Math.round(octaves.length / 2);

			expect(octaves[0]).to.eql('C-1');
			expect(octaves[half]).to.eql('F4');
			expect(octaves[octaves.length - 1]).to.eql('G9');
			expect(octaves).to.have.length(75);
		});

		it('should map - sharp', () => {
			const scale = new Scale('E', Scale.MAJOR);
			const octaves = scale.mapScaleOctaves();

			const half = Math.round(octaves.length / 2);

			expect(octaves[0]).to.eql('E-1');
			expect(octaves[half]).to.eql('F#4');
			expect(octaves[octaves.length - 1]).to.eql('F#9');
			expect(octaves).to.have.length(72);
		});

		it('should map - flat', () => {
			const scale = new Scale('Ab', Scale.MAJOR);
			const octaves = scale.mapScaleOctaves();

			const half = Math.round(octaves.length / 2);

			expect(octaves[0]).to.eql('Ab-1');
			expect(octaves[half]).to.eql('Ab4');
			expect(octaves[octaves.length - 1]).to.eql('G9');
			expect(octaves).to.have.length(70);
		});

		it('should map - pentatonic', () => {
			const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC);
			const octaves = scale.mapScaleOctaves();

			const half = Math.round(octaves.length / 2);

			expect(octaves[0]).to.eql('Eb-1');
			expect(octaves[half]).to.eql('G4');
			expect(octaves[octaves.length - 1]).to.eql('G9');
			expect(octaves).to.have.length(53);
		});
	});
});
