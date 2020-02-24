import Random from '../tools/random';
import whilst from '../utils/whilst';
import euclidean from '../tools/euclidean';

// TODO: Create playa arp for drums return array

/**
 * Percussion Type
 * @typedef {Object} Percussion
 * @memberof Types
 * @property {Array<String>} pattern combination of hits and rests
 * @property {String} subdivision in note value
 * @example
 * {
 *	pattern: [ 'x', '-', 'x', '-' ],
 *	subdivision: '4n',
 * }
 */

// STEPS:
// 32, 16, 8, 4
const STEPS = [ 32, 16, 8, 4 ];

/**
 * Creates a mixture of euclidean rhythm patterns
 * @function createPercussion
 * @memberof Functional
 *
 * @param {Number} steps [ 32, 16, 8, 4 ]
 * @param {Number | Array<Number>} beatsPerPart Max numbers of beats per part or beats
 *
 * @return {Percussion} [pattern, subdivision]
 */
function createPercussion(steps, beatsPerPart) {
	const patterns = [];

	if (!Array.isArray(beatsPerPart)) {
		beatsPerPart = Array.from({ length: beatsPerPart }).map(() => Random.int(steps));
	}

	const nrOfParts = beatsPerPart.length;

	if (STEPS.indexOf(steps) === -1) {
		throw new Error('drums only accepts [ 32, 16, 8, 4 ] steps value');
	}

	const subdivision = `${steps}n`;

	let maxBeatsIndex = 0;

	whilst(() => {
		const iterationLen = nrOfParts - patterns.length;

		maxBeatsIndex = Math.max(patterns.length, 0);

		for (let index = 0; index < iterationLen; index++) {
			const maxBeats = beatsPerPart[maxBeatsIndex];
			const beats = maxBeats;

			patterns.push(euclidean.create(steps, beats));

			maxBeatsIndex = patterns.length;
		}

		// TODO: when maxBeats repeats try another value for the repeating one
		// patterns = uniq(patterns);
	}, () => (patterns.length < nrOfParts), { maxLoops: 1000 });

	return {
		patterns,
		subdivision,
	};
}

export default createPercussion;
