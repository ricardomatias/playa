import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';
import {
	choose,
	ticksToTransport,
	random,
	randomInt,
	mapDurations,
	generateFreeRhythm,
	generateTurnRhythm,
} from '../tools';
import { RHYTHMS_DISTRIBUTIONS, TICKS } from '../constants';
import createMotif from './motif';
import createScale from './scale';

const FREE_RHYTHM = 'free';
const TURN_RHYTHM = 'turn';

/**
 * Melody Type
 * @typedef {Object} Melody
 * @memberof Types
 * @property {Number} dur duration in ticks
 * @property {Number} midi midi note
 * @property {String} note note as string
 * @property {Number} time transport time in ticks
 * @example
 * {
 *   "dur": 480,
 *   "midi": 90,
 *   "note": "F#5",
 *   "time": 0,
 * }
 */

/**
 * Create interleaved motifs
 *
 * @function createMelodies
 * @memberof Functional
 *
 * @param {Array<Object>} timeline
 * @param {Array<Object>} motifTypes
 * @param {Number} restProb
 *
 * @return {Array<Melody>}
 */
function createMelodies(
	timeline,
	{
		rhythms = [ RHYTHMS_DISTRIBUTIONS.mixed ],
		distributions = [ distribute.decreasing ],
		restProb = 0,
		octaves = [ [ 4, 1 ], [ 3, 1 ] ],
		dejaVuChange = 0.5,
		rhythmType = FREE_RHYTHM,
		minNoteValues = [ 4, 8 ],
	} = {},
) {
	const melodies = [];
	const melodiesMap = {};

	for (let index = 0; index < timeline.length; index++) {
		const { time, dur, key: { scale: scaleType, root }} = timeline[index];

		let motif;
		let rhythm;

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		if (melodies.length && R.gt(dejaVuChange, random())) {
			if (melodiesMap[dur]) {
				motif = choose(melodiesMap[dur]);

				const pattern = motif.map((event) => {
					return {
						time: time,
						note: event.note,
						midi: event.midi,
						dur: event.dur,
					};
				});

				melodies.push(mapDurations(pattern));

				continue;
			}
		}

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		const length = ticksToTransport(dur);

		if (rhythmType === FREE_RHYTHM) {
			rhythm = generateFreeRhythm(length, choose(rhythms), choose(distributions));
		} else
		if (rhythmType === TURN_RHYTHM) {
			const probabilities = distribute.decreasing(minNoteValues.length);
			const minNoteValue = roll(minNoteValues, probabilities, random);
			const turns = randomInt(Math.floor(dur / TICKS.get(`${minNoteValue}nt`)), 2);

			rhythm = generateTurnRhythm(dur, turns, {
				minNoteValue,
				combSorting: {
					diverseFirst: true,
				},
			}).map((event) => (TICKS.get(event.dur)));
		}

		const scale = createScale(root, scaleType, choose(octaves));

		motif = createMotif(scale.notes, rhythm, time, { mapToTicks: true });

		motif = R.map((event) => {
			if (R.gt(restProb, random())) {
				return {
					time: event.time,
					dur: event.dur,
					midi: 0,
					note: '-',
				};
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

export default createMelodies;
