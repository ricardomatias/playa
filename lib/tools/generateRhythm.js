import * as R from 'ramda';
import { whilst, isEmpty } from '../utils';
import { transportToTicks } from './time';
import { TICKS } from '../constants';
import roll from './roll';

/**
 * Generates a rhythm
 *
 * @param {Number} length in Ticks
 * @param {Array} noteValues available notevalues
 * @param {Function} distributionAlgo [ descending, equal ] probability distribution
 * @return {Array<String>}
 */
const generateRhythm = (length, noteValues, distributionAlgo) => {
	const totalRhythmDuration = typeof length === 'number' ? length : transportToTicks(length);

	let rhythm = [];
	let availableRhythmUnits = R.clone(noteValues);
	let probabilities = distributionAlgo(availableRhythmUnits);
	let totalTime = 0;

	try {
		whilst(() => {
			const duration = roll(availableRhythmUnits, probabilities);

			if (duration) {
				const ticks = TICKS.get(duration);

				if (totalTime + ticks <= totalRhythmDuration) {
					totalTime += ticks;

					rhythm.push(duration);
				} else {
					availableRhythmUnits = R.without([ duration ], availableRhythmUnits);

					probabilities = distributionAlgo(availableRhythmUnits);

					probabilities = R.map(R.unless(
						R.lt(0.25),
						R.add(0.1)
					), probabilities);

					if (isEmpty(availableRhythmUnits)) {
						availableRhythmUnits = R.clone(noteValues);
						probabilities = distributionAlgo(availableRhythmUnits);
						totalTime = 0;
						rhythm = [];
					}
				}
			}
		}, () => (totalTime < totalRhythmDuration), 5000);
	} catch (error) {
		console.error(error);
		// DO NOTHING
	}

	return rhythm;
};

export default generateRhythm;
