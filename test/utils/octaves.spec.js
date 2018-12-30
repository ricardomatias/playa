import * as R from 'ramda';
import assignOctaves from '../../lib/utils/octaves';
import { Scale, Chord } from '../../lib/core';
import NoteType from '../../lib/core/types';

const TYPE = { noteType: NoteType.NOTE };


describe('An Octaves Test Suite', () => {
	it('should map - natural', () => {
		const scale = new Scale('C', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes);

		const half = Math.round(octaves.length / 2);

		expect(octaves[0].n).to.eql('C-1');
		expect(octaves[half].n).to.eql('F4');
		expect(R.last(octaves).n).to.eql('G9');
		expect(octaves).to.have.length(75);
	});

	it('should map - sharp', () => {
		const scale = new Scale('E', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes, [ 3, 2 ]);

		const half = Math.round(octaves.length / 2);

		expect(octaves[0].n).to.eql('E3');
		expect(octaves[half].n).to.eql('F#4');
		expect(R.last(octaves).n).to.eql('E5');
		expect(octaves).to.have.length(15);
	});

	it('should map - flat', () => {
		const scale = new Scale('Ab', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes, [ 4, 4 ]);

		const half = Math.round(octaves.length / 2);

		expect(octaves[0].n).to.eql('Ab4');
		expect(octaves[half].n).to.eql('Bb6');
		expect(R.last(octaves).n).to.eql('Ab8');
		expect(octaves).to.have.length(29);
	});

	it('should map - pentatonic', () => {
		const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC, TYPE);
		const octaves = assignOctaves(scale.notes, [ -1 ]);

		const half = Math.round(octaves.length / 2);

		expect(octaves[0].n).to.eql('Eb-1');
		expect(octaves[half].n).to.eql('Bb-1');
		expect(R.last(octaves).n).to.eql('Eb0');
		expect(octaves).to.have.length(6);
	});

	it('should map - major with flats', () => {
		const scale = new Scale('F', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes, [ -1 ], { type: Scale, hasFlats: true });

		const half = Math.round(octaves.length / 2);

		expect(octaves[0].n).to.eql('F-1');
		expect(octaves[half].n).to.eql('C0');
		expect(R.last(octaves).n).to.eql('F0');
		expect(octaves).to.have.length(8);
	});

	it('should map 9m chord', () => {
		const chord = new Chord('Abm9', TYPE);
		const octaves = assignOctaves(chord.notes, [ 4 ], { type: 'chord' });

		const half = Math.round(octaves.length / 2);

		expect(octaves[0].n).to.eql('Ab4');
		expect(octaves[half].n).to.eql('Gb5');
		expect(R.last(octaves).n).to.eql('Bb5');
		expect(octaves).to.have.length(5);
	});

	it('should map M13 chord', () => {
		const chord = new Chord('CM13', TYPE);
		const octaves = assignOctaves(chord.notes, [ 4, 2 ], { type: 'chord' });

		const half = Math.round(octaves.length / 2);

		expect(octaves[0].n).to.eql('C4');
		expect(octaves[half].n).to.eql('C6');
		expect(R.last(octaves).n).to.eql('A7');
		expect(octaves).to.have.length(12);
	});
});

