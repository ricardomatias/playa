import * as R from 'ramda';
import { Event } from '../../core';
import { expandDuration } from '../../tools/event';
import { isUndefined } from '../../utils/types-guards';

/**
 * Rhythm tools
 * @namespace Events
 * @memberof Composition
 */

/**
 * Concats multiple rhythms ({@link Event}[]) together with the correct *time* and *next*
 * @function concat
 * @memberof Composition.Events
 *
 * @param {Array<Array<Event>>} events
 * @return {Array<Event>}
 */
export function concat<T extends Event>(...events: T[][]): T[] {
	const start = events[0];

	if (isUndefined(start)) return [];

	let pattern = start;

	for (let index = 1; index < events.length; index++) {
		const curr = events[index];
		const rhythm = curr.map(({ dur }) => Event({ dur }));
		const next = R.last(pattern)?.next || 0;

		pattern = pattern.concat(
			expandDuration(rhythm, next).map(({ time, next }, idx) => {
				return Object.assign({}, curr[idx], { time, next });
			})
		);
	}

	return pattern;
}
