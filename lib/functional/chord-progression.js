import { Chord } from '../core';
import { choose } from '../tools';

/**
 * @param {Array<Object>} timeline
 * @param {Object} opts
 * @param {Object} [opts.structures]
 *
 * @return {Array<Object>} { time, dur, chord, chordName }
 */
function createChordProgression(timeline, { structures = Array.from(Chord.STRUCTURES.values()) } = {}) {
	const progression = [];


	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale, root }} = timeline[index];
		const structure = choose(structures);
		const chord = new Chord({ root, type: scale, structure });

		progression.push({
			time,
			dur,
			chord: chord.notes,
			chordName: chord.name,
		});
	}

	return progression;
}

export default createChordProgression;
