import { flatten, lastIndexOf } from 'ramda';
import ring from './ring';

const HIT = 'x';
const REST = '-';

/**
 * Create an Euclidean rhythm
 *
 * @param {Number} n larger number
 * @param {Number} k smaller number
 * @param {Array} pattern
 * @return {Array}
 */
const create = (n, k, pattern) => {
	if (!n || (pattern && pattern.length === 3)) {
		return flatten(pattern);
	}

	if (!pattern) {
		pattern = [];

		for (let index = 0; index < n + k; index++) {
			pattern.push(k > index ? [ HIT ] : REST);
		}
	}

	for (let index = 0; index < Math.max(k, 2); index++) {
		const elem = pattern[index];

		if (Array.isArray(elem)) {
			const lastElem = pattern.splice(pattern.length - 1)[0];

			if (Array.isArray(lastElem)) {
				pattern[index] = elem.concat(lastElem);
			} else {
				elem.push(lastElem);
			}
		}
	}

	return create(k, n % k, pattern);
};

/**
 * Rotates an euclidean pattern
 *
 * @param {Array} pattern
 * @return {Array}
 */
const rotate = (pattern) => {
	const rotatedPattern = [];
	const lastHit = lastIndexOf(HIT, pattern);

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
