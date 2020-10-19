import * as R from 'ramda';
import { Key, Time, TimeFormat } from '../../core';
import {
	Random, Euclidean,
} from '../../tools';
import * as Rhythm from '../rhythm';
import { NoteSymbol, Notevalue, ScaleName, Ticks } from '../../constants';
import { modulate, createNewEventKey } from './helpers';
import { ModulationEvent, ModulationEventType, Movement, MovementRhythm, TimelineEvent } from './types';
import { BinaryEvent } from '../../common/types';

const QUARTER = Ticks['4n'];

// TODO: ignore certain modes

/**
 * TimelineEvent Type
 * @typedef {Object} TimelineEvent
 * @memberof Types
 *
 * @property {number} time time
 * @property {number} dur duration
 * @property {Object} key key
 * @property {NoteSymbol} key.root key's root note
 * @property {ScaleIntervals} key.scale key's scale
 * @example
 * {
 * 	time: 0,
 * 	dur: 1920,
 * 	key: { root: 'Bb', scale: '1P 2M 3M 4A 5P 6M 7M' }
 * }
 */

/**
* ModulationEvent Type
* @typedef {Object} ModulationEvent
* @memberof Types
*
* @property {NoteSymbol} key key
* @property {NoteSymbol} root mode's root note
* @property {ModulationEventType} type the type of modulation
* @property {ModePosition} position mode's position in roman numbers
* @property {ScaleName} scaleName the name of the scale
* @example
* {
* 	key: "F#",
* 	position: "I",
* 	root: "F#",
* 	scaleName: "Phrygian",
* 	type: "key",
* }
*/

/**
* ModulationEventType
* @typedef {Object} ModulationEventType
* @memberof Types
* @enum
* @param {string} mode "mode"
* @param {string} key "key"
*/

/**
 * Creates a Movement
 *
 * @function createMovement
 * @memberof Composition
 * @example
 * createMovement(new Key('D', Key.MINOR), '4:0:0', 4)
 *
 * @param {Key} key starting scale
 * @param {TimeFormat} length the duration of the movement
 * @param {Number} turns turns
 * @param {Object} [opts = {}]
 * @param {MovementRhythm} [opts.rhythm = 'Euclidean'] 'euclidean' or 'turn'
 * @param {number} [opts.modProb = 0.0] modulation probability
 *
 * @return {Movement}
 */
function movement(key: Key, length: TimeFormat, turns: number, {
	modProb = 0.0,
	// repeats = 0,
	rhythm = MovementRhythm.Euclidean,
} = {}): Movement {
	const events: ModulationEvent[] = [];
	const time = new Time(length);
	const ticks = time.ticks;
	const beatsNotevalue = time.timeSignature[1];
	const MAX_TURNS = ticks / Ticks[`${beatsNotevalue}n` as Notevalue];

	let mainKey = key.root;

	// **************************************************************************
	// * PHASE: CREATE TURNS
	// **************************************************************************
	let rhythmEvents: TimelineEvent[] = [];
	const quarters: number[] = [];

	if (rhythm === MovementRhythm.Euclidean) {
		rhythmEvents = <TimelineEvent[]>Euclidean.create(MAX_TURNS, turns)
			.map((event: BinaryEvent, index) => {
				if (event === BinaryEvent.Hit) {
					const quarter = index + 1;

					quarters.push(quarter);

					return {
						time: index * QUARTER,
						dur: 0,
					};
				}
			}).filter(R.has('time'));
	} else if (rhythm === MovementRhythm.Turn) {
		rhythmEvents = <TimelineEvent[]>Rhythm.turn(time, turns, {
			minNoteValue: 8,
			combSorting: {
				diverseFirst: true,
			},
		}).map(R.pick([ 'time', 'dur' ]));
	}

	// **************************************************************************
	// * PHASE: CREATE KEY EVENTS
	// **************************************************************************
	let timeline = rhythmEvents.map((event, index) => {
		if (modProb > Random.float() && index != 0) {
			event.key = modulate(key, events);

			mainKey = key.root;
		} else {
			key.modulateMode();

			event.key = createNewEventKey(key);

			events.push({
				key: mainKey as NoteSymbol,
				root: event.key.root,
				type: ModulationEventType.Mode,
				scaleName: Key.getModeName(event.key.scale) as ScaleName,
				position: key.modePositionRoman,
			});
		}

		return event;
	});

	if (rhythm === MovementRhythm.Euclidean) {
		// **************************************************************************
		// * PHASE: ADJUST TIME (EUCLIDEAN)
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
