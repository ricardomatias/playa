import { uniq } from 'rambda';
import { randomInt } from '../tools/random';
import euclidean from '../tools/euclidean';

/**
 * typedef {Object} Drums
 * @property {Array} pattern when it's playing in Ticks
 * @property {String} subdivision in note value
 */
class Drums {} /* eslint no-unused-vars: 0 */

// STEPS:
// 32, 16, 8, 4
const STEPS = [ 32, 16, 8, 4 ];

const generateNK = (steps) => {
	const a = randomInt(steps, 1);
	const b = steps - a;

	const k = Math.min(a, b);
	const n = Math.max(a, b);

	return { n, k };
};

/**
 * @param {Number} steps [ 32, 16, 8, 4 ]
 * @param {Number} nrOfParts how many parts to return?
 *
 * @return {Drums} [pattern, subdivision]
 */
function drums(steps, nrOfParts = 1) {
	let patterns = [];

	if (STEPS.indexOf(steps) === -1) {
		throw new Error('drums only accepts [ 32, 16, 8, 4 ] steps value');
	}

	const subdivision = `${steps}n`;

	while (patterns.length < nrOfParts) {
		for (let index = 0; index < nrOfParts - patterns.length; index++) {
			const { n, k } = generateNK(steps);

			patterns.push(euclidean.create(n, k));
		}

		patterns = uniq(patterns);
	}

	return {
		patterns,
		subdivision,
	};
}

export default drums;
