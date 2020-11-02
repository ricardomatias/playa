import * as R from 'ramda';

/**
 * shifts an array N number of times
 * @function shift
 * @memberof Tools
 * @example shift([ 'A', 'C', 'E' ]) => ['E', 'A', 'C']
 *
 * @param {Array<*>} list
 * @param {number} [nrOfTimes=1]
 * @return {Array<*>}
 */
export const shift = <T>(list: T[], nrOfTimes = 1): T[] => {
	let newList = list;

	for (let index = 0; index < nrOfTimes; index++) {
		newList = R.move(-1, 0, newList);
	}

	return newList;
};
