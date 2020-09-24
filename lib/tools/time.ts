import * as R from 'ramda';
import TICKS from '../constants/ticks';
import { Event } from '../core/Event';
import { Time } from '../core/Time';
import { toTicks } from '../utils';

const QUARTER = TICKS.get('4n');

/**
 * Time tools
 * @namespace Time
 * @memberof Tools
 */

// Live exports MIDI files with a resolution of 96 ppq, which means a 16th note can be divided into 24 steps.

// https://github.com/Tonejs/Tone.js/blob/dev/Tone/type/Time.js

export const mapDurations = (durations: string[]): Event[] => (durations.map((dur) => (
	{
		time: 0,
		dur: toTicks(dur),
		next: 0,
		isRest: false,
	}
)));

export function isEvent(pattern: string[] | Event[]): pattern is Event[] {
	return typeof (pattern as Event[])[0] === 'object';
}

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
export function expandDuration(pattern: Event[] | string[], startTime = 0): Event[] {
	if (!Array.isArray(pattern)) return [];

	if (!isEvent(pattern)) {
		pattern = mapDurations(pattern);
	}

	const events: Event[] = [];

	pattern.forEach((event, index) => {
		event.dur = toTicks(event.dur);

		const newEvent = { ...event };

		if (index === 0) {
			const start = event.time || startTime;

			newEvent.time = start;
			newEvent.next = event.next;
		} else {
			const prevEvent = events[index - 1] as Event;
			const prevTime = prevEvent ? prevEvent.time : null;

			const prop = prevEvent.next != 0 ? 'next' : 'dur';
			const value = prevEvent[prop];

			const duration = typeof value === 'number' ? value : TICKS.get(value);

			newEvent.time = prevTime + duration;
		}

		events.push(newEvent);
	});

	return events.map((event, index) => {
		const nextEvent = events[index + 1];

		event.next = nextEvent ? nextEvent.time : event.time + event.dur;

		return event;
	});
}

export const mapStartToEvent = (event: Event, startTime: Time): Event => ({
	...event,
	time: startTime.ticks + event.time,
	next: startTime.ticks + event.next,
});

/**
 * @function convertEventsToNotevalues
 * @memberof Tools.Time
 * @description Converts Event[] to notevalues (ie. 4n), ignores rests
 *
 * @param {Event[]} events
 * @return {string[]}
 */
export const convertEventsToNotevalues = (events: Event[]): string[] => {
	const filteredEvents = R.filter(R.propEq('isRest', false), events);

	return filteredEvents.map((evt, index) => {
		const nv = new Time(index ? evt.next - evt.time : evt.next).notevalue;
		return nv;
	});
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
export const timeToTransport = (seconds: number, bpm = 120, { timeSignature = 4 } = {}): string => {
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
export const timeToTicks = (seconds: number, bpm: number, ppq: number = QUARTER): number => {
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
export const ticksToTime = (ticks: number, bpm: number, ppq: number = QUARTER): number => {
	return (ticks / ppq * (60 / bpm));
};


