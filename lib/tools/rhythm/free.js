import * as R from 'ramda';
import { TICKS } from '../../constants';
import { whilst, isEmpty, PlayaError } from '../../utils';
import { transportToTicks } from '../time';
import { roll, distribute } from '@ricardomatias/roll';
import Random from '../random';

const PRECISION = 5;

/**
 * Generates a rhythm
 *
 * @param {Number} length in Ticks
 * @param {Array} noteValues available notevalues
 * @param {Function} [distributionAlgo] [ decreasing, increasing, equal ] probability distribution
 * @param {boolean} [mapDurations]
 * @return {Array<String>}
 */
export default (length, noteValues, distributionAlgo = distribute.equal, mapDurations = false) => {
	const totalRhythmDuration = typeof length === 'number' ? length : transportToTicks(length);

	let rhythm = [];
	let availableRhythmUnits = R.clone(noteValues);
	let probabilities = distributionAlgo(availableRhythmUnits, PRECISION);
	let totalTime = 0;

	try {
		whilst(() => {
			const duration = roll(availableRhythmUnits, probabilities, Random.float);

			const ticks = typeof duration === 'string' ? TICKS.get(duration) : duration;

			if (totalTime + ticks <= totalRhythmDuration) {
				totalTime += ticks;

				rhythm.push(duration);
			} else {
				availableRhythmUnits = R.without([ duration ], availableRhythmUnits);

				probabilities = distributionAlgo(availableRhythmUnits);

				if (isEmpty(availableRhythmUnits)) {
					availableRhythmUnits = R.clone(noteValues);
					probabilities = distributionAlgo(availableRhythmUnits);
					totalTime = 0;
					rhythm = [];
				}
			}
		}, () => (totalTime < totalRhythmDuration), { maxLoops: 10000 });
	} catch (error) {
		throw new PlayaError('generateFreeRhythm', '', { error, availableRhythmUnits, rhythm, totalTime });
		// DO NOTHING
	}

	if (mapDurations) {
		return rhythm.map((duration) => {
			return {
				time: 0,
				dur: duration,
			};
		});
	}

	return rhythm;
};
