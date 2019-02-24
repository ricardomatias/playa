import * as R from 'ramda';
import { TICKS } from '../../constants';
import { whilst, isEmpty, PlayaError } from '../../utils';
import { transportToTicks } from '../time';
import roll from '../roll';

/**
 * Generates a rhythm
 *
 * @param {Number} length in Ticks
 * @param {Array} noteValues available notevalues
 * @param {Function} distributionAlgo [ descending, equal ] probability distribution
 * @return {Array<String>}
 */
export default (length, noteValues, distributionAlgo) => {
	const totalRhythmDuration = typeof length === 'number' ? length : transportToTicks(length);

	let rhythm = [];
	let availableRhythmUnits = R.clone(noteValues);
	let probabilities = distributionAlgo(availableRhythmUnits);
	let totalTime = 0;

	try {
		whilst(() => {
			const duration = roll(availableRhythmUnits, probabilities);

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
		}, () => (totalTime < totalRhythmDuration), 5000);
	} catch (error) {
		throw new PlayaError('generateFreeRhythm', '', { error, availableRhythmUnits, rhythm, totalTime });
		// DO NOTHING
	}

	return rhythm;
};
