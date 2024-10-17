import { NoteSymbol } from '../constants/note';
import { Note, NoteLike } from '../core/Note';

export const ACCIDENT_REGEXP = /#|b/;
export const OCTAVE_REGEXP = /-?\d{1,}/;

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
export const stripOctave = (note: string): NoteSymbol => <NoteSymbol>note.replace(new RegExp(OCTAVE_REGEXP), '');

export const isPitch = (note: Exclude<NoteLike, Note | number>): boolean => new RegExp(OCTAVE_REGEXP).test(note);


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

//  * For middle C to be C3 -> 2
//  * For middle C to be C4 -> 1
const MIDI_OCTAVE_OFFSET = 2;

/**
 * Finds the octave based on the MIDI
 * @private
 * @param {Number} midi
 * @return {Number} An octave
 */
export const findOctave = (midi: number): number => {
	return Math.floor(11 * (midi / 132)) - MIDI_OCTAVE_OFFSET;
};

/**
 * Finds the C from which the octave is based
 * @private
 * @param {Number} midi
 * @return {Number} An octave
 */
export const findCMidiByOctave = (octave: number): number => {
	return 12 * octave + MIDI_OCTAVE_OFFSET * 12;
};

const TUNING = 440;

/**
 * Finds the octave based on the MIDI
 * @private
 * @param {Number} midi
 * @return {Number} An octave
 */
export const findFrequency = (midi: number): number => {
	return Math.pow(2, (midi - 69) / 12) * TUNING;
};
