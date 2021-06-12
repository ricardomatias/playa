import { ChordSymbol, ChordName, ChordDefinition, ChordIntervals } from '../constants/chords';
import { NoteSymbol } from '../constants/note';
import { PlayaError } from '../utils/error';
import { ChordEvent } from './ChordEvent';
import { Note } from './Note';
import { NoteEvent } from './NoteEvent';
import { ChordDescriptor } from './Types';

/**
 * Deconstruct Chord from a String into a Object
 * @private
 *
 * @function deconstructName
 * @memberof Utils
 *
 * @param {String} chordName
 * @return {Object}
 */
export const deconstructName = (chordName: string): ChordDescriptor => {
	const reg = new RegExp(/(?:[A-G](#|b)?){0,2}/);

	const result = chordName.match(reg);

	if (!result) {
		throw new Error(`${chordName} does not exist`);
	}

	const root = result[0] as NoteSymbol;
	const symbol = chordName.replace(root, '') as ChordSymbol;
	const name = findNameFromSymbol(symbol);

	if (typeof name === 'undefined') {
		throw new PlayaError('Chord', `[${chordName}] isn't a recognizable chord`);
	}

	return { ...ChordDefinition[name], root };
};

export const findNameFromSymbol = (symbol: ChordSymbol): ChordName | undefined => {
	const entries = Object.entries(ChordSymbol) as [ChordName, ChordSymbol][];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return entries.find(([ _, s ]) => symbol === s)?.[0];
};

export const findNameFromIntervals = (intervals: ChordIntervals): ChordName | undefined => {
	const entries = Object.entries(ChordIntervals) as [ChordName, ChordIntervals][];

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return entries.find(([ _, s ]) => intervals === s)?.[0];
};

export const toNoteEvent = ({ time, dur, next, isRest, chord }: ChordEvent): NoteEvent[] => {
	return chord.map((midi) => NoteEvent({ time, next, isRest, note: new Note(midi).n, dur, midi }));
};
