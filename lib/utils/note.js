const ACCIDENT_REGEXP = new RegExp('#|b');
const OCTAVE_REGEXP = /-?\d{1,}/;

/**
 * Returns a note's accidental [# | b]
 *
 * @function whichAccident
 * @memberof Utils
 *
 * @param {String} note
 * @return {String}
 */
export const whichAccident = (note) => {
	const exec = ACCIDENT_REGEXP.exec(note);

	return exec ? exec[0] : null;
};

/**
 * Returns a note without the accidental
 * @function natural
 * @memberof Utils
 *
 * @param {String|Note} note
 * @return {String} Natural note
 */
export const natural = (note) => {
	if (typeof note !== 'string') {
		return note.note.replace(ACCIDENT_REGEXP, '');
	}

	return note.replace(ACCIDENT_REGEXP, '');
};

/**
 * Strips the octave from the note
 *
 * @function stripOctave
 * @memberof Utils
 *
 * @param {String} note
 * @return {String} Natural note
 */
export const stripOctave = (note) => (note.replace(new RegExp(OCTAVE_REGEXP), ''));

export const hasOctave = (note) => (new RegExp(OCTAVE_REGEXP).test(note));


export const parseNote = (note) => {
	const result = note.match(/([^0-9-]*)(-?\d*)/);

	return {
		note: result[1],
		octave: result[2],
	};
};
