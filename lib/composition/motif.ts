import { choose } from '../tools';
import { Note } from '../core/Note';
import { Time, TimeFormat } from '../core/Time';
import { NoteEvent } from '../core/NoteEvent';
import { expandDuration, isEvent, mapStartToEvent } from '../tools/event';
import { Event } from '../core/Event';

/**
 * Generates a motif
 *
 * @function createMotif
 * @memberof Composition
 *
 * @example
 * createMotif(new Scale('A', Scale.MAJOR).notes, Rhythm.free('1:0:0', ['4n', '8n', '16n']))
 *
 * @param {Array<Note>} notes
 * @param {Array<String>} rhythm note durations
 * @param {TimeFormat} [startTime = 0] when to start the motif
 * @return {Array<NoteEvent>}
 */
export function createMotif(notes: Note[], rhythm: string[] | Event[], startTime: TimeFormat = 0): NoteEvent[] {
	if (!isEvent(rhythm)) {
		rhythm = expandDuration(rhythm);
	}

	const start = new Time(startTime);
	const pattern = rhythm.map((event: Event) => {
		const note = choose(notes);

		if (event.isRest) {
			return NoteEvent(mapStartToEvent(start, event));
		}

		return NoteEvent({
			...mapStartToEvent(start, event),
			note: note.n,
			midi: note.m,
		});
	});

	return pattern;
}

