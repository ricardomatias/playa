import * as R from 'ramda';
import assignOctaves from '../../lib/utils/octaves';
import { Scale, Chord } from '../../lib/core';

const toNoteObj = (note) => ({ [note.n]: note.m });

describe('An Octaves Test Suite', () => {
	it('should map - chromatic', () => {
		const scale = new Scale('C', Scale.CHROMATIC);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes));

		expect(octaves).toMatchSnapshot();
	});

	it('should map - natural', () => {
		const scale = new Scale('C', Scale.MAJOR);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes));

		expect(octaves).toHaveLength(75);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - sharp', () => {
		const scale = new Scale('E', Scale.MAJOR);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ 3, 2 ]));

		expect(octaves).toHaveLength(14);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - flat', () => {
		const scale = new Scale('Ab', Scale.MAJOR);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ 4, 4 ]));

		expect(octaves).toHaveLength(28);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - pentatonic', () => {
		const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ -2 ]));

		expect(octaves).toHaveLength(5);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - major with flats', () => {
		const scale = new Scale('F', Scale.MAJOR);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ -1 ], {
			type: Scale, hasFlats: true,
		}));

		expect(octaves).toHaveLength(7);
		expect(octaves).toMatchSnapshot();
	});

	it('should map 9m chord', () => {
		const chord = new Chord('Abm9');
		const octaves = R.map(toNoteObj, assignOctaves(chord.notes, [ 4 ], { type: 'chord' }));

		expect(octaves).toHaveLength(5);
		expect(octaves).toMatchSnapshot();
	});

	it('should map M13 chord', () => {
		const chord = new Chord('CM13');
		const octaves = R.map(toNoteObj, assignOctaves(chord.notes, [ 4, 2 ], { type: 'chord' }));

		expect(octaves).toHaveLength(12);
		expect(octaves).toMatchSnapshot();
	});
});

