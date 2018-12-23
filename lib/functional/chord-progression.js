import { Chord } from '../core';
import { choose } from '../tools';

/**
 * @param {Array<Object>} timeline
 * @param {Array<Object>} structures
 * @param {Object} opts
 *
 * @return {Object} [str, midi, freq, notes]
 */
function createChordProgression(timeline, structures = Chord.STRUCTURES) {
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
