import * as R from 'ramda';
import { Key } from '../../core';
import {
	euclidean,
	Rhythm,
	Random,
	Time,
} from '../../tools';
import { TICKS } from '../../constants';
import { modulate, createNewEventKey, EUCLIDEAN, TURN } from './helpers';

const { random } = Random;
const { generateTurnRhythm } = Rhythm;

const QUARTER = TICKS.get('4n');

const HIT = 'x';

/**
 * Creates a Movement
 *
 * @function createMovement
 * @memberof Functional
 *
 * @param {Key} key starting scale
 * @param {Number} length in Transport time
 * @param {Object} opts
 * @param {Array<Array<Number>>} [opts.timeSignatures] [[4, 4], [3, 4]]
 * @param {Number} [opts.turns] turns
 * @param {Object} [opts.modProb] modulation probability
 * @param {Object} [opts.repeats] repeat inner movement parts
 * @return {Array<Object>}
 */
function movement(key, length, {
	turns,
	modProb,
	repeats,
	rhythm = EUCLIDEAN,
	timeSignatures = [ [ 4, 4 ] ],
}) {
	const events = [];
	const ticks = Time.transportToTicks(length);
	const MAX_TURNS = ticks / QUARTER;

	let mainKey = key.root;

	// **************************************************************************
	// * PHASE: CREATE TURNS
	// **************************************************************************
	let timeline;

	if (rhythm === EUCLIDEAN) {
		timeline = euclidean.create(MAX_TURNS, turns)
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
		timeline = generateTurnRhythm(length, turns, {
			minNoteValue: 8,
			combSorting: {
				diverseFirst: true,
			},
		});
	}

	// **************************************************************************
	// * PHASE: CREATE KEY EVENTS
	// **************************************************************************
	timeline = timeline.map((event) => {
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
				position: key.modePositionRoman,
			});
		}

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

export default movement;
