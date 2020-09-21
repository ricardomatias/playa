import { choose } from '../tools';
import { Note } from '../core';
import { NoteEvent } from '../core/NoteEvent';

/**
 * Generates a motif
 *
 * @function createMotif
 * @memberof Functional
 *
 * @example
 * createMotif(new Scale('A', Scale.MAJOR), Rhythm.free('1:0:0', ['4n', '8n', '16n']))
 *
 * @param {Array<Note>} notes
 * @param {Array<String>} rhythm note durations
 * @param {Number} [startTime = 0] when to start the motif
 * @return {Array<NoteEvent>}
 */
function createMotif(notes: Note[], rhythm: NoteEvent[], startTime = 0): NoteEvent[] {
	const pattern = rhythm.map((event) => {
		const note = choose(notes);

		if (event.isRest) {
			return NoteEvent({ ...event, time: event.time + startTime });
		}

		return NoteEvent({
			...event,
			time: event.time + startTime,
			note: note.n,
			midi: note.m,
		});
	});

	return pattern;
}


export default createMotif;
