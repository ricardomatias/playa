import { Event } from './Event';

export interface ChordEvent extends Event {
	chord: number[];
	chordName: string;
}

/**
 * ChordEvent Type
 * @typedef {Object} ChordEvent
 * @memberof Types
 * @extends Event
 *
 * @property {Array<number>} chord midi notes
 * @property {string} chordName which chord it is
 * @example
 *  {
 *		chord: [ 71, 74, 78 ],
 * 		chordName: 'Bm',
 *		dur: 960,
 *		next: 960,
 *		time: 0,
 *		isRest: false,
 *	}
 */


export function ChordEvent({
	time = 0,
	dur = 0,
	next = 0,
	chord = [],
	chordName = '',
	isRest = false,
}: Partial<ChordEvent>): ChordEvent {
	return Object.assign({}, {
		time, dur, next, chord, chordName, isRest,
	});
}
