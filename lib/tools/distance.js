import Note from '../core/Note';
import ring from './ring';
import intervalTool from './interval';
import { SHARPS, FLATS, INTERVALS, DIATONIC_NOTES } from '../constants';
import { natural } from '../utils/note';


const assureNote = (note) => (note instanceof Note ? note : new Note(note));

/**
 * Position in the chromatic scale from C
 *
 * @param {Note} note
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const position = (note) => (
	note.isFlat() ? FLATS.indexOf(note.n) : SHARPS.indexOf(note.n)
);

/**
 * Distance of 2 notes in semitones
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
	let transposedNote;
	let transposedNatural;
	let interval;
	let diatonicInterval;

	const semit = INTERVALS.get(int);
	const diatonicSemit = int.replace(/\D/, '') - 1;

	if (!semit) {
		return null;
	}

	const ringedIntervals = new Note(note).isFlat() ? ring(FLATS) : ring(SHARPS);
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

	transposedNote = new Note(ringedIntervals[interval]);
	transposedNatural = ring(DIATONIC_NOTES)[diatonicInterval];

	if (!transposedNote.isNatural() && natural(transposedNote.n) !== transposedNatural) {
		return transposedNote.e;
	}

	return transposedNote.n;
};

/**
 * Transpose a note by an interval
 *
 * @param {Note} note
 * @param {String} int interval
 * @example transpose(C, "5P") // => "G"
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const transposeUp = (note, int) => (transpose(note, int, 'add'));


/**
 * Transpose a note by an interval
 *
 * @param {Note} note
 * @param {String} int interval
 * @example transposeDown(C, "5P") // => "F"
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const transposeDown = (note, int) => (transpose(note, int, 'subtract'));

export default {
	position,
	semitones,
	interval,
	transposeUp,
	transposeDown,
};
