import Note from '../core/Note';
import ring from '@ricardomatias/ring';
import intervalTool from './interval';
import { SHARPS, FLATS, INTERVALS, DIATONIC_NOTES } from '../constants';
import { natural } from '../utils/note';


const assureNote = (note) => (note instanceof Note ? note : new Note(note));

/**
 * Note distance functions
 * @namespace Distance
 * @memberof Tools
 */

/**
 * Position in the chromatic scale from C
 * @function position
 * @memberof Tools.Distance
 *
 * @param {Note} note
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const position = (note) => (
	note.isFlat ? FLATS.indexOf(note.note) : SHARPS.indexOf(note.note)
);

/**
 * Distance of 2 notes in semitones
 * @function semitones
 * @memberof Tools.Distance
 *
 * @param {Note} a
 * @param {Note} b
 * @example semitones(C, D) // => 2
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const semitones = (a, b) => {
	a = assureNote(a);
	b = assureNote(b);

	const posA = position(a);
	const posB = position(b);

	return posB > posA ? posB - posA : 12 - (posA - posB);
};

/**
 * Get the interval between 2 notes
 * @function interval
 * @memberof Tools.Distance
 *
 * @param {Note} a
 * @param {Note} b
 * @example interval(C, G) // => "5P"
 * @return {String|null} The interval between 2 notes
 */
const interval = (a, b) => {
	a = assureNote(a);
	b = assureNote(b);

	return intervalTool(semitones(a, b))[0];
};

const transpose = (note, int, operation) => {
	const naturalNote = natural(note);
	let interval;
	let diatonicInterval;

	const semit = INTERVALS.get(int);
	const diatonicSemit = int.replace(/\D/, '') - 1;

	if (!semit) {
		return assureNote(note).note;
	}

	const ringedIntervals = new Note(note).isFlat ? ring(FLATS) : ring(SHARPS);
	const posNote = position(assureNote(note));
	const posNaturalNote = DIATONIC_NOTES.indexOf(naturalNote);

	if (operation === 'add') {
		interval = posNote + semit;
		diatonicInterval = posNaturalNote + diatonicSemit;
	}

	if (operation === 'subtract') {
		interval = posNote - semit;
		diatonicInterval = posNaturalNote - diatonicSemit;
	}

	const transposedNote = new Note(ringedIntervals[interval]);
	const transposedNatural = ring(DIATONIC_NOTES)[diatonicInterval];

	if (!transposedNote.isNatural && natural(transposedNote.note) !== transposedNatural) {
		return transposedNote.e;
	}

	return transposedNote.note;
};

/**
 * Transpose a note by an interval
 * @function transposeUp
 * @memberof Tools.Distance
 *
 * @param {Note | string} note
 * @param {String} int interval
 * @example transpose(C, "5P") // => "G"
 * @return {String|null} How many semitones are they apart or null if not possible
 */
const transposeUp = (note, int) => (transpose(note, int, 'add'));


/**
 * Transpose a note by an interval
 * @function transposeDown
 * @memberof Tools.Distance
 *
 * @param {Note} note
 * @param {String} int interval
 * @example transposeDown(C, "5P") // => "F"
 * @return {String|null} How many semitones are they apart or null if not possible
 */
const transposeDown = (note, int) => (transpose(note, int, 'subtract'));

export default {
	position,
	semitones,
	interval,
	transposeUp,
	transposeDown,
};
