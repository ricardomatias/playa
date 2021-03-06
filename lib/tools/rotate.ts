import * as R from 'ramda';

/**
 * Rotates an array N number of times
 * @function rotate
 * @memberof Tools
 * @example rotate([ 'A', 'C', 'E' ]) => ['C', 'E', 'A]
 *
 * @param {Array<*>} list
 * @param {number} [nrOfTimes=1]
 * @return {Array<*>}
 */
export const rotate = <T>(list: T[], nrOfTimes = 1): T[] => {
	let newList = list;

	for (let index = 0; index < nrOfTimes; index++) {
		newList = R.move(0, newList.length - 1, newList);
	}

	return newList;
};
