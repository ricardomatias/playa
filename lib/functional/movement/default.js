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

const { turn: generateTurnRhythm } = Rhythm;

const QUARTER = TICKS.get('4n');

// TODO: key can be of type SCALE or KEY
// TODO: ignore certain modes

/**
 * Creates a Movement
 *
 * @function createMovement
 * @memberof Functional
 * @example
 * createMovement(new Key('D', Key.MINOR), '4:0:0', 4)
 *
 * @param {Key} key starting scale
 * @param {Number} length in Transport time
 * @param {Number} turns turns
 * @param {Object} [opts = {}]
 * @param {string} [opts.rhythm = 'euclidean'] 'euclidean' or 'turn'
 * @param {number} [opts.modProb = 0.0] modulation probability
 * @param {Object} [opts.repeats = 0] repeat inner movement parts - NOT_IMPLEMENTED
 * @param {Array<Array<Number>>} [opts.timeSignatures] [[4, 4], [3, 4]] - NOT_IMPLEMENTED
 *
 * @return {Movement}
 */
function movement(key, length, turns, {
	modProb = 0.0,
	repeats = 0,
	rhythm = EUCLIDEAN,
	timeSignatures = [ [ 4, 4 ] ],
} = {}) {
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

				if (event) {
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
	timeline = timeline.map((event, index) => {
		if (modProb > Random.float() && index != 0) {
			event.key = modulate(key, events);

			mainKey = key.root;
		} else {
			key.modulateMode();

			event.key = createNewEventKey(key);

			events.push({
				key: mainKey,
				root: event.key.root,
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
