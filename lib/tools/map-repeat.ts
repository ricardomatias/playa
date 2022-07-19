/**
 * Calls the callback N times to an array
 *
 * @function mapRepeat
 * @memberof Tools
 * @example mapRepeat(2, random.float) => [0.1, 0.5]
 *
 * @template T
 * @param {number} [nrOfTimes=1]
 * @param {Array<T>} list
 * @return {Array<T>}
 */
export const mapRepeat = <T>(nrOfTimes = 1, fn: (...args: any) => T): T[] => {
	return Array.from({ length: nrOfTimes }).map(() => fn());
};
