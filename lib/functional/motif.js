import { choose, Time } from '../tools';

/**
 * Generates a motif
 *
 * @function createMotif
 * @memberof Functional
 *
 * @example createMotif(new Scale('A', Scale.MAJOR)) =>
 * [
 *  { time: 0, note: 'G#4', midi: 80, dur: 480 },
 *  { time: 480, note: 'E4', midi: 76, dur: 240 },
 *	{ time: 720, note: 'E4', midi: 76, dur: 240 },
 *	{ time: 960, note: 'D4', midi: 74, dur: 480 },
 *	{ time: 1440, note: 'F#4', midi: 78, dur: 240 },
 *	{ time: 1680, note: 'D4', midi: 74, dur: 240 }
 * ]
 *
 * @param {Array<Note>} notes
 * @param {Array<String>} rhythm decides which duration to be used based on probabilities
 * @param {Number} startTime when to start the motif
 * @param {Boolean} noDurMapping leave time per event = startTime
 * @param {Boolean} mapToTicks map duration to ticks
 *
 * @return {Motif}
 */
function createMotif(notes, rhythm = [], startTime = 0, { noDurMapping = false, mapToTicks = true } = {}) {
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

	return Time.expandDuration(pattern, mapToTicks);
}


export default createMotif;
