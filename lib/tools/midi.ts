import * as R from 'ramda';
import { Note } from '../core/Note';
import { MidiNotes, NoteSymbol } from '../constants';
import { stripOctave } from '../utils/note';
import { isDefined, isUndefined } from '../utils/types-guards';
import { NoteEvent } from '../core';

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

	const filterByOctaves = (noteOctave: string) => stripOctave(noteOctave) === realNote;

	const noteByOcts = R.filter(filterByOctaves, intervalNotes).map((noteOct) => {
		return MidiNotes.indexOf(noteOct);
	});

	return R.head(R.sort((a, b) => Math.abs(base - a) - Math.abs(base - b), noteByOcts));
};

type NearestVoice = { voice: number; midi: number; distance: number };

const findNearestVoice = (voices: number[], target: NoteSymbol): NearestVoice[] =>
	R.sortBy(
		R.prop('distance'),
		voices
			.map((midi) => ({ voice: midi, midi: findNearest(midi, target) }))
			.map(({ voice, midi = 0 }) => ({ voice, midi, distance: Math.abs(voice - midi) }))
	);

/**
 * Find the nearest chord
 * @function findNearestChord
 * @memberof Tools.Midi
 *
 * @param {Array<Number>} base chord voicing
 * @param {Array<String>} chord target chord notes
 * @param {boolean} [repeats = false] allow repeated notes or use other voicings
 * @param {boolean} [sort = false] sort midi notes ascending
 * @example
 * [ 69, 72, 76 ] // [ 'A3', 'C4', 'E4' ]
 * findNearestChord([ 69, 72, 76 ], [ 'C', 'E', 'G' ]) => [ 67, 72, 76 ] // [ 'G3', 'C4', 'E4' ]
 *
 * @return {Array<Number>} midi note
 */
export const findNearestChord = (
	base: number[],
	chord: NoteSymbol[],
	{ repeats = false, sort = false }: { repeats?: boolean; sort?: boolean } = {}
): number[] => {
	const voices = R.clone(base);
	const midiChord: number[] = [];

	for (let targetIndex = 0; targetIndex < chord.length; targetIndex++) {
		const target = chord[targetIndex];

		if (!chord.length) {
			break;
		}

		const nearestVoices = findNearestVoice(voices, target);
		const voice = R.head(nearestVoices);

		if (isUndefined(voice)) {
			continue;
		}

		if (midiChord.includes(voice.midi) && !repeats) {
			const nearest = nearestVoices.find((newVoice) => newVoice.midi !== voice.midi);

			if (isDefined(nearest)) {
				midiChord.push(nearest.midi);
			}
		} else {
			midiChord.push(voice.midi);
		}
	}

	if (sort) midiChord.sort((a, b) => a - b);

	return midiChord;
};

/**
 * Find the nearest chord
 * @function findNearestVoicings
 * @memberof Tools.Midi
 *
 * @param {Array<NoteEvent>} base note events taken as base voicings
 * @param {Array<NoteEvent>} progression target events
 *
 * @return {Array<NoteEvent>} progression with different voicings
 */
export const findNearestVoicings = (base: NoteEvent[], sequence: NoteEvent[]): NoteEvent[] => {
	const baseNotes = base.map((event) => event.midi);
	const notes = sequence.map((event) => new Note(event.midi).note);

	const nearestVoicings = findNearestChord(baseNotes, notes, { repeats: true });

	return nearestVoicings.map((midi, index) => {
		const event = sequence[index];

		event.midi = midi;
		event.note = new Note(midi).pitch;

		return event;
	});
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
	return Math.pow(2, (midi - 69) / 12) * TUNING;
};
