import memoize from 'fast-memoize';
import NoteType from '../core/types';
import Scale from '../core/Scale';
import assignOctaves from '../utils/assignOctaves';
import { mapNotes } from '../utils/map';

/**
 * @param {String} key
 * @param {String} type scale type
 * @param {Array<Number>} octaves
 *
 * @return {Object} [str, midi, freq, notes]
 */
function scale(key, type, octaves) {
	const scale = new Scale(key, type, { noteType: NoteType.NOTE });
	const notes = scale.notes;
	const octaveNotes = assignOctaves(notes, octaves || [ 4, 2 ], { type: 'scale', hasFlats: scale.hasFlats });

	return {
		str: mapNotes(notes, NoteType.STR),
		midi: mapNotes(octaveNotes, NoteType.MIDI),
		freq: mapNotes(octaveNotes, NoteType.FREQ),
		notes: octaveNotes,
	};
}

export default memoize(scale);
