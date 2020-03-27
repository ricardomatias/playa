import TICKS from '../constants/ticks';
import { ticksToBBS, bbsToTicks } from '../tools/time';

/**
 * Notevalues | BarsBeatsSixteenths | Ticks
 */
export type TimeFormat = string | number;

export interface Time {
	ticks: number;
	t: number;
	notevalue: string;
	n: string;
	transport: string;
	bbs: string;
	valueOf: () => number;
}

/**
 * Time
 * @class
 * @memberof Core#
 *
 * @name Time
 * @param {TimeFormat} time
 *
 */
export function Time(time: TimeFormat): Readonly<Time> {
	let _ticks: number;
	let _notevalue: string;
	let _bbs: string;

	// Ticks
	if (typeof time === 'number') {
		_ticks = time;
		_notevalue = TICKS.get(time);
		_bbs = ticksToBBS(time);
	} else
	// Notevalue
	if (/n/.test(time)) {
		_notevalue = time;
		_ticks = TICKS.get(time);
		_bbs = ticksToBBS(_ticks);
	} else
	if (/:/.test(time)) {
		_bbs = time;
		_ticks = bbsToTicks(time);
		_notevalue = TICKS.get(_ticks);
	} else {
		throw new Error(`[Time] Unrecognized time format for -> ${time}`);
	}

	return Object.freeze({
		valueOf(): number {
			return _ticks;
		},

		/**
		 * Ticks time
		 * @example
		 * 480
		 *
		 * @member ticks
		 * @readonly
		 * @type {number}
		 * @memberof Core#Time#
		 */
		get ticks(): number {
			return _ticks;
		},

		/**
		 * Ticks time
		 * @alias ticks
		 * @example
		 * 480
		 *
		 * @member t
		 * @readonly
		 * @type {number}
		 * @memberof Core#Time#
		 */
		get t(): number {
			return _ticks;
		},

		/**
		 * Notevalue time
		 * @example
		 * '4n'
		 *
		 * @member notevalue
		 * @readonly
		 * @type {string}
		 * @memberof Core#Time#
		 */
		get notevalue(): string {
			return _notevalue;
		},

		/**
		 * Notevalue time
		 * @alias notevalue
		 * @example
		 * '4n'
		 *
		 * @member n
		 * @readonly
		 * @type {string}
		 * @memberof Core#Time#
		 */
		get n(): string {
			return _notevalue;
		},

		/**
		 * Bars beats sixteenths aka transport time
		 * @alias bbs
		 * @example
		 * '0:1:0'
		 *
		 * @readonly
		 * @member transport
		 * @type {string}
		 * @memberof Core#Time#
		 */
		get transport(): string {
			return _bbs;
		},

		/**
		 * Bars beats sixteenths aka transport time
		 * @example
		 * '0:1:0'
		 *
		 * @readonly
		 * @member bbs
		 * @type {string}
		 * @memberof Core#Time#
		 */
		get bbs(): string {
			return _bbs;
		},
	});
}
