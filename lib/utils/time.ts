import * as R from 'ramda';
import { Notevalue, Ticks } from '../constants';
import { Event } from '../core/Event';
import { TimeFormat } from '../core/Time';

export const toTicks = (time: TimeFormat): number => (typeof time === 'number' ? time : Ticks[time as Notevalue]);

/**
 * Calculates the duration of a motif
 * @private
 * @param {Array<Event>} motif
 * @return {number}
 */
export const calcDuration = (motif: Event[]): number => {
	const lastEvent: Event | undefined = R.last(motif);

	if (lastEvent) {
		const nextEventTime = R.prop('next', lastEvent);

		return toTicks(nextEventTime as TimeFormat);
	}

	return 0;
};
