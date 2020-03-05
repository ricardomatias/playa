import { Note, Chord, Scale } from '../core';
import { NoteEvent } from '../core/Types';
import { expandDuration } from '../tools/time';
import ring from '@ricardomatias/ring';
import Time from '../core/Time';


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
	harmonic: T, patt: number[], rhythm: string[], startTime?: string | number,
): NoteEvent[] => {
	// [ 1, 5, 4 ]
	const melody: Note[] = ring(patt.map(harmonic.noteAt.bind(harmonic)));
	const time = typeof startTime !== 'undefined' ? new Time(startTime) : new Time(0);
	const ringRhythm = ring(rhythm);

	const eventsCount = Math.max(melody.length, rhythm.length);
	const pattern = [];

	for (let idx = 0; idx < eventsCount; idx++) {
		const note = melody[idx];
		const dur = ringRhythm[idx];

		pattern.push({
			time: time.ticks,
			note: note.n,
			midi: note.m,
			dur,
		});
	}

	return expandDuration(pattern, true);
};

export default createArp;
