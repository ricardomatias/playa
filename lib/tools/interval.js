import { INTERVALS } from '../constants';


/**
 * Gets an interval or several from a number of semitones
 *
 * @param {Number} semitones
 * @return {Array<String>|null}
 */
const interval = (semitones) => {
	const intervals = [];

	for (const [ interv, semit ] of INTERVALS.entries()) {
		if (semit === semitones) {
			intervals.push(interv);
		}
	}

	if (!intervals.length) {
		return null;
	}

	return intervals;
};


/**
 * Gets the semitones of an interval
 *
 * @param {String} interv
 * @return {Number|null}
 */
const semitones = (interv) => {
	if (!INTERVALS.has(interv)) {
		return null;
	}

	return INTERVALS.get(interv);
};

/**
 * Inverts the given interval
 *
 * @param {String} interv
 * @return {String|null}
 */
const invert = (interv) => {
	const semit = semitones(interv);

	if (semit > 12) {
		return null;
	}

	return interval(12 - semit);
};

/**
 * Adds two intervals together
 * @param {String} a
 * @param {String} b
 *
 * @example
 * add("3M", "3M") => 6m
 *
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const add = (a, b) => {
	if (INTERVALS.has(a) && INTERVALS.has(b)) {
		const result = semitones(a) + semitones(b);

		// Max number of semitones (also the number of USED intervals x) )
		if (result > INTERVALS.length) {
			return null;
		}

		return interval(result);
	}

	return null;
};

/**
 * Subtracts two intervals together
 * @param {String} a
 * @param {String} b
 *
 * @example
 * subtract("9m", "3m") => 7m
 *
 * @return {Number|null} How many semitones are they apart or null if not possible
 */
const subtract = (a, b) => {
	if (INTERVALS.has(a) && INTERVALS.has(b)) {
		const result = semitones(a) - semitones(b);

		// Max number of semitones (also the number of USED intervals x) )
		if (result < 0) {
			return null;
		}

		return interval(result);
	}

	return null;
};

const exists = (interval) => (INTERVALS.has(interval));

export default new Proxy(interval, {
	apply(target, thisArg, args) {
		return target(args[0]);
	},
	get(target, prop, receiver) {
		const methods = {
			add,
			subtract,
			semitones,
			invert,
			exists,
		};

		return methods[prop];
	},
});


