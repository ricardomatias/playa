import { DiatonicNote, NoteSymbol } from '../constants';
import { Note, NoteLike } from '../core/Note';

const ACCIDENT_REGEXP = new RegExp('#|b');
const OCTAVE_REGEXP = /-?\d{1,}/;

/**
 * Returns a note's accidental [# | b]
 * @private
 *
 *
 * @function whichAccident
 * @memberof Utils
 *
 * @param {String} note
 * @return {String}
 */
export const whichAccident = (note: string): string | undefined => {
	const exec = ACCIDENT_REGEXP.exec(note);

	return exec ? exec[0] : undefined;
};

/**
 * Returns a note without the accidental
 * @private
 *
 * @function natural
 * @memberof Utils
 *
 * @param {String|Note} note
 * @return {String} Natural note
 */
export const natural = (note: NoteLike): DiatonicNote | null => {
	if (!note) return null;

	const n = assureNote(note);

	return <DiatonicNote>n.note.replace(ACCIDENT_REGEXP, '');
};

/**
 * Strips the octave from the note
 *
 * @private
 *
 * @function stripOctave
 * @memberof Utils
 *
 * @param {String} note
 * @return {String} Natural note
 */
export const stripOctave = (note: string): NoteSymbol => <NoteSymbol>(note.replace(new RegExp(OCTAVE_REGEXP), ''));

export const hasOctave = (note: string): boolean => (new RegExp(OCTAVE_REGEXP).test(note));

interface ParsedNote {
	note: NoteSymbol;
	octave: number;
}

export const parseNote = (note: string): ParsedNote | null => {
	const result = note.match(/([^0-9-]*)(-?\d*)/);

	if (!result) {
		return null;
	}

	return {
		note: <NoteSymbol>result[1],
		octave: parseInt(result[2], 10),
	};
};

export const assureNote = (note: Note | string | number | NoteSymbol): Note => (note instanceof Note ? note : new Note(note));
