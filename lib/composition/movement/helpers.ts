import { roll, distribute } from '@ricardomatias/roll';

import { Key, ModulationDirection } from '../../core';
import { Interval, TurnMoves } from '../../constants';
import {
	choose,
	Random,
} from '../../tools';
import { ModulationEvent, ModulationEventType, TimelineEventKey, Turn, TurnEvent } from './types';
import { ModeIntervals } from '../../constants/modes';

const PRECISION = 5;

export const createNewEventKey = (key: Key): TimelineEventKey => ({
	root: key.root.note,
	scale: key.intervals as ModeIntervals,
});

/**
 * Modulates to a different key
 * @function modulate
 * @private
 *
 * @param {Key} key
 * @param {Object} events
 * @param {String} dir
 * @param {String} turn
 * @return {Object}
 */
export const modulate = (
	key: Key, events: ModulationEvent[] | TurnEvent[], dir?: ModulationDirection, turn?: Turn): TimelineEventKey => {
	const probabilities: string[] = [];
	const direction = dir || choose([ Key.ModulateUp, Key.ModulateDown ]);

	let interval = turn?.interval;

	if (!interval) {
		const halfIntervalsDistr = distribute.decreasing(Key.ModulationIntervals.length / 2, PRECISION);

		// This needs to be done in order for the distribution to be more even
		// since 4P/5P up or down only leads to ONE accidental
		halfIntervalsDistr.forEach((prob, index) => {
			let half;

			if (!index) {
				half = parseFloat(prob) / 2;

				probabilities.push(half.toFixed(3), (half + half).toFixed(3));
			} else {
				const prevProb = parseFloat(probabilities[probabilities.length - 1]);
				const currentProb = parseFloat(prob) - prevProb;

				half = currentProb / 2;

				probabilities.push((prevProb + half).toFixed(3), (prevProb + half + half).toFixed(3));
			}
		});

		interval = roll(Array.from(Key.ModulationIntervals), probabilities, Random.float) as Interval;
	}

	key.modulate(direction, interval as Interval);

	// * TRACKING
	const event: any = {
		key: key.root.note,
		root: key.root.note,
		position: key.modePositionRoman,
		type: ModulationEventType.Key,
		scaleName: Key.getModeName(key.intervals),
	};

	if (turn?.type) {
		event.turn = turn;
	}

	events.push(event);

	return createNewEventKey(key);
};

export const isTypeMod = (type: TurnMoves): boolean => (type === TurnMoves.ModulateUp || type === TurnMoves.ModulateDown);
