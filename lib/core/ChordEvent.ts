export interface ChordEvent {
	time: number;
	dur: number;
	next: number;
	chord?: number[];
	chordName?: string;
	isRest?: boolean;
}

export function ChordEvent({ time, dur, next = dur, chord = [], chordName = '', isRest = false }: ChordEvent): ChordEvent {
	return Object.assign({}, {
		time, dur, next, chord, chordName, isRest,
	});
}
