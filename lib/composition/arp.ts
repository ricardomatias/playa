import ring from '@ricardomatias/ring';
import * as R from 'ramda';
import { Note, Chord, Scale, Time } from '../core';
import { NoteEvent } from '../core/NoteEvent';
import { expandDuration, mapDurations, isEvent, convertEventsToNotevalues } from '../tools/event';
import { next } from '../tools/next';
import { Event } from '../core/Event';
import { TimeFormat } from '../core/Time';
import { HarmonicShift } from '../constants';
import { parseHarmonicShift } from '../utils/harmonic';
import { distribute, random, roll } from '../tools';

// TODO: v2: snap elements to closest position (create utility)

export function genHarmonicShift(count: number): HarmonicShift[] {
	const shifts = ['', '+', '-', '++', '--'];

	return R.times(() => (roll(shifts, distribute.decreasing(shifts), random.float) + random.int(1, 7)) as HarmonicShift, count);
}

/**
 * Creates an arpeggio sequence of notes
 *
 * @function createArp
 * @memberof Composition
 *
 * @example
 * createArp(new Key('A', Key.MAJOR), [ 1, 5, 4 ], [ '4n', '8n', '2n' ])
 *
 * @param {Key|Scale|Chord} harmonic harmonic element
 * @param {HarmonicShift[]} patt note positions in terms of intervals [1,5,4] => [tonic, fifth, fourth]
 * @param {Notevalue[]} rhythm note durations
 * @param {TimeFormat} [startTime=0]
 *
 * @return {NoteEvent[]}
 */
export function createArp<T extends Scale | Chord>(
	harmonic: T,
	patt: HarmonicShift[],
	rhythm: string[] | Event[],
	startTime: TimeFormat = 0
): NoteEvent[] {
	// [ 1, 5, 4 ]
	const start = new Time(startTime);

	const melody: Note[] = ring(
		patt.map((shift) => {
			const { position, octaveShift } = parseHarmonicShift(shift);

			const midi = harmonic.noteAt(position).midi as number;

			return new Note(midi + octaveShift * 12).ensureType(harmonic.notesType);
		})
	);
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
	const arpeggio = [];

	for (let idx = 0; idx < eventsCount; idx++) {
		const note = melody[idx];
		const rhythmEvent = ringRhythm[idx];

		arpeggio.push({
			...rhythmEvent,
			note: note.pitch,
			midi: note.m,
		});
	}

	return R.map(NoteEvent, expandDuration(arpeggio, start.ticks));
}
