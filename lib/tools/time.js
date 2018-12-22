import { TICKS } from '../constants';

const BAR = TICKS.get('1n');
const QUARTER = TICKS.get('4n');

const ACTIVE_PPQ = 'TONE';

const PPQ = {
	LIVE: 96,
	MAX: 480,
	TONE: 192,
};

const TRANSPORT_SEP = '.';

// Live exports MIDI files with a resolution of 96 ppq, which means a 16th note can be divided into 24 steps.

// https://github.com/Tonejs/Tone.js/blob/dev/Tone/type/Time.js

// BARS: QUARTERS: units
export const transportToTicks = (time) => {
	try {
		const [ bars, quarters, units ] = time.split(TRANSPORT_SEP);

		return parseInt(Math.max(bars - 1, 0), 10) * BAR +
			parseInt(Math.max(quarters - 1, 0), 10) * QUARTER +
			parseInt(units, 10);
	} catch (err) {
		console.error(err); /* eslint no-console:0 */
	}
};

export const ticksToTransport = (ticks, timeSignature = [ 4, 4 ]) => {
	// IN MAX THE TRANSPORT STARTS AT: '1.1.0'
	let quarters = ticks / QUARTER;
	const beatsPerBar = timeSignature[0];

	let bars = parseFloat((quarters / beatsPerBar).toFixed(3), 10);
	const barsRemainder = bars < 1 ? bars : bars % Math.floor(bars);

	quarters = parseFloat(((barsRemainder * BAR) / QUARTER).toFixed(3), 10);

	let units = quarters < 1 ? quarters * QUARTER : quarters % Math.floor(quarters) * QUARTER;

	return [
		Math.floor(bars + 1),
		Math.floor(quarters + 1),
		Math.floor(units),
	].join(TRANSPORT_SEP);
};

// *****************************************************************************
// TODO: DEPRECATED
// *****************************************************************************

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

	return Math.round(quarters * PPQ[ACTIVE_PPQ]);
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
	return ticks * (beatsToUnits(1, bpm) / PPQ[ACTIVE_PPQ]);
};

export const ticksToSeconds = function(ticks, bpm = 120) {
	return ticks / PPQ[ACTIVE_PPQ] * (60 / bpm);
};
