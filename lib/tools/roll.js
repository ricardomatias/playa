import { randomInt, random } from './random';

const roll = (elements, probabilities) => {
	const index = randomInt(elements.length - 1);
	const pick = probabilities[index];

	const result = pick > random();

	return result ? elements[index] : null;
};

export default roll;
