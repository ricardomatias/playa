import * as R from 'ramda';
import { Chord } from '../core';
import { roll, distribute } from '@ricardomatias/roll';
import {
	choose,
	Rhythm,
	Random,
	Time,
	Midi,
} from '../tools';

const { ticksToTransport, expandDuration } = Time;
const { free: generateFreeRhythm, turn: generateTurnRhythm } = Rhythm;
const { findNearestChord } = Midi;

import { whilst, PlayaError, stripOctave } from '../utils';
import { TICKS } from '../constants';

const FREE_RHYTHM = 'free';
const TURN_RHYTHM = 'turn';

const JUMP_STYLE = 'jump';
const PRUDENT_STYLE = 'prudent';

const PRECISION = 5;

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
 * @param {Array<Object>} timeline a movement's timeline
 * @param {Object} [options = {}]
 * @param {Array<string>} [options.structures = Chord.STRUCTURES] chord structures for the chords
 * @param {Function} [options.distribution = distribute.decreasing] decreasing/increasing probabilities to pick the rhythms
 * @param {number} [options.restProb = 0.0] probability of being a rest note
 * @param {number} [options.inversionProb = 0.0] probability of using a chord inversion
 * @param {Array<Array<Number>>} [options.octaves = [ [ 3, 1 ] ]] [starting, number of octaves] range of octaves to map notes to
 * @param {Array<Number>} [options.startingOctave = [ 3, 1 ]] starting octave
 * @param {number} [options.minChordNotes = 3] minimum number of notes within a chord
 * @param {string} [options.rhythmType = 'free'] 'free' or 'turn' based rhythms
 *
 * @return {Array<Object>} { time, dur, chord, chordName }
 */
function createChordProgression(
	timeline,
	{
		structures = Array.from(Chord.STRUCTURES.values()),
		distribution = distribute.decreasing,
		restProb = 0.0,
		inversionProb = 0.0,
		octaves = [ [ 3, 1 ] ],
		startingOctave = choose(octaves),
		rhythms = [ '4n', '2n', '4nt', '2nt' ],
		minChordNotes = 3,
		rhythmType = FREE_RHYTHM,
	} = {}) {
	const progression = [];
	const chords = [];
	const structuresProb = distribution(structures, PRECISION);
	let chosenStyle;

	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale, root }} = timeline[index];
		const structure = roll(structures, structuresProb, Random.float);
		const isFirstChord = index === 0;

		chosenStyle = choose([ JUMP_STYLE, PRUDENT_STYLE ]);

		const length = ticksToTransport(dur);

		let rhythm;
		let pattern;

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		if (rhythmType === FREE_RHYTHM) {
			rhythm = generateFreeRhythm(length, rhythms, distribution);
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
			chord = new Chord({ root, type: scale, structure }, choose(octaves));
			notes = chord.midi;

			const nrOfNotes = Random.int(notes.length, Math.min(minChordNotes, notes.length));

			chordNotes = [ R.head(notes) ];

			if (R.gt(inversionProb, Random.float())) {
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
				chord = new Chord({ root, type: scale, structure }, startingOctave);

				chordNotes = chord.midi;
			} else {
				const prevChord = chords[index - 1];

				chord = new Chord({ root, type: scale, structure });

				chordNotes = findNearestChord(prevChord, chord.string.map(stripOctave));
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

		pattern = expandDuration(pattern);

		pattern = R.map((event) => {
			if (R.gt(restProb, Random.float())) {
				return {
					time,
					chord: [],
					chordName: '',
					dur: event.dur,
				};
			}
			return event;
		}, pattern);

		progression.push(pattern);
	}

	return R.flatten(progression);
}

export default createChordProgression;
