const MAX_LOOPS = 1000;

const whilst = (cb, condition, { maxLoops = MAX_LOOPS } = {}) => {
	let loopCount = 0;

	while (condition()) {
		cb();

		loopCount++;

		if (loopCount > maxLoops) {
			throw new Error('whilst will continue forever..');
		}
	}
};

export default whilst;
