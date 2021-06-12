import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';

import { TimeFormat, Time as T } from '../../core/Time';
import { whilst, PlayaError, toTicks } from '../../utils';
import { expandDuration } from '../../tools/event';
import random from '../../tools/random';
import { chooseMany } from '../../tools/choose';
import { Event } from '../../core/Event';
import { Notevalue } from '../../constants';

const PRECISION = 5;

/**
 * Rhythm tools
 * @namespace Rhythm
 * @memberof Composition
 */

/**
 * Generates a rhythm
 * @function free
 * @memberof Composition.Rhythm
 * @example
 * createFreeRhythm('2n', [ '8n', '4nt' ]) =>
 * [
	{ time: 0, dur: 320, next: 320, isRest: false },
	{ time: 320, dur: 320, next: 640, isRest: false },
	{ time: 640, dur: 320, next: 960, isRest: false }
]
 *
 * @param {TimeFormat} length in Ticks
 * @param {Array<Notevalue>} noteValues available notevalues
 * @param {Array<Notevalue>} [noteDurations=[]] available notevalues
 * @param {Function} [distributionAlgo = distribute.equal] [ decreasing, increasing, equal ] probability distribution
 * @return {Array<Event>}
 */
export function createFreeRhythm(
	length: TimeFormat,
	noteValues: Notevalue[],
	noteDurations: TimeFormat[] = [],
	distributionAlgo: (rhythm: TimeFormat[], precision?: number) => string[] = distribute.equal
): Event[] {
	const totalRhythmDuration = new T(length).ticks;

	let rhythm: Notevalue[] = [];
	let availableRhythmUnits = [ ...noteValues ];
	let probabilities = distributionAlgo(availableRhythmUnits, PRECISION);
	let totalTime = 0;

	try {
		whilst(
			() => {
				const duration = roll(availableRhythmUnits, probabilities, random.float);

				const ticks = toTicks(duration);

				if (totalTime + ticks <= totalRhythmDuration) {
					totalTime += ticks;

					rhythm.push(duration);
				} else {
					availableRhythmUnits = R.without([ duration ], availableRhythmUnits);

					probabilities = distributionAlgo(availableRhythmUnits);

					if (R.isEmpty(availableRhythmUnits)) {
						availableRhythmUnits = R.clone(noteValues);
						probabilities = distributionAlgo(availableRhythmUnits);
						totalTime = 0;
						rhythm = [];
					}
				}
			},
			() => totalTime < totalRhythmDuration,
			{ maxLoops: 10000 }
		);
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

			if (random.boolean()) {
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

		return [ { time: 0, dur: noteDur, next: rhyDur, isRest: false } ];
	});

	return expandDuration(R.flatten(fillDurations(rhythm, durations)));
}
