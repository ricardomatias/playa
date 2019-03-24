import { choose, mapDurations } from '../tools';

/**
 * typedef {Object} Motif
 * @property {String} time when it's playing in Ticks
 * @property {String} dur in note value
 * @property {String} note the note
 * @property {Number} midi midi value
 */
class Motif {} /* eslint no-unused-vars: 0 */

/**
 * Generates a motif
 *
 * @example createMotif(new Scale('A', Scale.MAJOR)) =>
 * [ { time: 0, note: 'A4', midi: 69, dur: '8nt' },
    { time: '64i', note: 'C#5', midi: 73, dur: '4n.' },
    { time: '352i', note: 'C#5', midi: 73, dur: '4n.' },
    { time: '640i', note: 'B4', midi: 71, dur: '8nt' },
    { time: '704i', note: 'C#5', midi: 73, dur: '8nt' } ]
 *
 * @param {Array<Note>} notes
 * @param {Array<String>} rhythm decides which duration to be used based on probabilities
 * @param {Number} startTime when to start the motif
 * @param {Boolean} noDurMapping leave time per event = startTime
 * @param {Boolean} mapToTicks map duration to ticks
 *
 * @return {Array<Motif>}
 */
function motif(notes, rhythm = [], startTime = 0, { noDurMapping = false, mapToTicks = false } = {}) {
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

	return mapDurations(pattern, mapToTicks);
}


export default motif;
