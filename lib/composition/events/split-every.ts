import * as R from 'ramda';
import { Event } from '../../core/Event';
import { Time, TimeFormat } from '../../core/Time';
import { splitAt } from './split-at';

/**
 * Splits an {@link Event} array every interval of time
 * @example
 * //! The following example is just using notevalues to simplify it.
 * //! This code won't work unless you convert the notevalues to an Event array (via Tools.expandDuration f.ex)
 * splitEvery(['4n', '4n', '4n', '4n'], '4n') => [['4n'], ['4n'], ['4n'], ['4n']]
 *
 * @function splitEvery
 * @memberof Composition.Events
 *
 * @param {Array<Event>} pattern
 * @param {TimeFormat} interval
 * @param {boolean} adjustRestTime will adjust the timing of the rest to begin from 0
 * @return {Array<Array<Event>>}
 */
export const splitEvery = <T extends Event>(pattern: T[], interval: TimeFormat, adjustRestTime = false): T[][] => {
	if (R.isEmpty(pattern)) return [];

	const t = new Time(interval);
	const last = pattern[pattern.length - 1];
	const totalDuration = new Time(last.next);
	let playhead = t.ticks;
	let patt: T[] = pattern.slice();
	const events: T[][] = [];

	while (playhead <= totalDuration.ticks) {
		const [first, rest] = splitAt(patt, playhead, adjustRestTime);

		const payload = R.isEmpty(first) ? rest : first;

		events.push(payload);

		patt = rest;
		playhead += t.ticks;
	}

	return events;
};

/**
 * Same as {@link Composition.Events.splitEvery} but it returns the indices
 *
 * @function splitEveryIndices
 * @memberof Composition.Events
 *
 * @param {Array<Event>} pattern
 * @param {TimeFormat} interval
 * @return {Array<Array<number>>}
 */
export const splitEveryIndices = <T extends Event>(pattern: T[], interval: TimeFormat): number[][] => {
	const split = splitEvery<T>(pattern, interval);

	return split.map((bracket) => {
		return bracket.map((event) => R.indexOf(event, pattern));
	});
};
