import * as R from 'ramda';

const rotate = (list, nrOfTimes = 1) => {
	let newList = list;

	for (let index = 0; index < nrOfTimes; index++) {
		newList = R.move(0, newList.length - 1, newList);
	}

	return newList;
};

export default rotate;
