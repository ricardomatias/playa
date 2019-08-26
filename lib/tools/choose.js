import { randomInt } from './random';

/**
 * Choose a random element from an array
 * @function choose
 * @memberof Tools
 *
 * @param {Array} list
 * @param {String|Number} seed
 * @return {*}
 */
const choose = (list) => {
	const len = list.length;
	const index = randomInt(len - 1);

	return list[index];
};

export default choose;
