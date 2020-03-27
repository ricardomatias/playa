import * as R from 'ramda';
import { Chord, Time as T } from '../core';
import { roll, distribute } from '@ricardomatias/roll';
import {
	choose,
	Rhythm,
	Random,
	Time,
	Midi,
} from '../tools';

const { expandDuration } = Time;
const { free: generateFreeRhythm, turn: generateTurnRhythm } = Rhythm;
const { findNearestChord } = Midi;

import { whilst, PlayaError, stripOctave } from '../utils';
import { ChordEvent } from '../core/ChordEvent';

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
 * const movement = createMovement(new Key('A', Key.MAJOR), '4:0:0', 4);
 * createChordProgression(movement.timeline);
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
 * @return {ChordProgression} { time, dur, chord, chordName }
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
		rhythmValues = [ '4n', '2n', '4nt', '2nt' ],
		rhythmDurations = null,
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

		const length = T(dur).bbs;

		let rhythm;
		let pattern;

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		if (rhythmType === FREE_RHYTHM) {
			if (!rhythmDurations) {
				const count = Math.floor(R.length(rhythmValues) / 2) || 1;

				rhythmDurations = R.map(R.compose(R.prop('ticks'), T), rhythmValues);

				rhythmDurations = R.take(count, R.sortBy(Math.min, rhythmDurations));
			}

			rhythm = generateFreeRhythm(length, rhythmValues, rhythmDurations, distribution);
		} else
		if (rhythmType === TURN_RHYTHM) {
			const turns = Math.floor(dur / T('4nt'));

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

			rhythm = expandDuration(rhythm);
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

			const nrOfNotes = Random.int(chord.structure[0], Math.min(minChordNotes, notes.length));

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
		pattern = rhythm.map((event) => {
			if (event.isRest) {
				return ChordEvent({
					...event,
					time,
				});
			}

			return ChordEvent({
				...event,
				time,
				chord: chordNotes,
				chordName: chord.name,
			});
		});

		pattern = expandDuration(pattern);

		pattern = R.map((event) => {
			if (R.gt(restProb, Random.float())) {
				return ChordEvent({
					...event,
					isRest: true,
					chord: [],
					chordName: '',
				});
			}
			return event;
		}, pattern);

		progression.push(pattern);
	}

	return R.flatten(progression);
}

export default createChordProgression;
