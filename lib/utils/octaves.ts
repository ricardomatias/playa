import { Note } from '../core/Note';
import { CoreClassType } from '../core/Types';
import { Octaves } from '../common/types';
import { findBaseMidiByOctave } from './note';
import { distance } from '../tools';

interface AssignOctavesOpts {
	type: CoreClassType;
	hasFlats: boolean;
}

/**
 * Assign octaves to the notes passed
 * @private
 *
 * @function assignOctaves
 * @memberof Utils
 *
 * @param {Array<Scale|Chord>} notes
 * @param {Array<Number>} octaves which octaves to map to
 * @param {Object} opts
 * @param {'scale'|'chord'} opts.type which type of the notes array is it
 * @param {boolean} opts.hasFlats if the notes should be flats or sharps
 * @example
 * 		assignOctaves(scale.notes, [ 3, 2 ])
 * 		assignOctaves(chord.notes, [ 4, 2 ], 'chord')
 *
 * @return {Array<Note>} Array of the Key notes mapped to octaves
 */
const assignOctaves = (
	notes: Note[],
	octaves: Octaves = [-2, 11],
	{ hasFlats = false }: Partial<AssignOctavesOpts> = {}
): Note[] => {
	const [firstOct, numOctaves = 1] = octaves;

	const root = notes[0];
	const map: Note[] = [];

	let pointer = findBaseMidiByOctave(firstOct);

	for (let i = 0; i < numOctaves; i++) {
		const oct = firstOct + i;
		const baseOct = i === 0 ? pointer : findBaseMidiByOctave(oct);
		const base = baseOct + root.distC;

		notes.forEach((note, j) => {
			let midi = j === 0 ? base : base + distance.semitones(root, note);

			while (midi < pointer) {
				midi += 12;
			}

			if (midi > 127) return false;

			const newNote = root.isFlat || hasFlats ? new Note(midi).toEnharmonic() : new Note(midi);

			map.push(newNote);

			pointer = midi;
		});
	}
	return map;
};

export default assignOctaves;
