import * as R from 'ramda';
import TICKS from '../constants/ticks';

const QUARTER = TICKS.get('4n');

const TRANSPORT_SEP = ':';

/**
 * Time tools
 * @namespace Time
 * @memberof Tools
 */

// Live exports MIDI files with a resolution of 96 ppq, which means a 16th note can be divided into 24 steps.

// https://github.com/Tonejs/Tone.js/blob/dev/Tone/type/Time.js


/**
 * Creates a timeline by assigning the duration to each event's time
 * @function expandDuration
 * @memberof Tools.Time
 *
 * @example
 *
 * expandDuration([ '8n', '4n', '2nt' ]) =>
 * [ { time: 0, dur: '8n' },
 * { time: 240, dur: '4n' },
 * { time: 720, dur: '2nt' }]
 * // or
 * expandDuration([{ time: 0, dur: '8n' }, { time: 0, dur: '4n' }, { time: 0, dur: '2nt' }]) =>
 * [ { time: 0, dur: '8n' },
 * { time: 240, dur: '4n' },
 * { time: 720, dur: '2nt' }]
 * @param {Array<Object>} pattern
 * @param {number} startTime
 * @return {Array<NoteEvent|ChordEvent>} pattern
 */
export const expandDuration = (pattern, startTime = 0) => {
	if (!Array.isArray(pattern)) return [];

	if (typeof pattern[0] === 'string') {
		pattern = pattern.map((dur) => ({ time: startTime, dur }));
	}

	return pattern.map((event, index) => {
		event.dur = typeof event.dur === 'number' ? event.dur : TICKS.get(event.dur);

		if (index === 0) {
			return { ...event, time: event.time || startTime };
		}

		const prevEvent = pattern[index - 1] ? pattern[index - 1] : null;

		const prevTime = prevEvent ? prevEvent.time : null;

		if (prevTime || index) {
			const prop = R.has('next', prevEvent) ? 'next' : 'dur';
			const value = prevEvent[prop];

			const duration = typeof value === 'number' ? value : TICKS.get(value);

			event.time = prevTime + duration;
		}

		return event;
	});
};

/**
 * BARS : QUARTERS : BEATS
 *
 * @function bbsToTicks
 * @memberof Tools.Time
 *
 * @param {String} time '2.3.1'
 * @param {Object} [opts = {}]
 * @param {boolean} [opts.positionMode=false]
 * @param {number} [opts.ppq = 480] Pulse per quarter note
 * @return {Number}
 */
export const bbsToTicks = (time, { positionMode = false, ppq = QUARTER } = {}) => {
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
	}
};

/**
 * Converts ticks to Bars:Beats:Sixteenths notation
 *
 * @function ticksToBBS
 * @memberof Tools.Time
 *
 * @param {Number} ticks
 * @param {Object} [opts = {}]
 * @param {Array<Number>} [opts.timeSignature = [ 4, 4 ]]
 * @param {Boolean} [opts.positionMode = false]
 * @return {String}
 */
export const ticksToBBS = (ticks, { ppq = QUARTER, timeSignature = [ 4, 4 ], positionMode = false } = {}) => {
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


/**
 * Convert seconds to transport time
 * @function timeToTransport
 * @memberof Tools.Time
 *
 * @param {number} seconds 0.5 = 4n @ 120bpm
 * @param {number} [bpm=120]
 * @param {opts} [opts={}]
 * @return {string}
 */
export const timeToTransport = (seconds, bpm = 120, { timeSignature = 4 } = {}) => {
	const quarterTime = 60 / bpm;
	let quarters = seconds / quarterTime;

	quarters = parseFloat(quarters.toFixed(4));

	const measures = Math.floor(quarters / timeSignature);

	const sixteenths = Math.floor((quarters % 1) * 4);

	quarters = Math.floor(quarters) % timeSignature;

	return [ measures, quarters, sixteenths ].join(':');
};


/**
 * Converts seconds to ticks
 * @function timeToTicks
 * @memberof Tools.Time
 *
 * @param {number} seconds
 * @param {number} bpm
 * @param {number} [ppq=QUARTER]
 * @return {number}
 */
export const timeToTicks = (seconds, bpm, ppq = QUARTER) => {
	const quarterTime = 60 / bpm;
	const quarters = seconds / quarterTime;

	return Math.round(quarters * ppq);
};


/**
 * Converts ticks to seconds
 * @function ticksToTime
 * @memberof Tools.Time
 *
 * @param {number} ticks
 * @param {number} bpm
 * @param {number} [ppq=QUARTER]
 * @return {number}
 */
export const ticksToTime = (ticks, bpm, ppq = QUARTER) => {
	return (ticks / ppq * (60 / bpm));
};


