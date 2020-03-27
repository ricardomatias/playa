import Random from './random';
import { whilst } from '../utils';


// const choose = (list) => {
// 	const len = list.length;
// 	const index = randomInt(len - 1);

// 	return list[index];
// };

/**
 * Choose a random element from an array
 * @function choose
 * @memberof Tools
 *
 * @param {Array<T>} list
 * @param {Number} n
 * @param {T} compareAgainst
 * @return {*}
 */
const choose = (list, n = 1, compareAgainst = null) => {
	let lst = [ ...list ];
	const elems = [];

	whilst(() => {
		if (!lst.length) {
			lst = [ ...list ];
		}

		const idx = Random.int(lst.length - 1);

		if (compareAgainst && list[idx] === compareAgainst) {
			return;
		}

		elems.push(lst[idx]);
		lst.splice(idx, 1);
	}, () => (elems.length < n));

	if (n === 1) {
		return elems[0];
	}

	return elems;
};

export default choose;
