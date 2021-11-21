/**
 * Returns the next element in a collection
 * It wraps-around at the end or grabs in reverse
 *
 * @function next
 * @memberof Tools
 * @example
 * const nextNumber = next([1,2,3,4]);
 * nextNumber() => 1
 * nextNumber() => 2
 * nextNumber() => 3
 * nextNumber() => 4
 * nextNumber() => 1
 *
 * @param {Array<T>} arr
 * @param {Boolean} [alternate=true]
 * @return {function} () => T
 */
export const next = <T>(arr: T[], alternate = false): (() => T) => {
	const maxIdx = arr.length - 1;
	let idx = 0;
	let dir = 1;

	return () => {
		if (alternate) {
			if (idx >= maxIdx || (idx <= 0 && dir < 0)) {
				dir *= -1.0;
			}
		} else {
			if (idx > maxIdx) idx = 0;
		}

		const elem = arr[idx];

		idx += dir;

		return elem;
	};
};
