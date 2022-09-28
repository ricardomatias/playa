import * as R from 'ramda';
import { Note, NoteLike } from '../core/Note';
import { MidiNotes, NoteSymbol } from '../constants';
import { stripOctave } from '../utils/note';
import { isDefined, isUndefined } from '../utils/types-guards';
import type { Chord } from '../core/Chord';
import { NoteEvent } from '../core/NoteEvent';

/**
 * MIDI tools
 * @namespace Midi
 * @memberof Tools
 */

type NearestVoice = { voice: number; midi: number; distance: number };

/**
 * Find the nearest MIDI note to a given base midi note
 *
 * @function findNearest
 * @memberof Tools.Midi
 *
 * @param {Number} base
 * @param {NoteSymbol|string} note
 * @param {Number} [range=12] the range of notes to find the distance to
 * @example
 * const A = 69 // 'A3'
 * findNearest(A, 'C') => 72 // 'C4'
 *
 * @return {Number} midi note
 */
export const findNearest = (base: number, note: NoteSymbol | string, range = 12): number[] => {
	const n = new Note(note);

	const from = Math.max(base - range, 0);
	const to = Math.min(base + range, 127);

	const intervalNotes = R.slice(from, to + 1, MidiNotes);

	const realNote = n.isNatural || n.isSharp ? n.note : n.e;

	const filterByOctaves = (noteOctave: string) => stripOctave(noteOctave) === realNote;

	const noteByOcts = R.filter(filterByOctaves, intervalNotes).map((noteOct) => {
		return MidiNotes.indexOf(noteOct);
	});

	return R.sort((a, b) => Math.abs(base - a) - Math.abs(base - b), noteByOcts);
};

const findNearestVoice = (voices: number[], target: NoteSymbol, range = 12): NearestVoice[] =>
	R.sortBy(
		R.prop('distance'),
		voices
			.map((midi) => ({ voice: midi, midi: R.head(findNearest(midi, target, range)) }))
			.map(({ voice, midi = 0 }) => ({ voice, midi, distance: Math.abs(voice - midi) }))
	);

/**
 * Find the nearest chord or set of notes to a given base midi chord
 *
 * @function findNearestChord
 * @memberof Tools.Midi
 *
 * @param {Array<Number>} base origin chord voicing
 * @param {Array<String>} notes target chord notes
 * @param {boolean} [repeats = false] allow repeated notes or use other voicings
 * @param {boolean} [sort = false] sort midi notes ascending
 * @param {boolean} [keepBass = false] keep the lowest note as the lowest in the resulting chord
 * @example
 * [ 69, 72, 76 ] // [ 'A3', 'C4', 'E4' ]
 * findNearestChord([ 69, 72, 76 ], [ 'C', 'E', 'G' ]) => [ 67, 72, 76 ] // [ 'G3', 'C4', 'E4' ]
 *
 * @return {Array<Number>} midi note
 */
export const findNearestChord = (
	base: number[],
	notes: NoteSymbol[],
	{ repeats = false, sort = false, keepBass = false }: { repeats?: boolean; sort?: boolean; keepBass?: boolean } = {}
): number[] => {
	const chordNotes = notes;
	const voices = R.clone(base);
	const midiChord: number[] = [];
	let firstNote = -1;

	for (let targetIndex = 0; targetIndex < chordNotes.length; targetIndex++) {
		const target = chordNotes[targetIndex];

		if (!chordNotes.length) {
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
				if (targetIndex == 0) firstNote = nearest.midi;
				midiChord.push(nearest.midi);
			}
		} else {
			if (targetIndex == 0) firstNote = voice.midi;
			midiChord.push(voice.midi);
		}
	}

	if (sort) midiChord.sort((a, b) => a - b);

	if (keepBass && firstNote !== -1) {
		const first = midiChord[0];
		const target = chordNotes[0];

		if (new Note(first).note !== target) {
			midiChord.splice(midiChord.indexOf(firstNote), 1);

			const nearestVoices = findNearest(midiChord[0], target, 12);
			const lowest = nearestVoices.find((newVoice) => newVoice < midiChord[0]);

			if (lowest) midiChord.unshift(lowest);
		}
	}

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

const closestToEdge = (base: number[], midi: number, minDist: number) => {
	const a = new Note(midi).note;
	const first = base[0];
	const last = base[base.length - 1];

	const lowA = findNearest(first, a, 24);
	const highA = findNearest(last, a, 24);

	// excluse self after combining results
	const alternatives = R.uniq(lowA.concat(highA)).filter((note) => note !== midi);

	return R.sortBy(
		R.prop('distance'),
		alternatives.map((note) => ({ note, distance: Math.min(Math.abs(first - note), Math.abs(last - note)) }))
	).filter(({ distance }) => distance >= minDist);
};

export const spreadVoicing = (base: number[], minDist = 2): number[] => {
	if (base.length === 0) return [];

	const voices = R.clone(base);
	let i = 0;

	while (true) {
		const ma = voices[i];
		const mb = voices[i + 1];

		if (i + 1 > voices.length - 1) {
			break;
		}

		if (Math.abs(ma - mb) >= minDist) {
			i++;
			continue;
		}

		const resultsA = closestToEdge(voices, ma, minDist)[0];
		const resultsB = closestToEdge(voices, mb, minDist)[0];

		let result: number;

		if (resultsA.distance < resultsB.distance) {
			result = resultsA.note;
			voices.splice(voices.indexOf(ma), 1);
		} else {
			result = resultsB.note;
			voices.splice(voices.indexOf(mb), 1);
		}

		voices.push(result);

		voices.sort((a, b) => a - b);

		i = 0;
	}

	return voices;
};

export const transposeIfLower = (base: number[], note: NoteLike): number[] => {
	const n = new Note(note);
	const lowestNote = R.reduce(
		R.minBy((a: number) => a),
		Infinity,
		base
	);

	let amount = 0;

	while (n.m && lowestNote + amount < n.m) {
		amount += 12;
	}

	return R.map(R.add(amount), base);
};
