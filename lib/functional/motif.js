import { randomInt } from '../tools/random';
import { motifs } from '../tools';
import TICKS from './ticks';

const { normal } = motifs;

const BAR = TICKS.get('1m');
const QUARTER = TICKS.get('4n');
const SIXTEENTH = TICKS.get('16n');

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
 * @param {Function} rhythmAlgo decides which duration to be used based on probabilities
 * @return {Array<String>}
 */
export const generateRhythm = (length, rhythmAlgo) => {
	const rhythm = [];
	const roll = rhythmAlgo();

	let totalTime = 0;
	let tries = 0;

	while (totalTime < length) {
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
	}

	return rhythm;
};

// BARS: QUARTERS: SIXTEENTHS
const transportToTicks = (time) => {
	try {
		const [ bars, quarters, sixteenths ] = time.split(':');

		return parseInt(bars, 10) * BAR +
				parseInt(quarters, 10) * QUARTER +
				parseInt(sixteenths, 10) * SIXTEENTH;
	} catch (err) {
		console.error(err); /* eslint no-console:0 */
	}
};

const toNumber = (toneTick = '') => (toneTick && parseInt(toneTick.replace('i', ''), 10));

/**
 * Generates a motif
 *
 * @param {Array<Note>} notes
 * @param {String} length in Transport time
 * @param {Functon} rhythmAlgo decides which duration to be used based on probabilities
 * @param {Number} startTime when to start the motif
 * @return {Array<Motif>}
 */
function motif(notes, length = '1:0:0', rhythmAlgo = normal, startTime = 0) {
	// What's a rhythm?
	// combination of notes
	const rhythm = generateRhythm(transportToTicks(length), rhythmAlgo);

	const pattern = rhythm.map((duration, index) => {
		const note = notes[randomInt(notes.length)];

		return {
			time: startTime,
			note: note.n,
			midi: note.m,
			dur: duration,
		};
	});

	return pattern.map((event, index) => {
		if (!index) {
			event.time = event.time === 0 ? 0 : `${event.time}i`;

			return event;
		}

		const prevTime = pattern[index - 1] ? toNumber(pattern[index - 1].time) : null;

		if (prevTime || index) {
			// do nothing
			event.time = `${prevTime + TICKS.get(event.dur)}i`;
		}

		return event;
	});
}


export default motif;
