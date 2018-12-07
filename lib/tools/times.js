const times = (fn, nrOfTimes) => {
	for (let index = 0; index < nrOfTimes; index++) {
		fn();
	}
};

export default times;
