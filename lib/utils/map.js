import NoteType from '../core/types';

const map = (list, prop) => {
	return list.map((elem) => {
		const nest = prop.split('.');
		let propValue = elem[nest[0]];

		for (let index = 1; index < nest.length; index++) {
			const nestedProp = nest[index];

			propValue = propValue[nestedProp];
		}

		return propValue;
	});
};

/**
 * Maps an array of notes into a specified type
 *
 *
 * @function mapNotes
 * @memberof Utils
 *
 * @param {Array<Note>} notes
 * @param {NoteType} type
 * @return {Array<NoteType>} Notes mapped to a type
 */
export const mapNotes = (notes, type) => {
	switch (type) {
	case NoteType.MIDI:
		return map(notes, 'm');
	case NoteType.FREQ:
		return map(notes, 'f');
	case NoteType.STR:
		return map(notes, 'n');
	default:
		return notes;
	}
};
