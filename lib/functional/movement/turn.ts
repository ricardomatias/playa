import * as R from 'ramda';
import { Key, Time, TimeFormat } from '../../core';
import {
	Euclidean,
	Rhythm,
	choose,
} from '../../tools';

import { Interval, NoteSymbol, ScaleName, Ticks, TurnMoves } from '../../constants';

import { modulate, createNewEventKey, isTypeMod } from './helpers';
import { MovementRhythm, TimelineEvent, TurnMovement, TurnEvent, Turn, ModulationEventType } from './types';
import { isUndefined } from '../../utils/types-guards';
import { BinaryEvent } from '../../common/types';

const QUARTER = Ticks['4n'];

const DEFAULT_TURNS = [
	TurnMoves.Keep,
	TurnMoves.ModulateUp,
	TurnMoves.ModulateDown,
	TurnMoves.ModeUp,
	TurnMoves.ModeDown,
].map((type) => ({ type, interval: TurnMoves.Free }));

const MOD_MODE_INTERVALS = [ 1, 2, 3, 4, 5, 6, 7 ];


/**
* Turn
* @typedef {Object} Turn
* @memberof Types
* @param {TurnMoves} type type of turn
* @param {Interval | number | string | "Free"} interval interval
*/


/**
 * Creates a Movement out of a Turn structure
 * @function createTurnMovement
 * @memberof Functional
 *
 * @param {Key} key starting scale
 * @param {Array<Turn>} turns number of turn events
 * @param {TimeFormat} length in Transport time
 * @param {Object} [opts = {}]
 * @param {MovementRhythm} [opts.rhythm = 'Euclidean'] 'euclidean' or 'turn'
 * @return {TurnMovement}
 */
function movement(key: Key, turns: Turn[] = DEFAULT_TURNS, length: TimeFormat, {
	// repeats,
	rhythmType = MovementRhythm.Euclidean,
	// timeSignatures = [ [ 4, 4 ] ],
} = {}): TurnMovement {
	const events: TurnEvent[] = [];
	const ticks = new Time(length).ticks;
	const MAX_TURNS = ticks / QUARTER;

	const startingKey = { root: key.root, type: key.intervals };
	let mainKeyRoot = key.root;

	// **************************************************************************
	// * PHASE: CREATE TURNS
	// **************************************************************************
	const turnsNumber = turns.length;

	let timeline;
	const quarters: number[] = [];
	let rhythm: TimelineEvent[] = [];

	if (rhythmType === MovementRhythm.Euclidean) {
		rhythm = <TimelineEvent[]>Euclidean.create(MAX_TURNS, turnsNumber)
			.map((event: BinaryEvent, index) => {
				if (event === BinaryEvent.Hit) {
					const quarter = index + 1;

					quarters.push(quarter);

					return {
						time: index * QUARTER,
						dur: 0,
					};
				}
			}).filter(R.is(Object));
	} else
	if (rhythmType === MovementRhythm.Turn) {
		rhythm = <TimelineEvent[]>Rhythm.turn(length, turnsNumber, {
			minNoteValue: 8,
			combSorting: {
				diverseFirst: true,
			},
		}).map(R.pick([ 'time', 'dur' ]));
	}

	// **************************************************************************
	// * PHASE: CREATE KEY EVENTS
	// **************************************************************************
	let turnsIndex = 0;

	timeline = rhythm.map((event) => {
		const turn = turns[turnsIndex++];
		let interval: typeof TurnMoves.Free | string | number | undefined;
		let turnType = turn.type;

		if (turn.type === TurnMoves.Free) {
			turnType = choose(DEFAULT_TURNS).type;
			interval = TurnMoves.Free; // * a FREE turn type must have a FREE interval
		}

		if (!interval && turn.interval !== TurnMoves.Free) {
			interval = turn.interval;
		} else {
			interval = isTypeMod(turnType) ? choose(Array.from(Key.ModulationIntervals)) : choose(MOD_MODE_INTERVALS);
		}

		if (isUndefined(interval)) {
			interval = choose(MOD_MODE_INTERVALS);
		}

		switch (turnType) {
		case TurnMoves.Start:
			// create a new key from the starting key
			key = new Key(startingKey.root, startingKey.type);
			mainKeyRoot = key.root;

			key.modulateMode({ interval: interval as number });
			break;
		case TurnMoves.Keep:
			break;
		case TurnMoves.ModeUp:
			key.modulateMode({ direction: Key.ModulateUp, interval: interval as number });

			break;
		case TurnMoves.ModeDown:
			key.modulateMode({ direction: Key.ModulateDown, interval: interval as number });

			break;
		case TurnMoves.ModulateUp:
			event.key = modulate(key, events, Key.ModulateUp, { type: turnType, interval: interval as Interval });

			mainKeyRoot = key.root;
			break;
		case TurnMoves.ModulateDown:
			event.key = modulate(key, events, Key.ModulateDown, { type: turnType, interval: interval as Interval });

			mainKeyRoot = key.root;
			break;
		}

		if (isTypeMod(turnType)) {
			return event;
		}

		event.key = createNewEventKey(key);

		events.push({
			turn: turn,
			root: key.root as NoteSymbol,
			position: key.modePositionRoman,
			key: mainKeyRoot as NoteSymbol,
			type: ModulationEventType.Mode,
			scaleName: Key.getModeName(event.key.scale) as ScaleName,
		});

		return event;
	});

	if (rhythmType === MovementRhythm.Euclidean) {
		// **************************************************************************
		// * PHASE: ADJUST TIME (Euclidean)
		// **************************************************************************
		timeline = timeline.map((event, index, timeline) => {
			const nextQuarter = index + 1;

			if (timeline[nextQuarter]) {
				event.dur = (quarters[nextQuarter] - quarters[index]) * QUARTER;
			} else {
				event.dur = ticks - event.time;
			}

			return event;
		});
	}

	return { timeline, events };
}

export default movement;
