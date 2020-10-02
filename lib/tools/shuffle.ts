import * as R from 'ramda';
import Random from './random';

/**
 * Shuffles an array N number of times
 * @function shuffle
 * @memberof Tools
 *
 * @param {Array<*>} list
 * @param {number} [nrOfTimes=3]
 * @return {Array<*>}
 */
const shuffle = <T>(list: T[], nrOfTimes = 3): T[] => {
	const newList = [];
	const indexes = R.times(R.identity, list.length);

	for (let index = 0; index < nrOfTimes; index++) {
		indexes.sort(() => Math.floor(Random.float() * 3 - 1));
	}

	for (let index = 0; index < list.length; index++) {
		const idx = indexes[index];

		newList.push(list[idx]);
	}

	return newList;
};

export default shuffle;
