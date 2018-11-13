import Note from '../core/Note';
import ring from './ring';
import intervalTool from './interval';
import { SHARPS, FLATS, INTERVALS } from '../constants';


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

/**
 * Transpose a note by an interval
 *
 * @param {Note} note
 * @param {String} int interval
 * @example transpose(C, "P5") // => "G"
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const transpose = (note, int) => {
	note = assureNote(note);

	const semit = INTERVALS.get(int);

	if (!semit) {
		return null;
	}

	const ringedIntervals = note.isFlat() ? ring(FLATS) : ring(SHARPS);
	const posNote = position(note);

	return ringedIntervals[posNote + semit];
};

export default {
	position,
	semitones,
	interval,
	transpose,
};
