import { random, randomInt } from './random';

const normal = () => {
	const durations = [ '4n', '8n', '4t', '4n.', '8t', '8n.', '16n' ];
	const probabilities = [];
	const durationLen = durations.length;

	let den = 4;
	let t = 1 + (1 / (durationLen / 3));

	for (let index = 0; index < durationLen; index++) {
		const prob = t / den;

		probabilities.push(prob);

		t -= prob;
		den += 1;
	}

	return () => {
		const index = randomInt(durationLen);
		const pick = probabilities[index];

		const result = pick > random();

		return result ? durations[index] : null;
	};
};

export default {
	normal,
};
