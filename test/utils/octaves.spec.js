import * as R from 'ramda';
import assignOctaves from '../../lib/utils/octaves';
import { Scale, Chord } from '../../lib/core';
import NoteType from '../../lib/core/types';

const TYPE = { noteType: NoteType.NOTE };

describe('An Octaves Test Suite', () => {
	it('should map - chromatic', () => {
		const scale = new Scale('C', Scale.CHROMATIC, TYPE);
		const octaves = R.map((note) => ({ [note.n]: note.m }), assignOctaves(scale.notes));

		expect(octaves).toMatchSnapshot();
	});

	it('should map - natural', () => {
		const scale = new Scale('C', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes);

		expect(octaves).toMatchSnapshot();
		expect(octaves).toHaveLength(75);
	});

	it('should map - sharp', () => {
		const scale = new Scale('E', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes, [ 3, 2 ]);

		expect(octaves).toMatchSnapshot();
		expect(octaves).toHaveLength(15);
	});

	it('should map - flat', () => {
		const scale = new Scale('Ab', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes, [ 4, 4 ]);

		expect(octaves).toMatchSnapshot();
		expect(octaves).toHaveLength(29);
	});

	it('should map - pentatonic', () => {
		const scale = new Scale('Eb', Scale.MAJOR_PENTATONIC, TYPE);
		const octaves = assignOctaves(scale.notes, [ -1 ]);

		expect(octaves).toMatchSnapshot();
		expect(octaves).toHaveLength(6);
	});

	it('should map - major with flats', () => {
		const scale = new Scale('F', Scale.MAJOR, TYPE);
		const octaves = assignOctaves(scale.notes, [ -1 ], { type: Scale, hasFlats: true });

		expect(octaves).toMatchSnapshot();
		expect(octaves).toHaveLength(8);
	});

	it('should map 9m chord', () => {
		const chord = new Chord('Abm9', TYPE);
		const octaves = assignOctaves(chord.notes, [ 4 ], { type: 'chord' });

		expect(octaves).toMatchSnapshot();
		expect(octaves).toHaveLength(5);
	});

	it('should map M13 chord', () => {
		const chord = new Chord('CM13', TYPE);
		const octaves = assignOctaves(chord.notes, [ 4, 2 ], { type: 'chord' });

		expect(octaves).toMatchSnapshot();
		expect(octaves).toHaveLength(12);
	});
});

