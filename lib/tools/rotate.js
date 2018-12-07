import * as R from 'ramda';
import times from './times';

const rotate = (list, nrOfTimes = 1) => {
	let newList = list;

	times(() => R.move(-1, 0, list), nrOfTimes);

	return newList;
};

export default rotate;
