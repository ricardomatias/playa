import * as R from 'ramda';

const toF = (int) => (parseFloat(int, 10));

/**
 * Distribute tools
 * @namespace Distribute
 * @memberof Tools
 */

/**
 * Sum probabilities together
 * @function sumDistribution
 * @memberof Tools.Distribute
 *
 * @param {Array<Number>} probabilities
 * @param {Number} [precision = 3]
 * @return {Array<String>}
 */
const sumDistribution = (probabilities, precision = 3) => {
	const sum = (a, b) => [ toF(a) + toF(b), toF(a) + toF(b) ];

	return R.map((float) => float.toFixed(precision), R.last(R.mapAccum(sum, 0, probabilities)));
};

/**
 * Creates a descending probability distribution
 * @function descending
 * @memberof Tools.Distribute
 *
 * @param {Number|Array<Number>} k
 * @param {Number} precision
 * @return {Array<String>}
 */
const descending = (k, precision) => {
	k = Array.isArray(k) ? k.length : k;

	const probabilities = [];

	let den = 4;
	let t = 1 + (1 / (k / 3));

	for (let index = 0; index < k; index++) {
		const prob = t / den;

		probabilities.push(prob);

		t -= prob;
		den += 1;
	}

	return sumDistribution(probabilities, precision);
};

/**
 * Creates an equal probability distribution
 *
 * @function equal
 * @memberof Tools.Distribute
 *
 * @param {Number|Array<Number>} k
 * @param {Number} precision
 * @return {Array<String>}
 */
const equal = (k, precision) => {
	k = Array.isArray(k) ? k.length : k;

	const prob = (1 / k);
	const probabilities = R.repeat(prob, k);

	return sumDistribution(probabilities, precision);
};

export default {
	sumDistribution,
	descending,
	equal,
};
