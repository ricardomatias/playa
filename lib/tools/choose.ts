import random from './random';
import { whilst } from '../utils';

/**
 * Choose multiple random elements from an array - no repetitions unless n > list length
 * @function chooseMany
 * @memberof Tools
 *
 * @param {Array<T>} list
 * @param {Number} n
 * @param {T} compareAgainst
 * @return {T|T[]}
 */
export const chooseMany = <T>(list: T[], n: number, compareAgainst: T | null = null): T[] => {
	let lst = [...list];
	const elems: T[] = [];

	whilst(
		() => {
			if (!lst.length) {
				lst = [...list];
			}

			const idx = random.int(lst.length - 1);

			if (compareAgainst && list[idx] === compareAgainst) {
				return;
			}

			elems.push(lst[idx]);
			lst.splice(idx, 1);
		},
		() => elems.length < n
	);

	return elems;
};

/**
 * Choose one random element from an array
 * @function choose
 * @memberof Tools
 *
 * @param {Array<T>} list
 * @param {T} compareAgainst
 * @return {T}
 */
export const choose = <T>(list: T[], compareAgainst: T | null = null): T => {
	const elems: T[] = chooseMany(list, 1, compareAgainst);

	return elems[0];
};

/**
 * Choose multiple random elements from an array with repeated elements, albeit not sequentially.
 *
 * @function chooseRepeatable
 * @memberof Tools
 *
 * @param {Array<T>} list
 * @param {Number} n
 * @return {Array<T>}
 */
export const chooseRepeatable = <T>(list: T[], n: number): T[] => {
	const elems: T[] = [];

	Array.from({ length: n }).forEach((_, i) => (i ? elems.push(choose<T>(list, elems[i - 1])) : elems.push(choose<T>(list))));

	return elems;
};
