import * as R from 'ramda';

const toF = (int) => (parseFloat(int, 10));

const sumDistribution = (probabilities) => {
	const sum = (a, b) => [ toF(a) + toF(b), toF(a) + toF(b) ];

	return R.map((float) => float.toFixed(3), R.last(R.mapAccum(sum, 0, probabilities)));
};

const descending = (k) => {
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

	return sumDistribution(probabilities);
};

const equal = (k) => {
	k = Array.isArray(k) ? k.length : k;

	const prob = (1 / k);
	const probabilities = R.repeat(prob, k);

	return sumDistribution(probabilities);
};

export default {
	sumDistribution,
	descending,
	equal,
};
