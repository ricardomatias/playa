import * as R from 'ramda';
import random from './random';

/**
 * Shuffles an array N number of times
 * @function shuffle
 * @memberof Tools
 *
 * @template T
 * @param {Array<T>} list
 * @param {number} [nrOfTimes=5]
 * @return {Array<T>}
 */
export const shuffle = <T>(list: T[], nrOfTimes = 5): T[] => {
	const newList = [];
	const indexes = R.times(R.identity, list.length);

	for (let index = 0; index < nrOfTimes; index++) {
		indexes.sort(() => random.int(1, -1));
	}

	for (let index = 0; index < list.length; index++) {
		const idx = indexes[index];

		newList.push(list[idx]);
	}

	return newList;
};
