import memoize from 'fast-memoize';
import NoteType from '../core/types';
import Chord from '../core/Chord';
import { mapNotes } from '../utils/map';

/**
 * @param {String} chord
 * @param {Array<Number>} octaves
 *
 * @return {Object} [str, midi, freq, notes]
 */
function chord(chord, octaves = [ 4, 1 ]) {
	const chd = new Chord(chord, { noteType: NoteType.NOTE, octaves });
	const notes = chd.notes;

	return {
		str: mapNotes(notes, NoteType.STR),
		midi: mapNotes(notes, NoteType.MIDI),
		freq: mapNotes(notes, NoteType.FREQ),
		notes,
	};
}

export default memoize(chord);
