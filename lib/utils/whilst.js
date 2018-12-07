const MAX_LOOPS = 1000;

const whilst = (cb, condition) => {
	let loopCount = 0;

	while (condition()) {
		cb();

		loopCount++;

		if (loopCount > MAX_LOOPS) {
			throw new Error('whilst will continue forever..');
		}
	}
};

export default whilst;
