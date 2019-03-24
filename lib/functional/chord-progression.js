import * as R from 'ramda';
import { Chord } from '../core';
import {
	choose,
	random,
	randomInt,
	distribute,
	ticksToTransport,
	mapDurations,
	generateFreeRhythm,
	generateTurnRhythm,
} from '../tools';
import { whilst, PlayaError } from '../utils';
import { TICKS } from '../constants';
import NoteType from '../core/types';

const FREE_RHYTHM = 'free';
const TURN_RHYTHM = 'turn';

/**
 * @param {Array<Object>} timeline
 * @param {Object} opts
 * @param {Object} [opts.structures]
 *
 * @return {Array<Object>} { time, dur, chord, chordName }
 */
function createChordProgression(
	timeline,
	{
		structures = Array.from(Chord.STRUCTURES.values()),
		inversionProb = 0,
		octaves = [ [ 3, 1 ] ],
		distributions = [ distribute.descending ],
		rhythmDistribution = [ '4n', '2n', '4nt', '2nt' ],
		minChordNotes = 3,
		noteType = NoteType.MIDI,
		rhythmType = FREE_RHYTHM,
	} = {}) {
	const progression = [];

	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale, root }} = timeline[index];
		const structure = choose(structures);
		const chord = new Chord({ root, type: scale, structure }, { noteType: noteType, octaves: choose(octaves) });

		if (R.gt(inversionProb, random())) {
			chord.invert();
		}

		const length = ticksToTransport(dur);

		let rhythm;
		let pattern;

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		if (rhythmType === FREE_RHYTHM) {
			rhythm = generateFreeRhythm(length, rhythmDistribution, choose(distributions));
		} else
		if (rhythmType === TURN_RHYTHM) {
			const turns = Math.floor(dur / TICKS.get('4nt'));

			if (turns <= 1) {
				rhythm = [
					{ dur },
				];
			} else {
				rhythm = generateTurnRhythm(dur, turns, {
					minNoteValue: 8,
					combSorting: {
						diverseFirst: true,
					},
				});
			}
		}

		// **************************************************************************
		// * PHASE: SELECT CHORD NOTES
		// **************************************************************************
		const notes = chord.notes;

		const nrOfNotes = randomInt(notes.length, Math.min(minChordNotes, notes.length));
		let chordNotes = [ R.head(notes) ];

		try {
			whilst(() => {
				chordNotes.push(choose(notes));

				chordNotes = R.uniq(chordNotes);
			}, () => (chordNotes.length !== nrOfNotes));
		} catch (error) {
			throw new PlayaError('Chord Progression', 'Error at Chord selection', {
				error,
				notes,
				nrOfNotes,
				chordNotes,
			});
		}

		// **************************************************************************
		// * PHASE: MAP CHORDS TO RHYTHM
		// **************************************************************************
		if (rhythmType === FREE_RHYTHM) {
			pattern = rhythm.map((duration) => {
				return {
					time: time,
					chord: chordNotes,
					chordName: chord.name,
					dur: TICKS.get(duration),
				};
			});
		} else
		if (rhythmType === TURN_RHYTHM) {
			pattern = rhythm.map((event) => {
				return {
					time,
					chord: chordNotes,
					chordName: chord.name,
					dur: event.dur,
				};
			});
		}

		progression.push(mapDurations(pattern));
	}

	return R.flatten(progression);
}

export default createChordProgression;
