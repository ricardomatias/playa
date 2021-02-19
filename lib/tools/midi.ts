import * as R from 'ramda';
import { Note } from '../core/Note';
import { MidiNotes, NoteSymbol } from '../constants';
import { stripOctave } from '../utils/note';
import whilst from '../utils/whilst';
import { isUndefined } from '../utils/types-guards';

/**
 * MIDI tools
 * @namespace Midi
 * @memberof Tools
 */

/**
 * Find the nearest MIDI note
 *
 * @function findNearest
 * @memberof Tools.Midi
 *
 * @param {Number} base
 * @param {NoteSymbol|string} note
 * @example
 * const A = 69 // 'A3'
 * findNearest(A, 'C') => 72 // 'C4'
 *
 * @return {Number} midi note
 */
export const findNearest = (base: number, note: NoteSymbol | string): number | undefined => {
	const n = new Note(note);

	const from = Math.max(base - 12, 0);
	const to = Math.min(base + 12, 127);

	const intervalNotes = R.slice(from, to + 1, MidiNotes);

	const realNote = n.isNatural || n.isSharp ? n.note : n.e;

	const filterByOctaves = (noteOctave: string) => (stripOctave(noteOctave) === realNote);

	const noteByOcts = R.filter(filterByOctaves, intervalNotes).map((noteOct) => {
		return MidiNotes.indexOf(noteOct);
	});

	return R.head(R.sort((a, b) => (Math.abs(base - a) - Math.abs(base - b)), noteByOcts));
};

type Voice = {
	note: NoteSymbol | string,
	midiNote: number,
}

const findNearestVoice = R.curry((voices, baseVoice): { note: string, midiNote: number, distance: number }[] => (
	R.sortBy(R.prop('distance'),
		voices.map((note: string) => ({ note, midiNote: findNearest(baseVoice, note) }))
			.map(({ note, midiNote }: Voice) => ({ note, midiNote, distance: Math.abs(baseVoice - midiNote) })),
	)
));


/**
 * Find the nearest chord
 * @function findNearestChord
 * @memberof Tools.Midi
 *
 * @param {Array<Number>} baseChord
 * @param {Array<String>} chord
 * @example
 * const Am = [ 69, 72, 76 ] // [ 'A3', 'C4', 'E4' ]
 * findNearestChord(Am, [ 'C', 'E', 'G' ]) => [ 67, 72, 76 ] // [ 'G3', 'C4', 'E4' ]
 *
 * @return {Array<Number>} midi note
 */
export const findNearestChord = (baseChord: number[], chord: string[]): number[] => {
	// Check if there are any matches
	const voices = R.clone(baseChord);
	const nrOfActiveVoices = voices.length;
	let incVoices = R.clone(chord);

	const midiChord: number[] = [];

	for (let voiceIndex = 0; voiceIndex < nrOfActiveVoices; voiceIndex++) {
		const baseVoice = voices[voiceIndex];

		if (!incVoices.length) {
			break;
		}

		const nearestVoices = findNearestVoice(incVoices, baseVoice);

		const voice = R.head(nearestVoices);

		if (isUndefined(voice)) {
			continue;
		}

		midiChord.push(voice.midiNote);

		incVoices = R.reject(R.equals(voice.note), incVoices);
	}

	whilst(() => {
		const note = R.head(incVoices) as string;
		const edgeVoices = [ R.head(midiChord) as number, R.last(midiChord) as number ];

		const nearestVoices = R.sortBy(R.prop('distance'),
			edgeVoices.map((edgeNote) => ({ edgeNote, midiNote: findNearest(edgeNote, note) }))
				.map(({ edgeNote, midiNote }) => ({ midiNote, distance: Math.abs(edgeNote - <number>midiNote) })),
		);

		const voice = R.head(nearestVoices);

		if (isUndefined(voice)) {
			return;
		}

		midiChord.push(voice.midiNote as number);

		incVoices = R.reject(R.equals(note), incVoices);
	}, () => (incVoices.length));

	midiChord.sort((a, b) => a - b);

	return midiChord;
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

const TUNING = 440;

/**
 * Finds the octave based on the MIDI
 * @private
 * @param {Number} midi
 * @return {Number} An octave
 */
export const findFrequency = (midi: number): number => {
	return Math.pow(2, ((midi - 69) / 12)) * TUNING;
};
