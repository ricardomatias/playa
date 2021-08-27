import * as R from 'ramda';
import { ChordStructure, Notevalue, Ticks } from '../constants';
import { Chord, Time } from '../core';
import { roll, distribute } from '@ricardomatias/roll';
import { choose, random, Midi } from '../tools';
import * as Rhythm from './rhythm';

import { whilst, PlayaError, stripOctave, valuesToArr } from '../utils';
import { ChordEvent } from '../core/ChordEvent';
import { TimelineEvent } from './movement/types';
import { DistributionFunction, Octaves, RhythmType } from '../common/types';
import { isDefined } from '../utils/types-guards';
import { Event } from '../core/Event';
import { computeEventsNext, mapStartToEvent } from '../tools/event';

const JUMP_STYLE = 'jump';
const PRUDENT_STYLE = 'prudent';

const PRECISION = 5;

const QUARTER_TRIPLET = Ticks['4nt'];

type ChordProgressionOptions = Partial<{
	structures: ChordStructure[];
	distribution: DistributionFunction;
	octaves: Octaves[];
	startingOctave: Octaves;
	rhythmValues: Notevalue[];
	rhythmDurations: Notevalue[];
	minChordNotes: number;
	restProb: number;
	inversionProb: number;
	rhythmType: RhythmType;
}>;

export type ChordProgression = ChordEvent[];

/**
 * ChordProgression Type
 * @typedef {Array<ChordEvent>} ChordProgression
 * @memberof Types
 *
 * @example
 * [{
 *		chord: [ 71, 74, 78 ],
 * 		chordName: 'Bm',
 *		dur: 960,
 *		next: 960,
 *		isRest: false,
 *		time: 0,
 *	},
 * 		chord: [ 71, 74, 78 ],
 *		chordName: 'Bm',
 *		dur: 480,
 *		next: 1440,
 *		isRest: false,
 *		time: 960,
 *	}]
 */

/**
 * Creates a chord progression
 *
 * @function createChordProgression
 * @memberof Composition
 * @example
 * const movement = createMovement(new Key('A', Key.Major), '4:0:0', 4);
 * createChordProgression(movement.timeline);
 *
 * @param {Array<Object>} timeline a movement's timeline
 * @param {Object} [options = {}]
 * @param {Array<string>} [options.structures = Array<ChordStructure>] chord structures for the chords
 * @param {Function} [options.distribution = distribute.decreasing] decreasing/increasing probabilities to pick the rhythms
 * @param {number} [options.restProb = 0.0] probability of being a rest note
 * @param {number} [options.inversionProb = 0.0] probability of using a chord inversion
 * @param {Array<Array<number>>} [options.octaves = [ [ 3, 1 ] ]] [starting, number of octaves] range of octaves to map notes to
 * @param {Array<Number>} [options.startingOctave = [ 3, 1 ]] starting octave
 * @param {number} [options.minChordNotes = 3] minimum number of notes within a chord
 * @param {RhythmType} [options.rhythmType = 'Free'] 'free' or 'turn' based rhythms
 * @param {Array<Notevalue>} [options.rhythmValues = [ '4n', '2n', '4nt', '2nt' ]] the rhythm in notevalues - f.ex [ '4n', '2n', '4nt', '2nt' ]
 * @param {Array<Notevalue>} [options.rhythmDurations = []] the duration of each chord in notevalues - f.ex [ '4n', '2n' ]
 *
 * @return {ChordProgression} { time, dur, chord, chordName }
 */
export function createChordProgression(
	timeline: TimelineEvent[],
	{
		rhythmValues = [ '4n', '2n', '4nt', '2nt' ],
		rhythmDurations,
		structures = valuesToArr(Chord.Structures),
		distribution = distribute.decreasing,
		restProb = 0.0,
		inversionProb = 0.0,
		octaves = [ [ 3, 1 ] ],
		startingOctave = choose(octaves),
		minChordNotes = 3,
		rhythmType = RhythmType.Free,
	}: ChordProgressionOptions = {}
): ChordProgression {
	const progression = [];
	const chords = [];
	const structuresProb = distribution(structures, PRECISION);
	let chosenStyle;

	random.push();

	for (let index = 0; index < timeline.length; index++) {
		const {
			time,
			dur,
			key: { scale, root },
		} = timeline[index];
		const structure = roll(structures, structuresProb, random.float);
		const isFirstChord = index === 0;

		chosenStyle = choose([ JUMP_STYLE, PRUDENT_STYLE ]);

		const length = new Time(dur).bbs;

		let rhythm: Event[] = [];
		let pattern;

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		if (rhythmType === RhythmType.Free) {
			rhythm = Rhythm.free(length, rhythmValues, rhythmDurations, distribution);
		} else if (rhythmType === RhythmType.Turn) {
			const turns = Math.floor(dur / QUARTER_TRIPLET);

			if (turns <= 1) {
				rhythm.push(
					Event({
						dur,
					})
				);
			} else {
				rhythm = Rhythm.turn(dur, turns, {
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
		let chord: Chord;
		let notes: number[] = [];
		let chordNotes: number[] = [];

		if (chosenStyle === JUMP_STYLE) {
			chord = Chord.fromIntervals(root, scale, structure, choose(octaves));
			notes = chord.midi;
			let nrOfNotes = notes.length;

			if (isDefined(chord.structure)) {
				const str = Array.from(chord.structure);
				const lowerBound = (str.length > 1 ? choose(str) : str[0]).split(' ').length;
				nrOfNotes = random.int(lowerBound, Math.min(minChordNotes, notes.length));
			}

			chordNotes = [ R.head(notes) as number ];

			if (R.gt(inversionProb, random.float())) {
				chord.invert(random.int(R.length(chord.notes)));
			}

			try {
				whilst(
					() => {
						chordNotes.push(choose(notes));

						chordNotes = R.uniq(chordNotes);
					},
					() => chordNotes.length !== nrOfNotes
				);
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
				chord = Chord.fromIntervals(root, scale, structure, startingOctave);

				chordNotes = chord.midi;
			} else {
				const prevChord = chords[index - 1];

				chord = Chord.fromIntervals(root, scale, structure);

				chordNotes = Midi.findNearestChord(prevChord, chord.pitches.map(stripOctave), { sort: true });
			}
		}

		chords.push(chordNotes);

		// **************************************************************************
		// * PHASE: MAP CHORDS TO RHYTHM
		// **************************************************************************
		pattern = rhythm.map((event) => {
			if (event.isRest) {
				return ChordEvent({
					...mapStartToEvent(time, event),
				});
			}

			return ChordEvent({
				...mapStartToEvent(time, event),
				chord: chordNotes,
				chordName: chord.name,
			});
		});

		pattern = R.map((event) => {
			if (!event.isRest && R.gt(restProb, random.float())) {
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
	random.pop();

	return computeEventsNext(R.flatten(progression)) as ChordEvent[];
}

export default createChordProgression;
