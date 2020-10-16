import { choose } from '../tools';
import { Note, Time } from '../core';
import { NoteEvent } from '../core/NoteEvent';
import { expandDuration, isEvent, mapStartToEvent } from '../tools/event';
import { Event } from '../core/Event';
import { TimeFormat } from '../core/Time';

/**
 * Generates a motif
 *
 * @function createMotif
 * @memberof Functional
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
			return NoteEvent(mapStartToEvent(event, start));
		}

		return NoteEvent({
			...mapStartToEvent(event, start),
			note: note.n,
			midi: note.m,
		});
	});

	return pattern;
}

