import * as R from 'ramda';
import { choose } from '../tools';
import { TICKS } from '../constants';

/**
 * typedef {Object} Motif
 * @property {String} time when it's playing in Ticks
 * @property {String} dur in note value
 * @property {String} note the note
 * @property {Number} midi midi value
 */
class Motif {} /* eslint no-unused-vars: 0 */


export const calcDuration = (motif) => {
	const last = R.last(motif);

	return R.prop('time', last) + TICKS.get(R.prop('dur', last));
};

/**
 * Creates a timeline by assigning the duration to each event's time
 * @example mapDurations(pattern) =>
 * [ { time: 0, note: 'A4', midi: 69, dur: '8t' },
    { time: '64i', note: 'C#5', midi: 73, dur: '4n.' },
    { time: '352i', note: 'C#5', midi: 73, dur: '4n.' },
    { time: '640i', note: 'B4', midi: 71, dur: '8t' },
    { time: '704i', note: 'C#5', midi: 73, dur: '8t' } ]
 * @param {Array<Motif>} pattern
 * @return {Array<Motif>} pattern
 */
export const mapDurations = (pattern) => (pattern.map((event, index) => {
	if (!index) {
		event.time = event.time === 0 ? 0 : event.time;

		return event;
	}

	const prevEvent = pattern[index - 1] ? pattern[index - 1] : null;

	const prevTime = prevEvent ? prevEvent.time : null;

	if (prevTime || index) {
		// do nothing
		event.time = prevTime + TICKS.get(prevEvent.dur);
	}

	return event;
}));

/**
 * Generates a motif
 *
 * @example createMotif(new Scale('A', Scale.MAJOR)) =>
 * [ { time: 0, note: 'A4', midi: 69, dur: '8t' },
    { time: '64i', note: 'C#5', midi: 73, dur: '4n.' },
    { time: '352i', note: 'C#5', midi: 73, dur: '4n.' },
    { time: '640i', note: 'B4', midi: 71, dur: '8t' },
    { time: '704i', note: 'C#5', midi: 73, dur: '8t' } ]
 *
 * @param {Array<Note>} notes
 * @param {Array<String>} rhythm decides which duration to be used based on probabilities
 * @param {Number} startTime when to start the motif
 * @param {Boolean} noDurMapping leave time per event = startTime
 *
 * @return {Array<Motif>}
 */
function motif(notes, rhythm = [], startTime = 0, noDurMapping = false) {
	// What's a rhythm?
	// combination of notes

	const pattern = rhythm.map((duration) => {
		const note = choose(notes);

		return {
			time: startTime,
			note: note.n,
			midi: note.m,
			dur: duration,
		};
	});

	if (noDurMapping) {
		return pattern;
	}

	return mapDurations(pattern);
}


export default motif;
