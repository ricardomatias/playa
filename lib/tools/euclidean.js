import * as R from 'ramda';
import ring from '@ricardomatias/ring';

const HIT = 'x';
const REST = '-';

/**
 * Euclidean Rhythm tool
 * @namespace Euclidean
 * @memberof Tools
 */

/**
 * Create an Euclidean rhythm based on Bresenham's line algorithm
 * @function create
 * @memberof Tools.Euclidean
 *
 * @param {Number} pulses larger number
 * @param {Number} beats smaller number
 * @return {Array}
 */
const create = (pulses, beats) => {
	const slope = beats / pulses;
	const result = [];
	let previous;

	for (let index = 0; index < pulses; index++) {
		const current = Math.floor(index * slope);

		result.push(current != previous ? HIT : REST);

		previous = current;
	}

	return result;
};

/**
 * Rotates an euclidean pattern
 * @function rotate
 * @memberof Tools.Euclidean
 *
 * @param {Array} pattern
 * @return {Array}
 */
const rotate = (pattern) => {
	const rotatedPattern = [];
	const lastHit = R.lastIndexOf(HIT, pattern);

	const patt = ring(pattern);

	for (let index = 0; index < pattern.length; index++) {
		const elem = patt[lastHit + index];

		rotatedPattern.push(elem);
	}

	return rotatedPattern;
};

export default {
	create,
	rotate,
};
