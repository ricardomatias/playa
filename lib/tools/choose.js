import Random from './random';


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
 * @param {Array} list
 * @param {Number} n
 * @param {*} compareAgainst
 * @return {*}
 */
const choose = (list, n = 1, compareAgainst) => {
	let lst = [ ...list ];
	const elems = [];

	while (elems.length < n) {
		const idx = Random.int(lst.length - 1);

		if (compareAgainst && list[idx] === compareAgainst) {
			continue;
		}

		if (!lst.length) {
			lst = [ ...list ];
		}

		elems.push(lst[idx]);
		lst.splice(idx, 1);
	}

	if (n === 1) {
		return elems[0];
	}

	return elems;
};

export default choose;
