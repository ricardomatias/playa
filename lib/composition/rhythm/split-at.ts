import * as R from 'ramda';
import { Event } from '../../core/Event';
import { Time, TimeFormat } from '../../core/Time';
import { mapStartToEvent } from '../../tools';
import { isUndefined } from '../../utils/types-guards';

/**
* Splits an {@link Event} at a certain time

* @function splitAt
* @memberof Composition.Rhythm
*
* @param {Array<Event>} pattern
* @param {TimeFormat} at
* @return {Array<Array<Event>>}
*/
export const splitAt = <T extends Event>(pattern: T[], at: TimeFormat): T[][] => {
	const time = new Time(at);

	const index = R.findIndex(R.lte(time.ticks), R.map(R.prop('time'), pattern));

	const patterns = R.splitAt(index, pattern);

	const latter = R.last(patterns);

	if (isUndefined(latter)) {
		return [pattern];
	}

	const firstEventLatter = R.head(latter);

	if (isUndefined(firstEventLatter)) {
		return [pattern];
	}

	return R.adjust(1, R.map(mapStartToEvent(-firstEventLatter.time)), patterns);
};
