import * as R from 'ramda';
import { TimeFormat, Time as T } from '../../core/Time';
import { whilst, isEmpty, PlayaError } from '../../utils';
import { expandDuration } from '../time';
import { roll, distribute } from '@ricardomatias/roll';
import Random from '../random';
import { chooseMany } from '../choose';
import { Event } from '../../core/Event';

const PRECISION = 5;

/**
 * Rhythm tools
 * @namespace Rhythm
 * @memberof Tools
 */

/**
 * Generates a rhythm
 * @function free
 * @memberof Tools.Rhythm
 *
 * @param {Number} length in Ticks
 * @param {Array} noteValues available notevalues
 * @param {Array} [noteDurations=[]] available notevalues
 * @param {Function} [distributionAlgo = distribute.equal] [ decreasing, increasing, equal ] probability distribution
 * @return {Array<Event>}
 */
const createFreeRhythm = (
	length: TimeFormat,
	noteValues: TimeFormat[],
	noteDurations: TimeFormat[] = [],
	distributionAlgo: (rhythm: TimeFormat[], precision?: number) => string[] = distribute.equal,
): Event[] => {
	const totalRhythmDuration = new T(length).ticks;

	let rhythm: string[] = [];
	let availableRhythmUnits = [ ...noteValues ];
	let probabilities = distributionAlgo(availableRhythmUnits, PRECISION);
	let totalTime = 0;

	try {
		whilst(() => {
			const duration = roll(availableRhythmUnits, probabilities, Random.float);

			const ticks = typeof duration === 'string' ? new T(duration) : duration;

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
		throw new PlayaError('generateFreeRhythm', error.message, { availableRhythmUnits, rhythm, totalTime });
		// DO NOTHING
	}

	// results in a legato style
	if (R.isEmpty(noteDurations)) {
		return expandDuration(rhythm);
	}

	const durations = chooseMany(noteDurations, R.length(rhythm));


	// rhyDur > noteDur -> there is a rest
	// rhyDur < noteDur -> the next note will overlap with the current
	const fillDurations = R.zipWith((rhythmDur: string, duration: TimeFormat) => {
		const rhyDur = new T(rhythmDur).ticks;
		const noteDur = new T(duration).ticks;

		if (rhyDur > noteDur) {
			const rest = rhyDur - noteDur;

			if (Random.boolean()) {
				// Rhythm is on the beat
				return [
					{ time: 0, dur: noteDur, next: noteDur, isRest: false },
					{ time: 0, dur: rest, next: 0, isRest: true },
				];
			} else {
				// Rhythm is off the beat
				return [
					{ time: 0, dur: rest, next: rest, isRest: true },
					{ time: 0, dur: noteDur, next: 0, isRest: false },
				];
			}
		}

		return [
			{ time: 0, dur: noteDur, next: rhyDur, isRest: false },
		];
	});

	return expandDuration(R.flatten(fillDurations(rhythm, durations)));
};

export default createFreeRhythm;
