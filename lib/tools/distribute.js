import * as R from 'ramda';
import { random, randomInt } from './random';

const descending = (elements) => {
	const probabilities = [];
	const elementsLen = elements.length;

	let den = 4;
	let t = 1 + (1 / (elementsLen / 3));

	for (let index = 0; index < elementsLen; index++) {
		const prob = t / den;

		probabilities.push(prob);

		t -= prob;
		den += 1;
	}

	return () => {
		const index = randomInt(elementsLen - 1);
		const pick = probabilities[index];

		const result = pick > random();

		return result ? elements[index] : null;
	};
};

const equal = (elements) => {
	const elementsLen = elements.length;
	const probabilities = R.repeat(0.5, elementsLen);

	return () => {
		const index = randomInt(elementsLen);
		const pick = probabilities[index];

		const result = pick > random();

		return result ? elements[index] : null;
	};
};

export default {
	descending,
	equal,
};
