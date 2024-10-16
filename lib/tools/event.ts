import * as R from 'ramda';
import { BinaryEvent } from '../common/types';
import { Note, NoteLike } from '../core/Note';
import { NoteEvent } from '../core/NoteEvent';
import { Event } from '../core/Event';
import { Time, TimeFormat } from '../core/Time';
import { toTicks } from '../utils';

/**
 * Event tools
 * @namespace Event
 * @memberof Tools
 */

// Live exports MIDI files with a resolution of 96 ppq, which means a 16th note can be divided into 24 steps.

// https://github.com/Tonejs/Tone.js/blob/dev/Tone/type/Time.js

export const mapDurations = (durations: TimeFormat[]): Event[] =>
	durations.map((dur) => ({
		time: 0,
		dur: toTicks(dur),
		next: 0,
		isRest: false,
	}));

export function isEvent(pattern: TimeFormat[] | Event[]): pattern is Event[] {
	return typeof (pattern as Event[])[0] === 'object';
}

/**
 * Creates a timeline by assigning the duration to each event's time
 * @function expandDuration
 * @memberof Tools.Event
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
export function expandDuration(pattern: Event[] | TimeFormat[], startTime = 0): Event[] {
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
			const prevTime = prevEvent.time;

			const prop = prevEvent.next != 0 ? 'next' : 'dur';
			const value = prevEvent[prop];

			const duration = toTicks(value);

			newEvent.time = prevTime + duration;
		}

		events.push(newEvent);
	});

	return computeEventsNext(events);
}

/**
 * Compute `next` time for a list of events
 *
 * @function computeEventsNext
 * @memberof Tools.Event
 * @template T
 * @param {T[]} events
 * @return {T[]}
 */
export const computeEventsNext = <T extends Event>(events: T[]): T[] => {
	return events.map((event, index) => {
		const nextEvent = events[index + 1];

		event.next = nextEvent ? nextEvent.time : event.time + event.dur;

		return event;
	});
};

/**
 * Maps events to a new starting value
 *
 * @function mapStartToEvent
 * @memberof Tools.Event
 *
 * @param {Event} event
 * @param {TimeFormat} startTime
 * @return {Event}
 */
export const mapStartToEvent = <T extends Event>(startTime: TimeFormat, event: T): T => {
	const start = new Time(startTime);
	return {
		...event,
		time: start.ticks + event.time,
		next: start.ticks + event.next,
	};
};

/**
 * Converts Event[] to notevalues (ie. 4n), ignores rests
 *
 * @function convertEventsToNotevalues
 * @memberof Tools.Event
 *
 * @param {Event[]} events
 * @return {string[]}
 */
export const convertEventsToNotevalues = (events: Event[]): string[] => {
	const filteredEvents = R.filter((event) => !event.isRest, events);

	return filteredEvents.map((evt, index) => {
		// TODO: Switch to Notevalue and fix undefined issue
		return new Time(index ? evt.next - evt.time : evt.next).notevalue as string;
	});
};

/**
 * Converts Event[] to notevalues (ie. 4n), ignores rests
 *
 * @function convertBinaryEvents
 * @memberof Tools.Event
 *
 * @param {BinaryEvent[]} events
 * @param {TimeFormat} subdivision
 * @param {NoteLike} note
 * @return {NoteEvent[]}
 */
export const convertBinaryEvents = (events: BinaryEvent[], subdivision: TimeFormat, note: NoteLike): NoteEvent[] => {
	const beat = new Time(subdivision).notevalue;

	if (!beat) return [];

	return expandDuration(R.repeat(beat, events.length)).map((evt, i) => {
		const n = new Note(note);
		const hit = events[i] ? { note: n.pitch, midi: n.midi } : { isRest: true };

		return NoteEvent({ ...evt, ...hit });
	});
};
