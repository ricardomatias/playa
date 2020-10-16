import * as R from 'ramda';
import { Note, Chord, Scale, Time } from '../core';
import { NoteEvent } from '../core/NoteEvent';
import { expandDuration, mapDurations, isEvent, convertEventsToNotevalues } from '../tools/event';
import ring from '@ricardomatias/ring';
import { next } from '../tools/next';
import { Event } from '../core/Event';
import { TimeFormat } from '../core/Time';


// TODO: v2: snap elements to closest position (create utility)

/**
 * Creates an arpeggio sequence of notes
 *
 * @function createArp
 * @memberof Functional
 *
 * @example
 * createArp(new Key('A', Key.MAJOR), [ 1, 5, 4 ], [ '4n', '8n', '2n' ])
 *
 * @param {Key|Scale|Chord} harmonic harmonic element
 * @param {number[]} patt note positions in terms of intervals [1,5,4] => [tonic, fifth, fourth]
 * @param {string[]} rhythm note durations
 * @param {TimeFormat} [startTime=0]
 *
 * @return {NoteEvent[]}
 */
export function createArp<T extends Scale | Chord>(
	harmonic: T, patt: number[], rhythm: string[] | Event[], startTime: TimeFormat = 0,
): NoteEvent[] {
	// [ 1, 5, 4 ]
	const melody: Note[] = ring(patt.map(harmonic.noteAt.bind(harmonic)));
	const start = new Time(startTime);

	const eventsCount = Math.max(melody.length, rhythm.length);


	if (isEvent(rhythm)) {
		rhythm = R.compose(mapDurations, convertEventsToNotevalues)(rhythm);
	} else {
		rhythm = mapDurations(rhythm);
	}

	if (rhythm.length < melody.length) {
		const nextRhy = next(rhythm);

		rhythm = R.times(nextRhy, eventsCount);
	}

	const ringRhythm = ring(rhythm);
	const pattern = [];

	for (let idx = 0; idx < eventsCount; idx++) {
		const note = melody[idx];
		const rhythmEvent = ringRhythm[idx];

		pattern.push({
			...rhythmEvent,
			note: note.n,
			midi: note.m,
		});
	}

	return R.map(NoteEvent, expandDuration(pattern, start.ticks));
}
