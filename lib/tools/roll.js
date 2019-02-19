import { random } from './random';

/**
 * * Works with @distribute
 *
 * @param {Array} elements
 * @param {Array<Number>} probabilities
 * @return {Object|Null}
 */
const roll = (elements, probabilities) => {
	const result = random().toFixed(3);
	let element;

	for (let index = 0; index < probabilities.length; index++) {
		const prob = probabilities[index];

		if (parseFloat(result, 10) <= parseFloat(prob, 10)) {
			element = elements[index];

			break;
		}
	}

	return element;
};

export default roll;
