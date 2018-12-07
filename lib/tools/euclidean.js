import * as R from 'ramda';
import ring from './ring';

const HIT = 'x';
const REST = '-';

/**
 * Create an Euclidean rhythm based on Bresenham's line algorithm
 *
 * @param {Number} pulses larger number
 * @param {Number} beats smaller number
 * @return {Array}
 */
const create = (pulses, beats) => {
	let slope = beats / pulses;
	let result = [];
	let previous;

	for (let index = 0; index < pulses; index++) {
		let current = Math.floor(index * slope);

		result.push(current != previous ? HIT : REST);

		previous = current;
	}

	return result;
};

/**
 * Rotates an euclidean pattern
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
