import { TICKS } from '../constants';
import { ticksToTransport, transportToTicks } from '../tools/time';

/**
 * Notevalues | Transport | Ticks
 */
type TimeFormat = string | number;

/**
 * Time Units:
 * * Notevalues
 * * Transport
 * * Ticks
 *
 * * Seconds (audio context) | Relative
 */
class Time {
	private _ticks: number;
	private _notevalue: string;
	private _transport: string;

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

	get ticks(): number {
		return this._ticks;
	}

	get notevalue(): string {
		return this._notevalue;
	}

	get transport(): string {
		return this._transport;
	}
}

export default Time;
