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
	findNearestChord,
	roll,
} from '../tools';
import { whilst, PlayaError, stripOctave } from '../utils';
import { TICKS } from '../constants';
import NoteType from '../core/types';

const FREE_RHYTHM = 'free';
const TURN_RHYTHM = 'turn';

const JUMP_STYLE = 'jump';
const PRUDENT_STYLE = 'prudent';

/**
 * Creates a chord progression
 *
 * @function createChordProgression
 * @memberof Functional
 * @example
 * [{
 *		"chord": [ 71, 74, 78 ],
 * 		"chordName": "Bm",
 *		"dur": 960,
 *		"time": 0,
 *	},
 * 		"chord": [ 71, 74, 78 ],
 *		"chordName": "Bm",
 *		"dur": 480,
 *		"time": 960,
 *	}]
 *
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
		startingOctave = [ 3, 1 ],
		distributions = [ distribute.descending ],
		rhythmDistribution = [ '4n', '2n', '4nt', '2nt' ],
		minChordNotes = 3,
		noteType = NoteType.MIDI,
		rhythmType = FREE_RHYTHM,
		style,
	} = {}) {
	const progression = [];
	const chords = [];
	const structuresProb = distribute.descending(structures);
	let chosenStyle;

	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale, root }} = timeline[index];
		const structure = roll(structures, structuresProb);
		const isFirstChord = index === 0;

		chosenStyle = choose([ JUMP_STYLE, PRUDENT_STYLE ]);

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
		let chord;
		let notes = [];
		let chordNotes = [];

		if (chosenStyle === JUMP_STYLE) {
			chord = new Chord({ root, type: scale, structure }, { octaves: choose(octaves) });
			notes = chord.notes;

			const nrOfNotes = randomInt(notes.length, Math.min(minChordNotes, notes.length));

			chordNotes = [ R.head(notes) ];

			if (R.gt(inversionProb, random())) {
				chord.invert();
			}

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
		}

		if (chosenStyle === PRUDENT_STYLE) {
			if (isFirstChord) {
				chord = new Chord({ root, type: scale, structure }, { octaves: startingOctave });

				chordNotes = chord.notes;
			} else {
				const prevChord = chords[index - 1];

				chord = new Chord({ root, type: scale, structure }, { noteType: NoteType.STR });

				chordNotes = findNearestChord(prevChord, chord.notes.map(stripOctave));
			}
		}

		chords.push(chordNotes);

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
