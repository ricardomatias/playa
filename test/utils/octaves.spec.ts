import * as R from 'ramda';
import assignOctaves from '../../lib/utils/octaves';
import { Scale, Chord, Note } from '../../lib/core';

const toNoteObj = (note: Note) => ({ [note.n]: note.m });

describe('An Octaves Test Suite', () => {
	it('should map - chromatic', () => {
		const scale = new Scale('C', Scale.Intervals.Chromatic);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes));

		expect(octaves).toMatchSnapshot();
	});

	it('should map - natural', () => {
		const scale = new Scale('C', Scale.Major);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes));

		expect(octaves).toHaveLength(75);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - sharp', () => {
		const scale = new Scale('E', Scale.Major);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ 3, 2 ]));

		expect(octaves).toHaveLength(14);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - flat', () => {
		const scale = new Scale('Ab', Scale.Major);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ 4, 4 ]));

		expect(octaves).toHaveLength(28);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - pentatonic', () => {
		const scale = new Scale('Eb', Scale.Intervals.MajorPentatonic);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ -2, 1 ]));

		expect(octaves).toHaveLength(5);
		expect(octaves).toMatchSnapshot();
	});

	it('should map - major with flats', () => {
		const scale = new Scale('F', Scale.Major);
		const octaves = R.map(toNoteObj, assignOctaves(scale.notes, [ -1, 1 ], {
			type: 'scale', hasFlats: true,
		}));

		expect(octaves).toHaveLength(7);
		expect(octaves).toMatchSnapshot();
	});

	it('should map 9m chord', () => {
		const chord = Chord.fromName('Abm9');
		const octaves = R.map(toNoteObj, assignOctaves(chord.notes, [ 4, 1 ], { type: 'chord' }));

		expect(octaves).toHaveLength(5);
		expect(octaves).toMatchSnapshot();
	});

	it('should map M13 chord', () => {
		const chord = Chord.fromName('CM13');
		const octaves = R.map(toNoteObj, assignOctaves(chord.notes, [ 4, 2 ], { type: 'chord' }));

		expect(octaves).toHaveLength(12);
		expect(octaves).toMatchSnapshot();
	});
});

