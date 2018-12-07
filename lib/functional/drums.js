import { uniq } from 'ramda';
import { randomInt } from '../tools/random';
import whilst from '../utils/whilst';
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

/**
 * @param {Number} steps [ 32, 16, 8, 4 ]
 * @param {Number} maxBeatsPerPart Max numbers of beats per part
 * @param {Boolean} randomBeats Have random beats
 *
 * @return {Drums} [pattern, subdivision]
 */
function drums(steps, maxBeatsPerPart = [], randomBeats) {
	let patterns = [];
	const nrOfParts = maxBeatsPerPart.length;

	if (STEPS.indexOf(steps) === -1) {
		throw new Error('drums only accepts [ 32, 16, 8, 4 ] steps value');
	}

	const subdivision = `${steps}n`;

	let maxBeatsIndex = 0;

	whilst(() => {
		const iterationLen = nrOfParts - patterns.length;

		maxBeatsIndex = Math.max(patterns.length, 0);

		for (let index = 0; index < iterationLen; index++) {
			const maxBeats = maxBeatsPerPart[maxBeatsIndex];
			const beats = randomBeats ? randomInt(maxBeats, 1) : maxBeats;

			patterns.push(euclidean.create(steps, beats));

			maxBeatsIndex = patterns.length;
		}

		patterns = uniq(patterns);
	}, () => (patterns.length < nrOfParts));

	return {
		patterns,
		subdivision,
	};
}

export default drums;
