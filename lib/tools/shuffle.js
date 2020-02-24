import * as R from 'ramda';
import { random } from './random';

/**
 * Shuffles an array N number of times
 * @function shuffle
 * @memberof Tools
 *
 * @param {Array<*>} list
 * @param {number} [nrOfTimes=3]
 * @return {Array<*>}
 */
const shuffle = (list, nrOfTimes = 3) => {
	const newList = [];
	const indexes = R.times(R.identity, list.length);

	for (let index = 0; index < nrOfTimes; index++) {
		indexes.sort(() => Math.floor(random(100.0, 10.0) * 3 - 1));
	}

	for (let index = 0; index < list.length; index++) {
		const idx = indexes[index];

		newList.push(list[idx]);
	}

	return newList;
};

export default shuffle;
