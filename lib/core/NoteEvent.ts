export interface NoteEvent {
	time: number;
	dur: number;
	next: number;
	midi?: number;
	note?: string;
	isRest?: boolean;
}

export function NoteEvent({ dur, next = dur, midi = -1, note = '', time, isRest = false }: NoteEvent): NoteEvent {
	return Object.assign({}, {
		time, dur, next, midi, note, isRest,
	});
}
