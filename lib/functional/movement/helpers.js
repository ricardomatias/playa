import { roll, distribute } from '@ricardomatias/roll';

import { Key } from '../../core';
import { TURN_MOVES } from '../../constants';
import {
	choose,
	random,
} from '../../tools';

const { TURN_MOD_UP, TURN_MOD_DOWN } = TURN_MOVES;

export const EUCLIDEAN = 'euclid';
export const TURN = 'turn';

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
export const modulate = (key, events, dir, turn = {}) => {
	const probabilities = [];
	const direction = dir || choose([ Key.MOD_UP, Key.MOD_DOWN ]);

	let interval = turn.interval;

	if (!interval) {
		const halfIntervalsDistr = distribute.decreasing(Key.MOD_INTERVALS.length / 2);

		// This needs to be done in order for the distribution to be more even
		// since 4P/5P up or down only leads to ONE accidental
		halfIntervalsDistr.forEach((prob, index) => {
			let half;

			if (!index) {
				half = parseFloat(prob, 10) / 2;

				probabilities.push(half.toFixed(3), (half + half).toFixed(3));
			} else {
				const prevProb = parseFloat(probabilities[probabilities.length - 1], 10);
				const currentProb = parseFloat(prob, 10) - prevProb;

				half = parseFloat(currentProb, 10) / 2;

				probabilities.push((prevProb + half).toFixed(3), (prevProb + half + half).toFixed(3));
			}
		});

		interval = roll(Key.MOD_INTERVALS, probabilities, random);
	}

	key.modulate(direction, interval);

	// * TRACKING
	const event = {
		key: key.root,
		root: key.root,
		position: key.modePositionRoman,
		interval,
		type: 'modulate',
		scaleName: Key.NAMES[key.type],
	};

	if (turn.type) {
		event.turn = turn;
	}

	events.push(event);

	return createNewEventKey(key);
};

export const createNewEventKey = (key) => ({
	root: key.root,
	scale: key.type,
});

export const isTypeMod = (type) => ([ TURN_MOD_UP, TURN_MOD_DOWN ].includes(type));
