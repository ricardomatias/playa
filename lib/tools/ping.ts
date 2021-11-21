import { next } from './next';

/**
 * Alternates picking an element from 2 arrays
 * @function ping
 * @memberof Tools
 *
 * @param {Array<T>} a
 * @param {Array<T>} b
 * @param {Boolean} [reverse=true]
 * @return {function} () => T
 */
export const ping = <T>(a: T[], b: T[], reverse: boolean): (() => T) => {
	let aIdx = 0;
	let bIdx = 0;
	const nextA = next(a, reverse);
	const nextB = next(b, reverse);

	return () => {
		if (aIdx <= bIdx) {
			aIdx++;
			return nextA();
		}

		bIdx++;
		return nextB();
	};
};
