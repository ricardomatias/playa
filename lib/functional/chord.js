import memoize from 'fast-memoize';
import NoteType from '../core/types';
import Chord from '../core/Chord';
import { mapNotes } from '../utils/map';

/**
 * @param {String} key
 * @param {String} type chord type
 * @param {Array<Number>} octaves
 *
 * @return {Object} [str, midi, freq, notes]
 */
function chord(key, type, octaves) {
	let chord;

	if (typeof type === 'object') {
		octaves = type;
		chord = key;
	} else {
		chord = `${key}${type}`;
	}

	const chd = new Chord(chord, { noteType: NoteType.NOTE, octaves: octaves || [ 4, 1 ] });
	const notes = chd.notes;

	return {
		str: mapNotes(notes, NoteType.STR),
		midi: mapNotes(notes, NoteType.MIDI),
		freq: mapNotes(notes, NoteType.FREQ),
		notes,
	};
}

export default memoize(chord);