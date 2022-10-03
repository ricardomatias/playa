// * expandRhythm(['4n', '2n', '4n'] or Event[], '4:0:0')

import { Event, Time, TimeFormat } from '../../core';
import * as R from 'ramda';
import { concat } from './concat';

/**
 * Expands a rhythm to a new length by repeating the events
 * @function expand
 * @memberof Composition.Events
 *
 * @param {Array<Event>} pattern
 * @param {TimeFormat} length
 * @return {Array<Event>}
 */
export const expand = <T extends Event>(pattern: T[], length: TimeFormat): T[] => {
	const len = new Time(length).ticks;
	const copy = R.clone(pattern);

	const startTime = R.head(copy)?.time || 0;
	const endTime = startTime + len;
	let playhead = startTime;

	const result: T[][] = [];
	const count = pattern.length;
	let patternSlice = [];
	let index = 0;

	while (playhead < endTime) {
		const event = copy[index];

		patternSlice.push(event);

		playhead += event.dur;
		index++;
		index = index % count;

		if ((playhead > startTime && !index) || playhead >= len) {
			result.push(patternSlice);
			patternSlice = [];
		}
	}

	return concat(...result);
};
