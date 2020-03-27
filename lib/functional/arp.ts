import * as R from 'ramda';
import { Note, Chord, Scale, Time } from '../core';
import { NoteEvent } from '../core/NoteEvent';
import { expandDuration } from '../tools/time';
import ring from '@ricardomatias/ring';
import { next } from '../tools/next';


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
 * @param {Scale|Chord} harmonic harmonic element
 * @param {number[]} patt note positions in terms of intervals [1,5,4] => [tonic, fifth, fourth]
 * @param {string[]} rhythm note durations
 * @param {(string | number)} [startTime=0]
 *
 * @return {Motif}
 */
const createArp = <T extends Scale | Chord>(
	harmonic: T, patt: number[], rhythm: string[], startTime: string | number = 0,
): NoteEvent[] => {
	// [ 1, 5, 4 ]
	const melody: Note[] = ring(patt.map(harmonic.noteAt.bind(harmonic)));
	const time = Time(startTime);

	const eventsCount = Math.max(melody.length, rhythm.length);

	if (rhythm.length < melody.length) {
		const nextRhy = next(rhythm);

		rhythm = R.times(nextRhy, eventsCount);
	}

	const ringRhythm = typeof rhythm[0] === 'string' ? ring(expandDuration(rhythm)) : ring(rhythm);

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

	return pattern.map((event) => NoteEvent({
		...event,
		time: event.time + time.ticks,
	}));
};

export default createArp;
