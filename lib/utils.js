import memoize from 'fast-memoize';
import NoteType from './types';

const whichAccident = memoize((note) => {
	const exec = new RegExp('#|b').exec(note);

	return exec ? exec[0] : null;
});

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
 * @param {Array<Note>} notes
 * @param {NoteType} type
 * @return {Array<NoteType>} Notes mapped to a type
 */
const mapNotes = memoize((notes, type) => {
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
});

/**
 * @param {Array<Mode>} modes
 * @param {String} elemType
 * @return {Array<Scale|Chord>} Modes mapped to a type
 */
const mapModes = memoize((modes, elemType) => {
	switch (elemType) {
	case 'chord':
		return map(modes, `${elemType}.name`);
	case 'scale':
		return map(modes, `${elemType}.notes`);
	default:
		return modes;
	}
});

export {
	whichAccident,
	mapNotes,
	mapModes,
};
