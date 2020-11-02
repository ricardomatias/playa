import { Notevalue, Ticks } from '../constants/ticks';

const QUARTER = Ticks['4n'];

const TRANSPORT_SEPARATOR = ':';

export type TimeFormat = string | number | Time;

// Live exports MIDI files with a resolution of 96 ppq, which means a 16th note can be divided into 24 steps.

export type TimeSignature = [number, number] | number[];

type OptionsBBSConversion = {
	timeSignature: TimeSignature,
	positionMode: boolean,
	ppq: number
}

/**
 * Time
 * @class
 * @memberof Core#
 *
 * @name Time
 */
export class Time {
	#ticks: number;
	#notevalue?: Notevalue;
	#bbs: string;
	#timeSignature: TimeSignature;

	/**
	 * Creates an instance of Time.
	 * @constructs Time
	 * @memberof Core#
	 *
	   * @param {TimeFormat} time
	   * @param {TimeSignature} [timeSignature = [4, 4]]
	 */
	constructor(time: TimeFormat, timeSignature: TimeSignature = [ 4, 4 ]) {
		if (time instanceof Time) {
			this.#ticks = time.ticks;
			this.#notevalue = time.notevalue;
			this.#bbs = time.bbs;
			this.#timeSignature = timeSignature;
		} else
		// Ticks
		if (typeof time === 'number') {
			this.#ticks = time;
			this.#notevalue = Ticks[time] as Notevalue;
			this.#bbs = Time.ticksToBBS(time, { timeSignature });
			this.#timeSignature = timeSignature;
		} else
		// Notevalue
		if (/n/.test(time) && typeof Ticks[time as Notevalue] !== 'undefined') {
			this.#notevalue = time as Notevalue;
			this.#ticks = Ticks[time as Notevalue];
			this.#bbs = Time.ticksToBBS(this.#ticks, { timeSignature });
			this.#timeSignature = timeSignature;
		} else
		if (/:/.test(time)) {
			this.#bbs = time;
			this.#ticks = Time.bbsToTicks(time, { timeSignature });
			this.#notevalue = Ticks[this.#ticks] as Notevalue;
			this.#timeSignature = timeSignature;
		} else {
			throw new Error(`[Time] Unrecognized time format for -> ${time}`);
		}
	}

