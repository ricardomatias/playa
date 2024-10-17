import { Note } from '../core/Note';
import { Octaves } from '../common/types';
import { findCMidiByOctave } from './note';
import { semitones } from '../tools/distance';

/**
 * Assign octaves to the notes passed
 * @private
 *
 * @function assignOctaves
 * @memberof Utils
 *
 * @param {Array<Scale|Chord>} notes
 * @param {Array<Number>} octaves which octaves to map to
 * @example
 * 		assignOctaves(scale.notes, [ 3, 2 ])
 * 		assignOctaves(chord.notes, [ 4, 2 ])
 *
 * @return {Array<Note>} Array of the Key notes mapped to octaves
 */
const assignOctaves = (notes: Note[], octaves: Octaves = [-2, 11]): Note[] => {
	const [firstOct, numOctaves = 1] = octaves;

	const root = notes[0];
	const map: Note[] = [];

	let pointer = findCMidiByOctave(firstOct);

	for (let i = 0; i < numOctaves; i++) {
		const oct = firstOct + i;
		const baseOct = i === 0 ? pointer : findCMidiByOctave(oct);
		const base = baseOct + root.distC;

		notes.forEach((note, j) => {
			let midi = j === 0 ? base : base + semitones(root.note, note.note);

			while (midi < pointer) {
				midi += 12;
			}

			if (midi > 127) return false;

			let newNote = new Note(midi);

			if (note.isFlat !== newNote.isFlat || note.isSharp !== newNote.isSharp) {
				newNote = newNote.toEnharmonic();
			}

			map.push(newNote);

			pointer = midi;
		});
	}
	return map;
};

export default assignOctaves;
