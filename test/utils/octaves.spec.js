import * as R from 'ramda';
import assignOctaves from '../../lib/utils/octaves';
import { Scale, Chord } from '../../lib/core';
import NoteType from '../../lib/core/types';

const TYPE = { noteType: NoteType.NOTE };

const toNoteObj = (note) => ({ [note.n]: note.m });

describe.only('An Octaves Test Suite', () => {
	it('should map - chromatic', () => {
		const scale = new Scale('C', Scale.CHROMATIC, TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes));

		expect(octaves).toMatchSnapshot();
	});

	it('should map - natural', () => {
		const scale = new Scale('C', Scale.MAJOR, TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes));

		expect(octaves).toHaveLength(75);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - sharp', () => {
		const scale = new Scale('E', Scale.MAJOR, TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ 3, 2 ]));

		expect(octaves).toHaveLength(14);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - flat', () => {
		const scale = new Scale('Ab', Scale.MAJOR, TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ 4, 4 ]));

		expect(octaves).toHaveLength(28);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - pentatonic', () => {
		const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC, TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ -2 ]));

		expect(octaves).toHaveLength(5);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - major with flats', () => {
		const scale = new Scale('F', Scale.MAJOR, TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ -1 ], {
			type: Scale, hasFlats: true,
		}));

		expect(octaves).toHaveLength(7);
		expect(octaves).toMatchSnapshot();
	});

	it.only('should map 9m chord', () => {
		const chord = new Chord('Abm9', TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(chord.notes, [ 4 ], { type: 'chord' }));

		expect(octaves).toHaveLength(5);
		expect(octaves).toMatchSnapshot();
	});

	it('should map M13 chord', () => {
		const chord = new Chord('CM13', TYPE);
		const octaves = R.map(toNoteObj, assignOctaves(chord.notes, [ 4, 2 ], { type: 'chord' }));

		expect(octaves).toHaveLength(12);
		expect(octaves).toMatchSnapshot();
	});
});

