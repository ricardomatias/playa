import * as R from 'ramda';
import { splitEvery } from './split-every';
import { Event, Time, TimeFormat } from '../../core';

/**
 * Events editing class
 *
 * @memberof Composition.Events#
 * @class
 * @name EventEditing
 * @template T
 */
class EventEditing<T extends Event> {
	private _events: T[];
	private _data: T[][];
	private _selection: T[];

	/**
	 * Creates an instance of EventEditing.
	 * @constructs EventEditing
	 * @memberof Composition.Events#
	 * @param {T[]} events
	 * @private
	 */
	constructor(events: T[]) {
		this._events = events;
		this._data = [];
		this._selection = [];
	}

	/**
	 * Creates a selection like in {@link Composition.Events.splitEvery}
	 *
	 * @function every
	 * @param {TimeFormat} time
	 * @return {EventEditing<T>}
	 * @memberof Composition.Events#EventEditing
	 */
	every(time: TimeFormat): EventEditing<T> {
		this._data = splitEvery(this._events, time);

		return this;
	}

	/**
	 * Creates a selection of events before the provided time
	 *
	 * @function before
	 * @param {TimeFormat} time
	 * @return {EventEditing}
	 * @memberof Composition.Events#EventEditing
	 */
	before(time: TimeFormat): EventEditing<T> {
		return this.selectTimewindow(time, (t, cmpT) => t < cmpT);
	}

	/**
	 * Creates a selection of events after the provided time
	 *
	 * @function after
	 * @param {TimeFormat} time
	 * @return {EventEditing}
	 * @memberof Composition.Events#EventEditing
	 */
	after(time: TimeFormat): EventEditing<T> {
		return this.selectTimewindow(time, (t, cmpT) => t >= cmpT);
	}

	/**
	 * Returns the events
	 *
	 * @member events
	 * @memberof Composition.Events#EventEditing
	 * @return {T[]}
	 */
	get events(): T[] {
		return this._events;
	}

	/**
	 * Returns the events applying a function to the active selection
	 *
	 * @function apply
	 * @return {Function}
	 * @memberof Composition.Events#EventEditing
	 */
	apply(fn: (event: T) => void): T[] {
		this._selection.forEach(fn);

		return this._events;
	}

	/**
	 * Returns the events with silences applied to the active selection
	 *
	 * @function silence
	 * @return {Array<T>}
	 * @memberof Composition.Events#EventEditing
	 */
	silence(): T[] {
		this._selection.forEach((event) => {
			event.isRest = true;
		});

		return this._events;
	}

	private selectTimewindow(
		time: TimeFormat,
		fn: (eventTime: TimeFormat, comparisonTime: TimeFormat) => boolean
	): EventEditing<T> {
		const t = new Time(time);

		if (R.isEmpty(this._data)) {
			this._selection = this._events.filter((event) => fn(event.time, t));

			return this;
		}

		this._selection = this._data
			.map((events) => {
				const after = t.ticks + events[0].time;

				return events.filter((event) => fn(event.time, after));
			})
			.flat();

		return this;
	}
}

/**
 * Use this to perform selections on an array of events.
 * @example
 * // -8n -> the '-' is used here to symbolize a rest, which is used in an Event via (isRest)
 * const rhythm = Rhythm.free('1:0:0', ['8n']); // [8n, 8n, 8n, 8n, 8n, 8n, 8n, 8n]
 * Events.select(rhythm).every('2n').after('4n').silence(); // => [8n, 8n, -8n, -8n, 8n, 8n, -8n, -8n]
 * Events.select(rhythm).before('2n').silence(); // => [-8n, -8n, -8n, -8n, 8n, 8n, 8n, 8n]
 *
 * @function select
 * @memberof Composition.Events
 *
 * @param {Array<Event>} events
 * @return {EventEditing}
 */
export function select<T extends Event>(events: T[]): EventEditing<T> {
	return new EventEditing(R.map(R.clone, events));
}
