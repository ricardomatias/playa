import * as R from 'ramda';
import { Key } from '../core';
import { transportToTicks, choose, euclidean, random, distribute } from '../tools';
import { whilst } from '../utils';
import { TICKS } from '../constants';

const QUARTER = TICKS.get('4n');

const HIT = 'x';

/**
 * typedef {Object} Movement
 * @property {String} time when it's playing in Ticks
 * @property {String} dur in note value
 * @property {String} note the note
 * @property {Number} midi midi value
 */
class Movement { } /* eslint no-unused-vars: 0 */

/**
 * Creates a Movement
 *
 * @param {Key} key
 * @param {Object} events
 * @return {Object}
 */
function modulate(key, events) {
	const direction = choose([ Key.MOD_UP, Key.MOD_DOWN ]);
	const intervalRoll = distribute.descending(Key.MOD_INTERVALS);
	let interval;

	whilst(() => {
		interval = intervalRoll();
	}, () => (!interval));

	key.modulate(direction, interval);

	events.push({
		key: key.root,
		interval,
		type: 'modulate',
		position: key.modePosition,
		scaleName: Key.NAMES[key.type],
	});

	return createNewEventKey(key);
}

const createNewEventKey = (key) => ({
	root: key.root,
	scale: key.type,
});


/**
 * Creates a Movement
 *
 * @param {Key} key starting scale
 * @param {Number} length in Transport time
 * @param {Object} opts
 * @param {Array<Array<Number>>} [opts.timeSignatures] [[4, 4], [3, 4]]
 * @param {Number} [opts.turns] turns
 * @param {Object} [opts.modProb] modulation probability
 * @return {Array<Object>}
 */
function movement(key, length, { timeSignatures, turns, modProb }) {
	const events = [];
	const ticks = transportToTicks(length);
	const MAX_TURNS = ticks / QUARTER;

	let mainKey = key.root;

	// **************************************************************************
	// * PHASE: CREATE TURNS
	// **************************************************************************
	let timeline = euclidean.create(MAX_TURNS, turns)
		.map((event, index) => {
			const quarter = index + 1;

			if (event === HIT) {
				return {
					quarter,
					time: index * QUARTER,
					dur: 0,
				};
			}
		})
		.filter(R.is(Object))
		.map((event) => {
			// **************************************************************************
			// * PHASE: CREATE KEY EVENTS
			// **************************************************************************
			if (modProb > random()) {
				event.key = modulate(key, events);

				mainKey = key.root;
			} else {
				key.modulateMode();

				event.key = createNewEventKey(key);

				events.push({
					key: mainKey,
					type: 'modulateMode',
					scaleName: Key.NAMES[event.key.scale],
					position: key.modePosition,
				});
			}

			return event;
		})
		.map((event, index, timeline) => {
			// **************************************************************************
			// * PHASE: ADJUST TIME
			// **************************************************************************
			const nextQuarter = index + 1;

			if (timeline[nextQuarter]) {
				event.dur = (timeline[nextQuarter].quarter - event.quarter) * QUARTER;
			} else {
				event.dur = ticks - (event.quarter * QUARTER);
			}

			return event;
		});

	return { timeline, events };
}

export default movement;
