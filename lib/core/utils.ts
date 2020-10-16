import { ChordSymbol, ChordName, ChordDefinition } from '../constants/chords';
import { NoteSymbol } from '../constants/note';
import { PlayaError } from '../utils/error';
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
	const entries = (Object.entries(ChordSymbol) as [ChordName, ChordSymbol][]);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const name = entries.find(([ _, s ]) => (symbol === s))?.[0];

	if (typeof name === 'undefined') {
		throw new PlayaError('Chord', `[${chordName}] isn't a recognizable chord`);
	}

	return { ...ChordDefinition[name], root };
};
