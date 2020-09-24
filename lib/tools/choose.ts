import Random from './random';
import { whilst } from '../utils';


/**
 * Choose multiple random elements from an array
 * @function chooseMany
 * @memberof Tools
 *
 * @param {Array<T>} list
 * @param {Number} n
 * @param {T} compareAgainst
 * @return {T|T[]}
 */
export const chooseMany = <T>(list: T[], n: number, compareAgainst = null): T[] => {
	let lst = [ ...list ];
	const elems: T[] = [];

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

	return elems;
};


/**
 * Choose a random element from an array
 * @function choose
 * @memberof Tools
 *
 * @param {Array<T>} list
 * @param {T} compareAgainst
 * @return {T}
 */
export const choose = <T>(list: T[], compareAgainst = null): T => {
	const elems: T[] = chooseMany(list, 1, compareAgainst);

	return elems[0];
};

