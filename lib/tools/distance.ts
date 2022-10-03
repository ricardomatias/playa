import * as R from 'ramda';
import { Note, NoteLike } from '../core/Note';
import { fromSemitones as getInterval } from './interval';
import { DiatonicNotes, DiatonicNote, Interval } from '../constants';
import { isNotNull } from '../utils/types-guards';

/**
 * Note distance functions
 * @namespace Distance
 * @memberof Tools
 */

/**
 * Position in the {@link DiatonicNotes}
 * @function naturalPosition
 * @memberof Tools.Distance
 *
 * @param {Note | NoteSymbol | string} noteA
 * @param {Note | NoteSymbol | string} noteB
 * @return {number}
 */
export const naturalPosition = (noteA: NoteLike, noteB: NoteLike): number => {
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
export const semitones = (a: NoteLike, b: NoteLike): number => {
	const noteA = new Note(a);
	const noteB = new Note(b);

	const posA = Note.position(noteA);
	const posB = Note.position(noteB);

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
export const interval = (a: NoteLike, b: NoteLike): Interval | null => {
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
