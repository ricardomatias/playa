import * as R from 'ramda';
import { Key } from '../../core';
import NoteType from '../../core/types';
import {
	euclidean,
	Rhythm,
	Time,
	choose,
} from '../../tools';

import { TICKS, TURN_MOVES } from '../../constants';

import { modulate, createNewEventKey, isTypeMod, EUCLIDEAN, TURN } from './helpers';

const QUARTER = TICKS.get('4n');

const HIT = 'x';

const {
	TURN_START,
	TURN_UP,
	TURN_DOWN,
	TURN_KEEP,
	TURN_MOD_DOWN,
	TURN_MOD_UP,
	TURN_FREE,
} = TURN_MOVES;

const DEFAULT_TURNS = [
	TURN_START,
	TURN_UP,
	TURN_KEEP,
	TURN_MOD_DOWN,
	TURN_UP,
	TURN_DOWN,
	TURN_MOD_UP,
	TURN_DOWN,
];

const MOD_MODE_INTERVALS = [ 1, 2, 3, 4, 5, 6, 7 ];

/**
 * @typedef {Object} Turn
 * @property {String} type '▼'
 * @property {String | Number} interval '⟷'
 * @example
 * { type: '▼', interval: '⟷' }
*/

/**
 * Creates a Movement out of a Turn structure
 * @function createTurnMovement
 * @memberof Functional
 *
 * @param {Key} key starting scale
 * @param {Array<String>} turns in Transport time
 * @param {Number} length in Transport time
 * @param {Object} opts
 * @param {Array<Array<Number>>} [opts.timeSignatures] [[4, 4], [3, 4]]
 * @param {Number} [opts.turns] turns
 * @param {Object} [opts.repeats] repeat inner movement parts
 * @return {Array<Turn>}
 */
function movementX(key, turns = DEFAULT_TURNS, length, {
	repeats,
	rhythm = EUCLIDEAN,
	timeSignatures = [ [ 4, 4 ] ],
} = {}) {
	const events = [];
	const ticks = Time.transportToTicks(length);
	const MAX_TURNS = ticks / QUARTER;

	const startingKey = { root: key.root, type: key.type };
	let mainKeyRoot = key.root;

	// **************************************************************************
	// * PHASE: CREATE TURNS
	// **************************************************************************
	const turnsNumber = turns.length;

	let timeline;

	if (rhythm === EUCLIDEAN) {
		timeline = euclidean.create(MAX_TURNS, turnsNumber)
			.map((event, index) => {
				const quarter = index + 1;

				if (event === HIT) {
					return {
						quarter,
						time: index * QUARTER,
						dur: 0,
					};
				}
			}).filter(R.is(Object));
	} else
	if (rhythm === TURN) {
		timeline = Rhythm.generateTurnRhythm(length, turnsNumber, {
			minNoteValue: 8,
			combSorting: {
				diverseFirst: true,
			},
		});
	}

	// **************************************************************************
	// * PHASE: CREATE KEY EVENTS
	// **************************************************************************
	let turnsIndex = 0;

	timeline = timeline.map((event) => {
		const turn = turns[turnsIndex++];
		let interval;
		let turnType = turn.type;

		if (turn.type === TURN_FREE) {
			turnType = choose(DEFAULT_TURNS);
		}

		if (turn.interval !== TURN_FREE) {
			interval = turn.interval;
		} else {
			interval = isTypeMod(turnType) ? choose(Key.MOD_INTERVALS) : choose(MOD_MODE_INTERVALS);
		}

		switch (turnType) {
		case TURN_START:
			// create a new key from the starting key
			key = new Key(startingKey.root, startingKey.type, { noteType: NoteType.NOTE });
			mainKeyRoot = key.root;

			key.modulateMode({ interval });
			break;
		case TURN_KEEP:
			break;
		case TURN_UP:
			key.modulateMode({ direction: Key.MOD_UP, interval });

			break;
		case TURN_DOWN:
			key.modulateMode({ direction: Key.MOD_DOWN, interval });

			break;
		case TURN_MOD_UP:
			event.key = modulate(key, events, Key.MOD_UP, { type: turnType, interval });

			mainKeyRoot = key.root;
			break;
		case TURN_MOD_DOWN:
			event.key = modulate(key, events, Key.MOD_DOWN, { type: turnType, interval });

			mainKeyRoot = key.root;
			break;
		}

		if (isTypeMod(turnType)) {
			return event;
		}

		event.key = createNewEventKey(key);

		events.push({
			turn: turn,
			root: key.root,
			position: key.modePositionRoman,
			key: mainKeyRoot,
			type: 'modulateMode',
			scaleName: Key.NAMES[event.key.scale],
		});

		return event;
	});

	if (rhythm === EUCLIDEAN) {
		// **************************************************************************
		// * PHASE: ADJUST TIME (EUCLIDEAN)
		// **************************************************************************
		timeline = timeline.map((event, index, timeline) => {
			const nextQuarter = index + 1;

			if (timeline[nextQuarter]) {
				event.dur = (timeline[nextQuarter].quarter - event.quarter) * QUARTER;
			} else {
				event.dur = ticks - event.time;
			}

			return event;
		});
	}

	return { timeline, events };
}

export default movementX;
