import { roll } from '@ricardomatias/roll';

import { Key, ModulationDirection } from '../../core/Key';
import { TurnMoves } from '../../constants/turns';
import { Interval } from '../../constants/intervals';
import random from '../../tools/random';
import { choose } from '../../tools/choose';
import { ModulationEvent, ModulationEventType, TimelineEventKey, Turn, TurnEvent } from './types';
import { ModeIntervals } from '../../constants/modes';

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
	key: Key,
	events: ModulationEvent[] | TurnEvent[],
	dir?: ModulationDirection,
	turn?: Turn
): TimelineEventKey => {
	const direction = dir || choose([Key.ModulateUp, Key.ModulateDown]);

	let interval = turn?.interval;

	if (!interval) {
		interval = roll(Array.from(Key.ModulationIntervals), Array.from(Key.KeyModulationProbabilities), random.float);
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

export const isTypeMod = (type: TurnMoves): boolean => type === TurnMoves.ModulateUp || type === TurnMoves.ModulateDown;
