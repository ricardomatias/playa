import { TICKS } from '../constants';

const BAR = TICKS.get('1m');
const QUARTER = TICKS.get('4n');
const SIXTEENTH = TICKS.get('16n');

const TONE_PPQ = 192;
// const LIVE_EXPORT_PPQ = 96;
// const MIDI_PPQ = 24;

const ACTIVE_PPQ = TONE_PPQ;

// Live exports MIDI files with a resolution of 96 ppq, which means a 16th note can be divided into 24 steps.

// https://github.com/Tonejs/Tone.js/blob/dev/Tone/type/Time.js

// BARS: QUARTERS: SIXTEENTHS
export const transportToTicks = (time) => {
	try {
		const [ bars, quarters, sixteenths ] = time.split(':');

		return parseInt(bars, 10) * BAR +
			parseInt(quarters, 10) * QUARTER +
			parseInt(sixteenths, 10) * SIXTEENTH;
	} catch (err) {
		console.error(err); /* eslint no-console:0 */
	}
};

export const msToTransport = (ms, bpm = 120, timeSignature = 4) => {
	const secs = ms / 1000;

	const quarterTime = 60 / bpm;
	let quarters = secs / quarterTime;

	quarters = parseFloat(quarters.toFixed(4));

	const measures = Math.floor(quarters / timeSignature);

	let sixteenths = (quarters % 1) * 4;

	quarters = Math.floor(quarters) % timeSignature;

	return [ measures + 1, quarters + 1, sixteenths + 1 ].join(':');
};

const beatsToUnits = function(beats, bpm = 120) {
	return (60 / bpm) * beats;
};

export const msToTicks = function(ms, bpm = 120) {
	const secs = ms / 1000;

	let quarterTime = 60 / bpm;
	let quarters = secs / quarterTime;

	return Math.round(quarters * ACTIVE_PPQ);
};


/**
 *  Returns the value of a tick in the current time units
 *
 * @param {*} ticks
 * @param {*} bpm
 * @param {*} PPQ
 * @return {Number}
 */
export const ticksToUnits = function(ticks, bpm = 120) {
	return ticks * (beatsToUnits(1, bpm) / ACTIVE_PPQ);
};

export const ticksToSeconds = function(ticks, bpm = 120) {
	return ticks / ACTIVE_PPQ * (60 / bpm);
};
