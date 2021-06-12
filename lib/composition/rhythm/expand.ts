// * expandRhythm(['4n', '2n', '4n'] or Event[], '4:0:0')

import { Event, Time, TimeFormat } from '../../core';
import * as R from 'ramda';
import { concat } from './concat';

/**
 * Expands a rhythm to a new length by repeating the events
 * @function expand
 * @memberof Composition.Rhythm
 *
 * @param {Array<Event>} pattern
 * @param {TimeFormat} length
 * @return {Array<Event>}
 */
export const expand = (pattern: Event[], length: TimeFormat): Event[] => {
	const len = new Time(length).ticks;
	const copy = R.clone(pattern);

	const startTime = R.head(copy)?.time || 0;
	let playhead = startTime;

	const result: Event[][] = [];
	const count = pattern.length;
	let patternSlice = [];
	let index = 0;

	while (playhead < len) {
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
