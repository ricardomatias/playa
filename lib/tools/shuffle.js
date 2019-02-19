import * as R from 'ramda';
import { random } from './random';

const shuffle = (list, nrOfTimes = 3) => {
	const newList = [];
	let indexes = R.times(R.identity, list.length);

	for (let index = 0; index < nrOfTimes; index++) {
		indexes.sort(() => Math.floor(random() * 3 - 1));
	}

	for (let index = 0; index < list.length; index++) {
		const idx = indexes[index];

		newList.push(list[idx]);
	}

	return newList;
};

export default shuffle;
