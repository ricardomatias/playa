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
			const chord = new Chord('Abm9', Object.assign({}, TYPE, { octaves: [ 4 ] }));
			const notes = chord.notes;

			const half = Math.round(notes.length / 2);

			expect(notes[0].n).to.eql('Ab4');
			expect(notes[half].n).to.eql('Gb5');
			expect(notes[notes.length - 1].n).to.eql('Bb5');
			expect(notes).to.have.length(5);
		});

		it('should map M13 chord', () => {
			const chord = new Chord('CM13', Object.assign({}, TYPE, { octaves: [ 4, 2 ] }));
			const notes = chord.notes;

			const half = Math.round(notes.length / 2);

			expect(notes[0].n).to.eql('C4');
			expect(notes[half].n).to.eql('C6');
			expect(notes[notes.length - 1].n).to.eql('A7');
			expect(notes).to.have.length(12);
		});
	});
});

