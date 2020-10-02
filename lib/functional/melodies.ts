import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';
import { Scale, Time as T } from '../core';
import {
	choose,
	Random,
	Rhythm,
} from '../tools';

import { Notevalue, Ticks } from '../constants';
import { createMotif } from './motif';
import { NoteEvent } from '../core/NoteEvent';
import { TimelineEvent } from './movement/types';
import { DistributionFunction, Octaves, RhythmType } from '../common/types';
import { Event } from '../core/Event';

const PRECISION = 5;

type MelodyOptions = Partial<{
	octaves: Octaves[];
	distribution: DistributionFunction;
	rhythmValues: Notevalue[];
	rhythmDurations: Notevalue[];
	minNoteValues: number[];
	restProb: number;
	dejaVuChance: number;
	rhythmType: RhythmType;
}>


export type Melody = NoteEvent[]


/**
 * Create interleaved motifs
 *
 * @function createMelodies
 * @memberof Functional
 *
 * @param {Array<Object>} timeline a movement's timeline
 * @param {Object} [options = {}]
 * @param {Function} [options.distribution = distribute.decreasing] decreasing/increasing probabilities to pick the rhythms
 * @param {number} [options.restProb = 0.0] probability of being a rest note
 * @param {number} [options.dejaVuChance = 0.5] probability of using a previous motif
 * @param {Array<Array<Number>>} [options.octaves = [ [ 4, 1 ], [ 3, 1 ] ]] [starting, number of octaves] range of octaves to map notes to
 * @param {Array<RhythmType>} [options.rhythmType = 'Free'] 'Free' or 'Turn' based rhythms
 * @param {Array<Notevalue>} [options.rhythmValues = Rhythm.Presets.Mixed] the rhythm in notevalues - f.ex [ '4n', '2n', '4nt', '2nt' ]
 * @param {Array<Notevalue>} [options.rhythmDurations = []] the duration of each chord in notevalues - f.ex [ '4n', '2n' ]
 * @param {Array<number>} [options.minNoteValues = [4, 8]] used in a 'turn' based rhythm
 *
 * @return {NoteEvent[]}
 */
export function createMelodies(
	timeline: TimelineEvent[],
	{
		rhythmValues = Rhythm.Presets.Mixed,
		rhythmDurations,
		distribution = distribute.decreasing,
		restProb = 0.0,
		dejaVuChance = 0.5,
		octaves = [ [ 4, 1 ], [ 3, 1 ] ],
		rhythmType = RhythmType.Free,
		minNoteValues = [ 4, 8 ],
	}: MelodyOptions = {},
): Melody {
	const melodies = [];
	const melodiesMap: Record<number, Array<NoteEvent[]>> = {};

	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale: scaleType, root }} = timeline[index];

		let motif;
		let rhythm: Event[] = [];

		// **************************************************************************
		// * PHASE: DEJA VU
		// **************************************************************************
		if (melodies.length && R.gt(dejaVuChance, Random.float())) {
			if (melodiesMap[dur]) {
				motif = choose(melodiesMap[dur]);
				const first = R.head(motif) as NoteEvent;

				const pattern = motif.map((event) => {
					return Object.assign({}, event, {
						time: time + event.time - first.time,
						next: time + event.next - first.time,
					});
				});

				melodies.push(pattern);

				continue;
			}
		}

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		const length = new T(dur).bbs;

		if (rhythmType === RhythmType.Free) {
			rhythm = Rhythm.free(length, rhythmValues, rhythmDurations, distribution);
		} else
		if (rhythmType === RhythmType.Turn) {
			const probabilities = distribute.decreasing(minNoteValues.length, PRECISION);
			const minNoteValue = roll(minNoteValues, probabilities, Random.float);
			const minTripleValue = Ticks[<Notevalue>`${minNoteValue}nt`];
			const turns = Random.int(Math.floor(dur / minTripleValue), 2);

			rhythm = Rhythm.turn(dur, turns, {
				minNoteValue,
				combSorting: {
					diverseFirst: true,
				},
			});
		}

		const scale = new Scale(root, scaleType, choose(octaves));

		motif = createMotif(scale.notes, rhythm, time);

		motif = R.map((event) => {
			if (R.gt(restProb, Random.float())) {
				return NoteEvent({
					...event,
					midi: -1,
					note: '',
					isRest: true,
				});
			}
			return event;
		}, motif);

		if (!melodiesMap[dur]) {
			melodiesMap[dur] = [];
		}

		melodiesMap[dur].push(motif);

		melodies.push(motif);
	}

	return R.flatten(melodies);
}

