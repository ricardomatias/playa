import { NoteSymbol } from '../constants';
import { Event } from './Event';

export interface NoteEvent extends Event {
	midi: number;
	note: NoteSymbol | string;
}

/**
 * NoteEvent Type
 * @typedef {Object} NoteEvent
 * @memberof Types
 * @extends Event
 *
 * @property {Number} midi midi note
 * @property {String} note note as string
 * @example
 * {
 *   dur: 480,
 *   next: 480,
 *   midi: 90,
 *   note: "F#5",
 *   time: 0,
 *   isRest: false,
 * ]
 */

export const NoteEvent = ({
	time = 0,
	dur = 0,
	next = 0,
	midi = -1,
	note = '',
	isRest = false,
}: Partial<NoteEvent>): NoteEvent => {
	return Object.assign(
		{},
		{
			time,
			dur,
			next,
			midi,
			note,
			isRest,
		}
	);
};
