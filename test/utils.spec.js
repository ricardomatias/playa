import assignOctaves from '../lib/utils/assignOctaves';
import whilst from '../lib/utils/whilst';
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

			expect(octaves[0].n).to.eql('C-1');
			expect(octaves[half].n).to.eql('F4');
			expect(octaves[octaves.length - 1].n).to.eql('G9');
			expect(octaves).to.have.length(75);
		});

		it('should map - sharp', () => {
			const scale = new Scale('E', Scale.MAJOR, TYPE);
			const octaves = assignOctaves(scale.notes, [ 3, 2 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].n).to.eql('E3');
			expect(octaves[half].n).to.eql('F#4');
			expect(octaves[octaves.length - 1].n).to.eql('E5');
			expect(octaves).to.have.length(15);
		});

		it('should map - flat', () => {
			const scale = new Scale('Ab', Scale.MAJOR, TYPE);
			const octaves = assignOctaves(scale.notes, [ 4, 4 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].n).to.eql('Ab4');
			expect(octaves[half].n).to.eql('Bb6');
			expect(octaves[octaves.length - 1].n).to.eql('Ab8');
			expect(octaves).to.have.length(29);
		});

		it('should map - pentatonic', () => {
			const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC, TYPE);
			const octaves = assignOctaves(scale.notes, [ -1 ]);

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].n).to.eql('Eb-1');
			expect(octaves[half].n).to.eql('Bb-1');
			expect(octaves[octaves.length - 1].n).to.eql('Eb0');
			expect(octaves).to.have.length(6);
		});

		it('should map 9m chord', () => {
			const chord = new Chord('Abm9', TYPE);
			const octaves = assignOctaves(chord.notes, [ 4 ], 'chord');

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].n).to.eql('Ab4');
			expect(octaves[half].n).to.eql('Gb5');
			expect(octaves[octaves.length - 1].n).to.eql('Bb5');
			expect(octaves).to.have.length(5);
		});

		it('should map M13 chord', () => {
			const chord = new Chord('CM13', TYPE);
			const octaves = assignOctaves(chord.notes, [ 4, 2 ], 'chord');

			const half = Math.round(octaves.length / 2);

			expect(octaves[0].n).to.eql('C4');
			expect(octaves[half].n).to.eql('C6');
			expect(octaves[octaves.length - 1].n).to.eql('A7');
			expect(octaves).to.have.length(12);
		});
	});

	describe('#whilst', () => {
		it('should work as a simple for loop', () => {
			let idx = 0;

			whilst(() => {
				idx++;
			}, () => (idx < 100));

			expect(idx).to.eql(100);
		});

		it('should work as a normal while', () => {
			let idx = 0;
			let exists = true;

			whilst(() => {
				if (idx > 500) {
					exists = false;
				}

				idx++;
			}, () => (exists));

			expect(exists).to.be.false;
		});
	});
});