	valueOf(): number {
		return this.#ticks as number;
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
	get notevalue(): Notevalue | undefined {
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
	get n(): Notevalue | undefined {
		return this.#notevalue;
	}

	/**
	 * Transport time aka Bars beats sixteenths
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
	 * Time Signature [ beats in a bar, beat value ]
	 * @example
	 * [ 4, 4 ]
	 *
	 * @readonly
	 * @member timeSignature
	 * @type {string}
	 * @memberof Core#Time#
	 */
	get timeSignature(): TimeSignature {
		return this.#timeSignature;
	}

	/**
	* Convert to seconds
	* @function toSeconds
	* @memberof Core#Time#
	* @example
	* toSeconds(120) =>
	*
	* @param {number} bpm beats per minute
	* @param {PPQ} [ppq] ppq
	* @return {number} seconds
	*/
	toSeconds(bpm: number): number {
		return Time.ticksToSeconds(this.ticks, bpm);
	}

	/**
	 * @function bbsToTicks
	 * @memberof Core#Time
	 * @description  Converts "Bars : Beats : Sixteenths" to ticks
	 *
	 * @param {string} time '2:0:1'
	 * @param {Object} [opts = {}]
	 * @param {boolean} [opts.positionMode=false]
	 * @param {number} [opts.ppq = 480] Pulse per quarter note
	 * @return {Number}
	 */
	static bbsToTicks = (
		time: string,
		{
			timeSignature = [ 4, 4 ],
			positionMode = false,
			ppq = QUARTER,
		}: Partial<OptionsBBSConversion> = {},
	): number => {
		try {
			const beatsPerBar = timeSignature[0];
			const beatsNotevalue = `${timeSignature[1]}n` as Notevalue;
			const ppqMult = QUARTER / ppq;

			const beatsValue = (Ticks[beatsNotevalue] / ppqMult);
			const bar = beatsValue * beatsPerBar;
			const sixteenths = ppq / 4;

			const [ bars, beats, units ] = time.split(TRANSPORT_SEPARATOR).map((str) => parseInt(str, 10));

			const offset = positionMode ? -1 : 0;

			return (Math.max(bars + offset, 0) * bar +
				Math.max(beats + offset, 0) * beatsValue +
				units * sixteenths);
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
	 * @param {number} [opts.ppq = 480]
	 * @param {Array<Number>} [opts.timeSignature = [ 4, 4 ]]
	 * @param {Boolean} [opts.positionMode = false]
	 * @return {String}
	 */
	static ticksToBBS = (
		ticks: number,
		{ ppq = QUARTER, timeSignature = [ 4, 4 ], positionMode = false }: Partial<OptionsBBSConversion> = {},
	): string => {
		// IN MAX THE TRANSPORT STARTS AT: '1.1.0'
		// IN ABLETON THE TRANSPORT STARTS AT: '1.1.1'
		const beatsPerBar = timeSignature[0];
		const beatsValue = timeSignature[1];
		const timeSign = (beatsPerBar / beatsValue) * 4;

		let quarters = ticks / ppq;

		quarters = parseFloat(quarters.toFixed(4));

		const measures = Math.floor(quarters / timeSign);

		let sixteenths = (quarters % 1) * 4;

		quarters = Math.floor(quarters) % timeSign;

		const sixteenthString = sixteenths.toString();

		if (sixteenthString.length > 3) {
			// the additional parseFloat removes insignificant trailing zeroes
			sixteenths = parseFloat(parseFloat(sixteenthString).toFixed(3));
		}

		const offset = positionMode ? 1 : 0;

		return [
			Math.floor(measures + offset),
			Math.floor(quarters + offset),
			Math.floor(sixteenths + offset),
		].join(TRANSPORT_SEPARATOR);
	};


	/**
	 * Convert seconds to transport time
	 * @function secondsToBBS
	 * @memberof Core#Time
	 *
	 * @param {number} seconds 0.5 = 4n @ 120bpm
	 * @param {number} [bpm=120]
	 * @param {Object} [opts = {}]
	 * @param {number} [opts.ppq = 480]
	 * @param {Array<Number>} [opts.timeSignature = [ 4, 4 ]]
	 * @param {Boolean} [opts.positionMode = false]
	 * @return {string}
	 */
	static secondsToBBS = (
		seconds: number,
		bpm = 120,
		{ timeSignature = [ 4, 4 ], ppq = QUARTER, positionMode = false }: Partial<OptionsBBSConversion> = {},
	): string => {
		const ticks = Time.secondsToTicks(seconds, bpm);

		return Time.ticksToBBS(ticks, { ppq, timeSignature, positionMode });
	};


	/**
	 * Converts seconds to ticks
	 * @function secondsToTicks
	 * @memberof Core#Time
	 *
	 * @param {number} seconds
	 * @param {number} bpm
	 * @param {number} [ppq = 480]
	 * @return {number}
	 */
	static secondsToTicks = (seconds: number, bpm: number, ppq: number = QUARTER): number => {
		const quarterTime = 60 / bpm;
		const quarters = seconds / quarterTime;

		return Math.round(quarters * ppq);
	};

	/**
	 * Converts ticks to seconds
	 * @function ticksToSeconds
	 * @memberof Core#Time
	 *
	 * @param {number} ticks
	 * @param {number} bpm
	 * @param {number} [ppq = 480]
	 * @return {number}
	 */
	static ticksToSeconds = (ticks: number, bpm: number, ppq: number = QUARTER): number => {
		return (ticks / ppq * (60 / bpm));
	};

	get [Symbol.toStringTag](): string {
		return `Time: ${this.ticks} ticks`;
	}
}

export const TOff = new Time('0:0:2');
export const T1 = new Time('1:0:0');
export const T2 = new Time('2:0:0');
export const T4 = new Time('4:0:0');
export const T8 = new Time('8:0:0');
export const T16 = new Time('16:0:0');
export const T32 = new Time('32:0:0');
export const T64 = new Time('64:0:0');
