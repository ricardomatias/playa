import memoize from 'fast-memoize';
import NoteType from '../core/types';
import Scale from '../core/Scale';
import { mapNotes } from '../utils/map';

/**
 * @param {String} key
 * @param {String} type scale type
 * @param {Array<Number>} octaves
 *
 * @return {Object} [str, midi, freq, notes]
 */
function scale(key, type, octaves) {
	const scale = new Scale(key, type, { noteType: NoteType.NOTE, octaves: octaves || [ 4, 1 ] });
	const notes = scale.notes;

	return {
		str: mapNotes(notes, NoteType.STR),
		midi: mapNotes(notes, NoteType.MIDI),
		freq: mapNotes(notes, NoteType.FREQ),
		notes,
	};
}

export default memoize(scale);
