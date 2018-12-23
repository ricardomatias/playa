import * as R from 'ramda';
import { choose, motifs, ticksToTransport, random } from '../tools';
import createMotif from './motif';
import createScale from './scale';

/**
 * @param {Array<Object>} timeline
 * @param {Array<Object>} motifTypes
 * @param {Number} restProb
 *
 * @return {Array<Object>} { time, dur, note, chordName }
 */
function createMelodies(timeline, { motifTypes = [ motifs.descending ], restProb = 0, octaves = [ 4, 2 ] } = {}) {
	const melodies = [];

	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale: scaleType, root }} = timeline[index];

		const rhythmAlgo = choose(motifTypes);
		const length = ticksToTransport(dur);

		const scale = createScale(root, scaleType, octaves);

		let motif = createMotif(scale.notes, length, rhythmAlgo, time);

		motif = R.filter(() => (R.gt(random(), restProb)), motif);

		melodies.push(motif);
	}

	return R.flatten(melodies);
}

export default createMelodies;
