import * as R from 'ramda';
import ring from '@ricardomatias/ring';
import { BinaryEvent } from '../common/types';


/**
 * Euclidean Rhythm tool
 * @namespace Euclidean
 * @memberof Tools
 */

/**
 * Create an Euclidean rhythm based on Bresenham's line algorithm
 * @function create
 * @memberof Tools.Euclidean
 * @example
 * create(4, 2) => [ 1, 0, 1, 0 ]
 * create(8, 3) => [ 1, 0, 0, 1, 0, 0, 1, 0 ]
 *
 * @param {Number} pulses larger number
 * @param {Number} beats smaller number
 * @return {Array<Number>}
 */
export const create = (pulses: number, beats: number): BinaryEvent[] => {
	const slope = beats / pulses;
	const result = [];
	let previous;

	for (let index = 0; index < pulses; index++) {
		const current = Math.floor(index * slope);

		result.push(current != previous ? BinaryEvent.Hit : BinaryEvent.Rest);

		previous = current;
	}

	return result;
};


/**
 * Rotates an euclidean pattern
 * @function rotate
 * @memberof Tools.Euclidean
 * @private
 *
 * @param {Array} pattern
 * @return {Array}
 */
export const rotate = (pattern: number[]): BinaryEvent[] => {
	const rotatedPattern = [];
	const lastHit = R.lastIndexOf(BinaryEvent.Hit, pattern);

	const patt = ring(pattern);

	for (let index = 0; index < pattern.length; index++) {
		const elem = patt[lastHit + index];

		rotatedPattern.push(elem);
	}

	return rotatedPattern;
};
