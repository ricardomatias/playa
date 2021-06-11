import random from '../tools/random';
import {whilst} from '../utils/whilst';
import * as Euclidean from '../tools/euclidean';
import { Notevalue } from '../constants/ticks';
import { BinaryEvent } from '../common/types';
import { isArray, isDefined, isUndefined } from '../utils/types-guards';
import { shift } from '../tools/shift';

// TODO: Create playa arp for drums return array

/**
 * Percussion Type
 * @typedef {Object} Percussion
 * @memberof Types
 *
 * @property {Array<String>} pattern combination of hits and rests
 * @property {String} subdivision in note value
 * @example
 * {
 *	patterns: [
	 	[ 1, 0, 1, 0 ],
	 	[ 1, 1, 0, 1, 0, 1, 0, 1 ]
 	],
 *	subdivision: '4n',
 * }
 */
export interface Percussion {
	patterns: Array<BinaryEvent[]>,
	subdivision: Notevalue
}


// STEPS:
// 32, 16, 8, 4
const STEPS = [ 32, 16, 8, 4 ];

/**
 * Creates a mixture of euclidean rhythm patterns
 * @function createPercussion
 * @memberof Composition
 * @example
 * createPercussion(4, [2, 1]) => { patterns: [ [ 1, 0, 1, 0 ], [ 1, 0, 0, 0 ] ], subdivision: '4n' }
 * createPercussion(4, [3, 3], [2, 1]) // rotates pattern 1 twice and pattern 2 once
 * createPercussion(4, [2, 1], [], [0, 2]) => { patterns: [ [ 1, 0, 1, 0 ], [ 0, 0, 1, 0 ] ], subdivision: '4n' }
 *
 * @param {Number} steps [ 32, 16, 8, 4 ]
 * @param {Number | Array<Number>} beatsPerPart Max numbers of beats per part or beats
 * @param {Array<Number>} [rotationPart = []] rotate part N times
 * @param {Array<Number> | undefined} [shiftPart] shift events one slot to the right
 *
 * @return {Percussion} [pattern, subdivision]
 */
export function createPercussion(
	steps: number,
	beatsPerPart: number | number[],
	rotationPart: number[] = [],
	shiftPart?: number[],
): Percussion {
	const patterns: Array<BinaryEvent[]> = [];

	if (!isArray(beatsPerPart)) {
		beatsPerPart = Array.from({ length: beatsPerPart }).map(() => random.int(steps));
	}

	const nrOfParts = beatsPerPart.length;

	if (STEPS.indexOf(steps) === -1) {
		throw new Error('drums only accepts [ 32, 16, 8, 4 ] steps value');
	}

	const subdivision = `${steps}n` as Notevalue;

	let maxBeatsIndex = 0;

	whilst(() => {
		const iterationLen = nrOfParts - patterns.length;

		maxBeatsIndex = Math.max(patterns.length, 0);

		for (let index = 0; index < iterationLen; index++) {
			const maxBeats = (<number[]>beatsPerPart)[maxBeatsIndex];
			const beats = maxBeats;

			patterns.push(Euclidean.create(steps, beats));

			maxBeatsIndex = patterns.length;
		}

		// TODO: when maxBeats repeats try another value for the repeating one
		// patterns = uniq(patterns);
	}, () => (patterns.length < nrOfParts), { maxLoops: 1000 });

	if (isDefined(rotationPart)) {
		for (let index = 0; index < rotationPart.length; index++) {
			const rotations = rotationPart[index];
			let patt = patterns[index];

			if (isUndefined(patt)) break;

			for (let rotIndex = 0; rotIndex < rotations; rotIndex++) {
				patt = Euclidean.rotate(patt);
			}

			patterns[index] = patt;
		}
	}

	if (isDefined(shiftPart)) {
		for (let index = 0; index < shiftPart.length; index++) {
			const n = shiftPart[index];

			if (isUndefined(patterns[index])) break;

			if (!n) continue;

			patterns[index] = shift(patterns[index], n);
		}
	}

	return {
		patterns,
		subdivision,
	};
}
