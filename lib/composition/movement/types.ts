import { Interval, NoteSymbol, ScaleName, TurnMoves } from '../../constants';
import { GreekModeIntervals, ModePosition } from '../../constants/modes';

export const EUCLIDEAN = 'euclid';
export const TURN = 'turn';

export enum MovementRhythm {
	Euclidean = 'Euclidean',
	Turn = 'Turn'
}

export interface TimelineEventKey { root: NoteSymbol, scale: GreekModeIntervals }

export interface TimelineEvent {
	time: number;
	dur: number;
	key: TimelineEventKey;
}

export enum ModulationEventType {
	Mode = 'mode',
	Key = 'key'
}

export interface ModulationEvent {
	key: NoteSymbol;
	root: NoteSymbol;
	type: ModulationEventType;
	scaleName: ScaleName;
	position: ModePosition;
}

export type Movement = {
	timeline: TimelineEvent[];
	events: ModulationEvent[];
}

export interface Turn {
	type: TurnMoves,
	interval: typeof TurnMoves.Free | Interval | number | string
}

/**
 * @typedef {Object} Turn
 * @property {String} type '▼'
 * @property {String | Number} interval '⟷'
 * @example
 * { type: '▼', interval: '⟷' }
*/
export interface TurnEvent extends ModulationEvent {
	turn: Turn
}

export type TurnMovement = {
	timeline: TimelineEvent[];
	events: TurnEvent[];
}
