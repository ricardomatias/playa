import { choose, Time } from '../tools';

/**
 * Generates a motif
 *
 * @function createMotif
 * @memberof Functional
 *
 * @example
 * createMotif(new Scale('A', Scale.MAJOR), Rhythm.free('1:0:0', ['4n', '8n', '16n']))
 *
 * @param {Array<Note>} notes
 * @param {Array<String>} rhythm decides which duration to be used based on probabilities
 * @param {Number} [startTime = 0] when to start the motif
 * @param {object} [opts] options
 * @param {Boolean} [opts.noDurMapping = false] leave time property per event = startTime
 * @param {Boolean} [opts.mapToTicks = true] map duration to ticks
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
