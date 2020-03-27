import * as R from 'ramda';
import { TimeFormat, Time as T } from '../../core/Time';
import { whilst, isEmpty, PlayaError } from '../../utils';
import { expandDuration } from '../time';
import { roll, distribute } from '@ricardomatias/roll';
import Random from '../random';
import choose from '../choose';
import { NoteEvent } from '../../core/NoteEvent';

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
 * @return {Array<NoteEvent>}
 */
const createFreeRhythm = (
	length: TimeFormat,
	noteValues: TimeFormat[],
	noteDurations: TimeFormat[] = [],
	distributionAlgo: (rhythm: TimeFormat[], precision?: number) => string[] = distribute.equal,
): NoteEvent[] => {
	const totalRhythmDuration = T(length).ticks;

	let rhythm: string[] = [];
	let availableRhythmUnits = R.clone(noteValues);
	let probabilities = distributionAlgo(availableRhythmUnits, PRECISION);
	let totalTime = 0;

	try {
		whilst(() => {
			const duration = roll(availableRhythmUnits, probabilities, Random.float);

			const ticks = typeof duration === 'string' ? T(duration) : duration;

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
		return R.map(NoteEvent, expandDuration(rhythm));
	}

	const durations = R.times(() => (choose(noteDurations)), R.length(rhythm));

	const fillDurations = R.zipWith((rhythmDur: string, duration: string) => {
		const rhyDur = T(rhythmDur).ticks;
		const dur = T(duration).ticks;

		if (dur < rhyDur) {
			const rest = rhyDur - dur;

			return [
				{ time: 0, dur: dur, next: dur },
				{ time: 0, dur: rest, isRest: true },
			];
		}

		return [
			{ time: 0, dur, next: rhyDur },
		];
	});

	return R.map(NoteEvent, expandDuration(R.flatten(fillDurations(rhythm, durations))));
};

export default createFreeRhythm;
