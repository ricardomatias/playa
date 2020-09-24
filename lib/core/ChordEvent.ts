import { Event } from './Event';

export interface ChordEvent extends Event {
	chord?: number[];
	chordName?: string;
}

export function ChordEvent({ time, dur, next = time + dur, chord = [], chordName = '', isRest = false }: ChordEvent): ChordEvent {
	return Object.assign({}, {
		time, dur, next, chord, chordName, isRest,
	});
}
