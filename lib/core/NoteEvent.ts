import { Event } from './Event';


export interface NoteEvent extends Event {
	midi?: number;
	note?: string;
}

export const NoteEvent = ({ time, dur, next = time + dur, midi = -1, note = '', isRest = false }: NoteEvent): NoteEvent => {
	return Object.assign({}, {
		time, dur, next, midi, note, isRest,
	});
};
