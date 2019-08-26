import * as R from 'ramda';
import Note from '../core/Note';
import { MIDI_NOTES } from '../constants';
import { stripOctave, whilst } from '../utils';

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
 * @param {String} note
 *
 * @return {Number} midi note
 */
export const findNearest = (base, note) => {
	note = new Note(note);

	const from = Math.max(base - 12, 0);
	const to = Math.min(base + 12, 127);

	const intervalNotes = R.slice(from, to + 1, MIDI_NOTES);

	const realNote = note.isNatural || note.isSharp ? note.note : note.e;

	const filterByOctaves = (noteOctave) => (stripOctave(noteOctave) === realNote);

	const noteByOcts = R.filter(filterByOctaves, intervalNotes).map((noteOct) => {
		return MIDI_NOTES.indexOf(noteOct);
	});

	return R.head(R.sort((a, b) => (Math.abs(base - a) - Math.abs(base - b)), noteByOcts));
};

const findNearestVoice = R.curry((voices, baseVoice) => (
	R.sortBy(R.prop('distance'),
		voices.map((note) => ({ note, midiNote: findNearest(baseVoice, note) }))
			.map(({ note, midiNote }) => ({ note, midiNote, distance: Math.abs(baseVoice - midiNote) }))
	)
));


/**
 * Find the nearest chord
 * @function findNearest
 * @memberof Tools.Midi
 *
 * @param {Array<Number>} baseChord
 * @param {Array<String>} chord
 * @param {Boolean} hasFlats
 *
 * @return {Array<Number>} midi note
 */
export const findNearestChord = (baseChord, chord, hasFlats) => {
	// Check if there are any matches
	const voices = R.clone(baseChord);
	const nrOfActiveVoices = voices.length;
	let incVoices = R.clone(chord);

	const midiChord = [];

	for (let voiceIndex = 0; voiceIndex < nrOfActiveVoices; voiceIndex++) {
		const baseVoice = voices[voiceIndex];

		if (!incVoices.length) {
			break;
		}

		const nearestVoices = findNearestVoice(incVoices, baseVoice);

		const voice = R.head(nearestVoices);

		midiChord.push(voice.midiNote);

		incVoices = R.reject(R.equals(voice.note), incVoices);
	}

	whilst(() => {
		const note = R.head(incVoices);
		const edgeVoices = [ R.head(midiChord), R.last(midiChord) ];

		const nearestVoices = R.sortBy(R.prop('distance'),
			edgeVoices.map((edgeNote) => ({ edgeNote, midiNote: findNearest(edgeNote, note) }))
				.map(({ edgeNote, midiNote }) => ({ midiNote, distance: Math.abs(edgeNote - midiNote) }))
		);

		const voice = R.head(nearestVoices);

		midiChord.push(voice.midiNote);

		incVoices = R.reject(R.equals(note), incVoices);
	}, () => (incVoices.length));

	midiChord.sort((a, b) => a - b);

	return midiChord;
};
