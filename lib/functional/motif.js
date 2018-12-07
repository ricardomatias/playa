import * as R from 'ramda';
import { choose, transportToTicks, motifs } from '../tools';
import { whilst } from '../utils';
import { TICKS } from '../constants';

const { basic } = motifs;

const MAX_TRIES = 20;

/**
 * typedef {Object} Motif
 * @property {String} time when it's playing in Ticks
 * @property {String} dur in note value
 * @property {String} note the note
 * @property {Number} midi midi value
 */
class Motif {} /* eslint no-unused-vars: 0 */

/**
 * Generates a rhythm
 *
 * @param {Number} length in Ticks
 * @param {Function} rhythmAlgo decides which duration to be used based on probability
 * @return {Array<String>}
 */
export const generateRhythm = (length, rhythmAlgo) => {
	const rhythm = [];
	const roll = rhythmAlgo();

	let totalTime = 0;
	let tries = 0;

	whilst(() => {
		const duration = roll();

		if (duration) {
			const ticks = TICKS.get(duration);

			if (totalTime + ticks <= length) {
				totalTime += ticks;
				rhythm.push(duration);
			} else {
				++tries;

				// reset and try to get another combination
				if (tries > MAX_TRIES) {
					totalTime = tries = 0;
					rhythm.splice(0, rhythm.length);
				}
			}
		}
	}, () => (totalTime < length));

	return rhythm;
};

export const fromTickToNumber = (toneTick = '') => (toneTick && parseInt(toneTick.replace('i', ''), 10));

export const calcDuration = (motif) => {
	const last = R.last(motif);

	return parseFloat(R.replace('i', '', R.prop('time', last)), 10) + TICKS.get(R.prop('dur', last));
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
		event.time = event.time === 0 ? 0 : `${event.time}i`;

		return event;
	}

	const prevEvent = pattern[index - 1] ? pattern[index - 1] : null;

	const prevTime = prevEvent ? fromTickToNumber(prevEvent.time) : null;

	if (prevTime || index) {
		// do nothing
		event.time = `${prevTime + TICKS.get(prevEvent.dur)}i`;
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
 * @param {String} length in Transport time
 * @param {Functon} rhythmAlgo decides which duration to be used based on probabilities
 * @param {Number} startTime when to start the motif
 * @param {Boolean} noDurMapping leave time per event = startTime
 * @return {Array<Motif>}
 */
function motif(notes, length = '1:0:0', rhythmAlgo = basic, startTime = 0, noDurMapping = false) {
	// What's a rhythm?
	// combination of notes
	const rhythm = generateRhythm(transportToTicks(length), rhythmAlgo);

	const pattern = rhythm.map((duration, index) => {
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
