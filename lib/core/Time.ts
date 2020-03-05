import { TICKS } from '../constants';
import { ticksToTransport, transportToTicks } from '../tools/time';

/**
 * Notevalues | Transport | Ticks
 */
type TimeFormat = string | number;


/**
 * Time
 * @class
 * @memberof Core#
 *
 * @name Time
 */
class Time {
	private _ticks: number;
	private _notevalue: string;
	private _transport: string;

	// TODO: fix lack of constructor documentation
	/**
	 * Creates an instance of Time.
	 * @constructs Core#Time#
	 * @memberof Core#
	 *
	 * @param {TimeFormat} time
	 */
	constructor(time: TimeFormat) {
		// Ticks
		if (typeof time === 'number') {
			this._ticks = time;
			this._notevalue = TICKS.get(time);
			this._transport = ticksToTransport(time);
		} else
		// Notevalue
		if (/n/.test(time)) {
			this._notevalue = time;
			this._ticks = TICKS.get(time);
			this._transport = ticksToTransport(this._ticks);
		} else
		if (/:/.test(time)) {
			this._transport = time;
			this._ticks = transportToTicks(time);
			this._notevalue = TICKS.get(this._ticks);
		} else {
			throw new Error(`[Time] Unrecognized time format for -> ${time}`);
		}
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
		return this._ticks;
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
		return this._notevalue;
	}

	/**
	 * Transport time
	 * @example
	 * '0:1:0'
	 *
	 * @readonly
	 * @member transport
	 * @type {string}
	 * @memberof Core#Time#
	 */
	get transport(): string {
		return this._transport;
	}
}

export default Time;
