import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';
import { Scale } from '../core';
import {
	choose,
	Time,
	Random,
	Rhythm,
} from '../tools';

const { expandDuration, ticksToTransport } = Time;
const { free: generateFreeRhythm, turn: generateTurnRhythm, presets } = Rhythm;

import { TICKS } from '../constants';
import createMotif from './motif';

const FREE_RHYTHM = 'free';
const TURN_RHYTHM = 'turn';

const PRECISION = 5;


/**
 * Create interleaved motifs
 *
 * @function createMelodies
 * @memberof Functional
 *
 * @param {Array<Object>} timeline a movement's timeline
 * @param {Object} [options = {}]
 * @param {Array<string>} [options.rhythms = presets.mixed] notevalues to create the motifs
 * @param {Function} [options.distribution = distribute.decreasing] decreasing/increasing probabilities to pick the rhythms
 * @param {number} [options.restProb = 0.0] probability of being a rest note
 * @param {number} [options.dejaVuChance = 0.5] probability of using a previous motif
 * @param {Array<Array<Number>>} [options.octaves = [ [ 4, 1 ], [ 3, 1 ] ]] [starting, number of octaves] range of octaves to map notes to
 * @param {string} [options.rhythmType = 'free'] 'free' or 'turn' based rhythms
 * @param {Array<number>} [options.minNoteValues = [4, 8]] used in a 'turn' based rhythm
 *
 * @return {Motif}
 */
function createMelodies(
	timeline,
	{
		rhythms = presets.mixed,
		distribution = distribute.decreasing,
		restProb = 0.0,
		dejaVuChance = 0.5,
		octaves = [ [ 4, 1 ], [ 3, 1 ] ],
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
		// * PHASE: DEJA VU
		// **************************************************************************
		if (melodies.length && R.gt(dejaVuChance, Random.float())) {
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

				melodies.push(expandDuration(pattern));

				continue;
			}
		}

		// **************************************************************************
		// * PHASE: CREATE RHYTHM
		// **************************************************************************
		const length = ticksToTransport(dur);

		if (rhythmType === FREE_RHYTHM) {
			rhythm = generateFreeRhythm(length, rhythms, distribution);
		} else
		if (rhythmType === TURN_RHYTHM) {
			const probabilities = distribute.decreasing(minNoteValues.length, PRECISION);
			const minNoteValue = roll(minNoteValues, probabilities, Random.float);
			const turns = Random.int(Math.floor(dur / TICKS.get(`${minNoteValue}nt`)), 2);

			rhythm = generateTurnRhythm(dur, turns, {
				minNoteValue,
				combSorting: {
					diverseFirst: true,
				},
			}).map((event) => (TICKS.get(event.dur)));
		}

		const scale = new Scale(root, scaleType, choose(octaves));

		motif = createMotif(scale.notes, rhythm, time);

		motif = R.map((event) => {
			if (R.gt(restProb, Random.float())) {
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
