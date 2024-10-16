/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as R from 'ramda';
import { Event } from '../../core/Event';
import { Time, TimeFormat } from '../../core/Time';
import { mapStartToEvent } from '../../tools';
import { isUndefined } from '../../utils/types-guards';

/**
* Splits an {@link Event} at a certain time

* @function splitAt
* @memberof Composition.Events
*
* @param {Array<Event>} pattern
* @param {TimeFormat} at
* @param {boolean} adjustRestTime will adjust the timing of the rest to begin from 0
* @return {Array<Array<Event>>}
*/
export const splitAt = <T extends Event>(pattern: T[], at: TimeFormat, adjustRestTime = false): T[][] => {
	const time = new Time(at);

	// const index = R.findIndex(R.lte(time.ticks), R.map(R.prop('time'), pattern));
	const index = pattern.findIndex((p) => p.time >= time.ticks);

	if (index === -1) {
		return [pattern];
	}

	const patterns = R.splitAt(index, pattern);

	const latter = R.last(patterns);

	if (isUndefined(latter)) {
		return [pattern];
	}

	const firstEventLatter = R.head(latter);

	if (isUndefined(firstEventLatter)) {
		return [pattern];
	}

	if (adjustRestTime) {
		// @ts-expect-error
		// because the time is not defined in the type
		return R.adjust(
			1,
			// @ts-expect-error
			// because the time is not defined in the type
			R.map((patt) => mapStartToEvent(-firstEventLatter.time, patt)),
			patterns
		);
	}

	return patterns;
};
