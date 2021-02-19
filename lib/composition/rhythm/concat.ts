import * as R from 'ramda';
import { Event } from '../../core';
import { mapStartToEvent } from '../../tools';
import { isUndefined } from '../../utils/types-guards';

/**
* Concats multiple rhythms ({@link Event}[]) together with the correct *time* and *next*
* @function concat
* @memberof Tools.Rhythm
*
* @param {Array<Array<Event>>} events
* @return {Array<Event>}
*/
export function concat(...events: Event[][]): Event[] {
	const start = events[0];

	if (isUndefined(start)) return [];

	let pattern = start;

	for (let index = 1; index < events.length; index++) {
		const curr = events[index];
		const start = R.last(pattern)?.next || 0;

		pattern = pattern.concat(R.map(mapStartToEvent(start), curr));
	}

	return pattern;
}
