import { Note, NoteLike } from '../core/Note';
import { DiatonicNotes, DiatonicNote } from '../constants';

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

	let posA = 0;
	let posB = noteB.midi - noteA.midi;

	if (posB > 21) {
		posB = 12 + (posB % 12);
	}

	if (Note.isNoteSymbol(a) && Note.isNoteSymbol(b)) {
		posA = Note.position(noteA);
		posB = Note.position(noteB);
	}

	return posB > posA ? posB - posA : 12 - (posA - posB);
};
