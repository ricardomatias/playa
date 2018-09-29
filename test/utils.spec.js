import assignOctaves from '../lib/utils/assignOctaves';
import Scale from '../lib/core/Scale';
import Chord from '../lib/core/Chord';
import NoteType from '../lib/core/types';

const TYPE = { noteType: NoteType.NOTE };


describe('A Utils Test Suite', () => {
	describe('#assignOctaves', () => {
		it('should map - natural', () => {
			const scale = new Scale('C', Scale.MAJOR, TYPE);
			const octaves = assignOctaves(scale.notes);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('C-1');
			expect(octaves[half].noct).to.eql('F4');
			expect(octaves[octaves.length - 1].noct).to.eql('G9');
			expect(octaves).to.have.length(75);
		});

		it('should map - sharp', () => {
			const scale = new Scale('E', Scale.MAJOR, TYPE);
			const octaves = assignOctaves(scale.notes, [ 3, 2 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('E3');
			expect(octaves[half].noct).to.eql('F#4');
			expect(octaves[octaves.length - 1].noct).to.eql('E5');
			expect(octaves).to.have.length(15);
		});

		it('should map - flat', () => {
			const scale = new Scale('Ab', Scale.MAJOR, TYPE);
			const octaves = assignOctaves(scale.notes, [ 4, 4 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('Ab4');
			expect(octaves[half].noct).to.eql('Bb6');
			expect(octaves[octaves.length - 1].noct).to.eql('Ab8');
			expect(octaves).to.have.length(29);
		});

		it('should map - pentatonic', () => {
			const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC, TYPE);
			const octaves = assignOctaves(scale.notes, [ -1 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('Eb-1');
			expect(octaves[half].noct).to.eql('Bb-1');
			expect(octaves[octaves.length - 1].noct).to.eql('Eb0');
			expect(octaves).to.have.length(6);
		});

		it('should map 9m chord', () => {
			const chord = new Chord('Abm9', TYPE);
			const octaves = assignOctaves(chord.notes, [ 4 ], 'chord');

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('Ab4');
			expect(octaves[half].noct).to.eql('Gb5');
			expect(octaves[octaves.length - 1].noct).to.eql('Bb5');
			expect(octaves).to.have.length(5);
		});

		it('should map M13 chord', () => {
			const chord = new Chord('CM13', TYPE);
			const octaves = assignOctaves(chord.notes, [ 4, 2 ], 'chord');

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].noct).to.eql('C4');
			expect(octaves[half].noct).to.eql('C6');
			expect(octaves[octaves.length - 1].noct).to.eql('A7');
			expect(octaves).to.have.length(12);
		});
	});
});

