import * as R from 'ramda';
import { choose, ticksToTransport, random, generateRhythm, distribute } from '../tools';
import { RHYTHMS_DISTRIBUTIONS } from '../constants';
import createMotif from './motif';
import createScale from './scale';

/**
 * @param {Array<Object>} timeline
 * @param {Array<Object>} motifTypes
 * @param {Number} restProb
 *
 * @return {Array<Object>} { time, dur, note, chordName }
 */
function createMelodies(
	timeline,
	{
		rhythms = [ RHYTHMS_DISTRIBUTIONS.mixed ],
		distributions = [ distribute.descending ],
		restProb = 0,
		octaves = [ 4, 2 ],
	} = {}
) {
	const melodies = [];

	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale: scaleType, root }} = timeline[index];

		const length = ticksToTransport(dur);

		const rhythm = generateRhythm(length, choose(rhythms), choose(distributions));

		const scale = createScale(root, scaleType, octaves);

		let motif = createMotif(scale.notes, rhythm, time);

		motif = R.map((event) => {
			if (R.gt(restProb, random())) {
				return {
					time: event.time,
					dur: event.dur,
					midi: 0,
					note: '-',
				};
			}
			return event;
		}, motif);

		melodies.push(motif);
	}

	return R.flatten(melodies);
}

export default createMelodies;
