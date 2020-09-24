import TICKS from '../constants/ticks';

const QUARTER = TICKS.get('4n');

const TRANSPORT_SEP = ':';

/**
 * Notevalues | BarsBeatsSixteenths | Ticks
 */
export type TimeFormat = string | number | Time;

// export interface Time {
// 	ticks: number;
// 	t: number;
// 	notevalue: string;
// 	n: string;
// 	transport: string;
// 	bbs: string;
// 	valueOf: () => number;
// }

/**
 * Time
 * @class
 * @memberof Core#
 *
 * @name Time
 */
export class Time {
	#ticks: number;
	#notevalue: string;
	#bbs: string;

	/**
	 * Creates an instance of Time.
	 * @constructs Time
	 * @memberof Core#
	 *
 	 * @param {TimeFormat} time
	 */
	constructor(time: TimeFormat) {
		if (time instanceof Time) {
			this.#ticks = time.ticks;
			this.#notevalue = time.notevalue;
			this.#bbs = time.bbs;
		} else
		// Ticks
		if (typeof time === 'number') {
			this.#ticks = time;
			this.#notevalue = TICKS.get(time);
			this.#bbs = Time.ticksToBBS(time);
		} else
		// Notevalue
		if (/n/.test(time)) {
			this.#notevalue = time;
			this.#ticks = TICKS.get(time);
			this.#bbs = Time.ticksToBBS(this.#ticks);
		} else
		if (/:/.test(time)) {
			this.#bbs = time;
			this.#ticks = Time.bbsToTicks(time);
			this.#notevalue = TICKS.get(this.#ticks);
		} else {
			throw new Error(`[Time] Unrecognized time format for -> ${time}`);
		}
	}

	valueOf(): number {
		return this.#ticks;
	}

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
		return this.#ticks;
	}

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
		return this.#ticks;
	}

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
		return this.#notevalue;
	}

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
		return this.#notevalue;
	}

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
		return this.#bbs;
	}

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
		return this.#bbs;
	}

	/**
	 * @function bbsToTicks
	 * @memberof Core#Time
	 * @description  Converts "BARS : QUARTERS : BEATS" to ticks
	 *
	 * @param {string} time '2.3.1'
	 * @param {object} [opts = {}]
	 * @param {boolean} [opts.positionMode=false]
	 * @param {number} [opts.ppq = 480] Pulse per quarter note
	 * @return {Number}
	 */
	static bbsToTicks = (time: string, { positionMode = false, ppq = QUARTER } = {}): number => {
		try {
			const bar = ppq * 4;
			const sixteenths = ppq / 4;

			const [ bars, quarters, units ] = time.split(TRANSPORT_SEP);

			const offset = positionMode ? -1 : 0;

			return Math.max(parseInt(bars, 10) + offset, 0) * bar +
				Math.max(parseInt(quarters, 10) + offset, 0) * ppq +
				parseInt(units, 10) * sixteenths;
		} catch (err) {
			console.error(err); /* eslint no-console:0 */
			return 0;
		}
	};

	/**
	 * Converts ticks to Bars:Beats:Sixteenths notation
	 *
	 * @function ticksToBBS
	 * @memberof Core#Time
 	 * @description Converts ticks to Bars:Beats:Sixteenths notation
	 *
	 * @param {Number} ticks
	 * @param {Object} [opts = {}]
	 * @param {Array<Number>} [opts.timeSignature = [ 4, 4 ]]
	 * @param {Boolean} [opts.positionMode = false]
	 * @return {String}
	 */
	static ticksToBBS = (ticks: number, { ppq = QUARTER, timeSignature = [ 4, 4 ], positionMode = false } = {}): string => {
		// IN MAX THE TRANSPORT STARTS AT: '1.1.0'
		// IN ABLETON THE TRANSPORT STARTS AT: '1.1.1'
		let quarters = ticks / ppq;
		const beatsPerBar = timeSignature[0];
		const bar = ppq * beatsPerBar;
		const sixteenth = Math.floor(ppq / beatsPerBar);

		const bars = parseFloat((quarters / beatsPerBar).toFixed(3));
		const barsRemainder = bars < 1 ? bars : bars % Math.floor(bars);

		quarters = parseFloat(((barsRemainder * bar) / ppq).toFixed(3));

		let units;

		if (quarters < 1) {
			units = quarters * ppq;
		} else {
			units = (quarters % Math.floor(quarters)) * ppq;
		}

		const offset = positionMode ? 1 : 0;

		return [
			Math.floor(bars + offset),
			Math.floor(quarters + offset),
			Math.floor(units / sixteenth + offset),
		].join(TRANSPORT_SEP);
	};
}
