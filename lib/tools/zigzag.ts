import ring from '@ricardomatias/ring';

/**
 * Picks an element based on the amount of steps forward and backward.
 *
 * @function zigzag
 * @memberof Tools
 * @example
 * const nextNumber = zigzag([1,2,3,4]);
 * nextNumber() => 1
 * nextNumber() => 3
 * nextNumber() => 2
 * nextNumber() => 4
 * nextNumber() => 3
 *
 * @param {Array<T>} arr
 * @param {number} [forward=2]
 * @param {number} [backward=1]
 * @return {function} () => T
 */
export const zigzag = <T>(arr: T[], forward = 2, backward = 1): (() => T) => {
	const coll = ring(arr);
	let i = 0;
	let bit = true;
	let first = true;

	return () => {
		if (first) {
			first = false;
			bit = true;
			i = 0;
			return coll[0];
		}

		if (bit) {
			i += forward;
		} else {
			i -= backward;
		}

		bit = !bit;

		return coll[i];
	};
};
