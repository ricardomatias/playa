const MAX_LOOPS = 1000;


/**
 * Loops till the condition seizes to be true
 * @private
 *
 * @function whilst
 * @memberof Utils
 *
 * @param {Function} fn
 * @param {Function} condition
 * @param {Object.Number} [maxLoops = 1000]
 */
const whilst = (fn, condition, { maxLoops = MAX_LOOPS } = {}) => {
	let loopCount = 0;

	while (condition()) {
		fn();

		loopCount++;

		if (loopCount > maxLoops) {
			throw new Error('whilst will continue forever..');
		}
	}
};

export default whilst;
