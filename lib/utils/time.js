import * as R from 'ramda';
import { TICKS } from '../constants';

/**
 * Calculates the duration of a motif
 * @private
 * @param {Motif} motif
 * @return {number}
 */
export const calcDuration = (motif) => {
	const lastEvent = R.last(motif);
	let lastDur = R.prop('next', lastEvent) || R.prop('dur', lastEvent);

	lastDur = typeof lastDur === 'number' ? lastDur : TICKS.get(lastDur);

	return R.prop('time', lastEvent) + lastDur;
};
