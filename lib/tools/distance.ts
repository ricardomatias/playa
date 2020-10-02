import { Note } from '../core/Note';
import ring from '@ricardomatias/ring';
import { interval as getInterval } from './interval';
import { Sharps, Flats, Semitones, DiatonicNotes, DiatonicNote, NoteSymbol, Interval, Sharp, Flat } from '../constants';
import { natural } from '../utils/note';
import { isDefined, isNotNull } from '../utils/types-guards';


type NoteLike = Note | NoteSymbol | string;

const assureNote = (note: NoteLike): Note => (note instanceof Note ? note : new Note(note));

/**
 * Note distance functions
 * @namespace Distance
 * @memberof Tools
 */

/**
 * Position in the {@link Flats} or {@link Sharps} collection
 * @function position
 * @memberof Tools.Distance
 *
 * @param {Note} note
 * @return {number}
 */
const position = (note: NoteLike): number => {
	const n = assureNote(note);

	return (
		n.isFlat ? Flats.indexOf(n.note as Flat) : Sharps.indexOf(n.note as Sharp)
	);
};

/**
 * Distance of 2 notes in semitones
 * @function semitones
 * @memberof Tools.Distance
 *
 * @param {Note | NoteSymbol | string} a
 * @param {Note | NoteSymbol | string} b
 * @example semitones(C, D) // => 2
 * @return {number} How many semitones are they apart
 */
const semitones = (a: NoteLike, b: NoteLike): number => {
	const noteA = assureNote(a);
	const noteB = assureNote(b);

	const posA = position(noteA);
	const posB = position(noteB);

	return posB > posA ? posB - posA : 12 - (posA - posB);
};

/**
 * Get the interval between 2 notes
 * @function interval
 * @memberof Tools.Distance
 *
 * @param {Note | NoteSymbol | string} a
 * @param {Note | NoteSymbol | string} b
 * @example interval(C, G) // => "5P"
 * @return {Interval|null} The interval between 2 notes
 */
const interval = (a: NoteLike, b: NoteLike): Interval | null => {
	const noteA = assureNote(a);
	const noteB = assureNote(b);

	const semit = getInterval(semitones(noteA, noteB));

	return isNotNull(semit) ? semit[0] : null;
};


const transpose = (note: NoteLike, int: Interval, operation: 'add' | 'subtract'): NoteSymbol => {
	const naturalNote = <DiatonicNote>natural(note);
	let interval = -1;
	let diatonicInterval = -1;

	const semit = Semitones[int];
	const diatonicSemit = parseInt(int.replace(/\D/, ''), 10) - 1;

	if (!semit) {
		return assureNote(note).note;
	}

	const n = assureNote(note);

	const ringedIntervals = n.isFlat ? ring(Array.from(Flats)) : ring(Array.from(Sharps));
	const posNote = position(assureNote(note));
	const posNaturalNote = DiatonicNotes.indexOf(naturalNote);

	if (operation === 'add') {
		interval = posNote + semit;
		diatonicInterval = posNaturalNote + diatonicSemit;
	}

	if (operation === 'subtract') {
		interval = posNote - semit;
		diatonicInterval = posNaturalNote - diatonicSemit;
	}

	const transposedNote = new Note(ringedIntervals[interval]);
	const transposedNatural = ring(Array.from(DiatonicNotes))[diatonicInterval];

	if (!transposedNote.isNatural && natural(transposedNote.note) !== transposedNatural && isDefined(transposedNote.e)) {
		return transposedNote.e;
	}

	return transposedNote.note;
};

/**
 * Transpose a note by an interval
 * @function transposeUp
 * @memberof Tools.Distance
 *
 * @param {Note | NoteSymbol | string} note
 * @param {String} int interval
 * @example transpose(C, "5P") // => "G"
 * @return {String} How many semitones are they apart
 */
const transposeUp = (note: NoteLike, int: Interval): NoteSymbol => (transpose(note, int, 'add'));


/**
 * Transpose a note by an interval
 * @function transposeDown
 * @memberof Tools.Distance
 *
 * @param {Note | NoteSymbol | string} note
 * @param {String} int interval
 * @example transposeDown(C, "5P") // => "F"
 * @return {String} How many semitones are they apart
 */
const transposeDown = (note: NoteLike, int: Interval): NoteSymbol => (transpose(note, int, 'subtract'));

export default {
	position,
	semitones,
	interval,
	transposeUp,
	transposeDown,
};
