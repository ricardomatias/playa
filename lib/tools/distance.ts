import * as R from 'ramda';
import { Note, NoteLike } from '../core/Note';
import ring from '@ricardomatias/ring';
import { fromSemitones as getInterval } from './interval';
import { Sharps, Flats, Semitones, DiatonicNotes, DiatonicNote, NoteSymbol, Interval, Sharp, Flat } from '../constants';
import { isDefined, isNotNull } from '../utils/types-guards';

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
	const n = new Note(note);

	return n.isFlat ? Flats.indexOf(n.note as Flat) : Sharps.indexOf(n.note as Sharp);
};

/**
 * Position in the {@link DiatonicNotes}
 * @function naturalPosition
 * @memberof Tools.Distance
 *
 * @param {Note | NoteSymbol | string} noteA
 * @param {Note | NoteSymbol | string} noteB
 * @return {number}
 */
const naturalPosition = (noteA: NoteLike, noteB: NoteLike): number => {
	const natNoteA = Note.stripAccidental(noteA) as DiatonicNote;
	const natNoteB = Note.stripAccidental(noteB) as DiatonicNote;

	const posA = DiatonicNotes.indexOf(natNoteA);
	const posB = DiatonicNotes.indexOf(natNoteB);

	return posB > posA ? posB - posA + 1 : 8 - (posA - posB);
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
	const noteA = new Note(a);
	const noteB = new Note(b);

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
	const noteA = new Note(a);
	const noteB = new Note(b);

	const semit = semitones(noteA, noteB);
	const intervals = getInterval(semit);

	if (isNotNull(intervals)) {
		if (intervals.length > 1) {
			const natSemit = naturalPosition(noteA, noteB);

			return intervals.find(R.includes(`${natSemit}`)) || intervals[0];
		} else {
			return intervals[0];
		}
	} else {
		return null;
	}
};

const transpose = (note: NoteLike, int: Interval, operation: 'add' | 'subtract'): NoteSymbol => {
	const naturalNote = <DiatonicNote>Note.stripAccidental(note);
	let interval = -1;
	let diatonicInterval = -1;

	const semit = Semitones[int];
	const diatonicSemit = parseInt(int.replace(/\D/, ''), 10) - 1;

	if (!semit) {
		return new Note(note).note;
	}

	const n = new Note(note);

	const ringedIntervals = n.isFlat ? ring(Array.from(Flats)) : ring(Array.from(Sharps));
	const posNote = position(n.note);
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

	if (
		!transposedNote.isNatural &&
		Note.stripAccidental(transposedNote.note) !== transposedNatural &&
		isDefined(transposedNote.enharmonic)
	) {
		return transposedNote.enharmonic;
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
const transposeUp = (note: NoteLike, int: Interval): NoteSymbol => transpose(note, int, 'add');

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
const transposeDown = (note: NoteLike, int: Interval): NoteSymbol => transpose(note, int, 'subtract');

export default {
	position,
	naturalPosition,
	semitones,
	interval,
	transposeUp,
	transposeDown,
};
