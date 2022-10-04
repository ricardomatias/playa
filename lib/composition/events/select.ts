import * as R from 'ramda';
import { splitEvery, splitEveryIndices } from './split-every';
import { Event, Time, TimeFormat } from '../../core';
import { isUndefined } from '../../utils/types-guards';
import { mapStartToEvent } from '../../tools';

//TODO: Add insert something in selection

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
	private _data: number[][];
	private _selection: number[][];
	private _window: number[];
	private _hasWindows: boolean;

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
		this._window = [];
		this._hasWindows = false;
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
		this._data = splitEveryIndices(this._events, time);
		this._hasWindows = true;

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
	 * Creates a selection of events within the provided time interval - [t0, t1[
	 * If [t0, t1] is needed -> .after(t0).before(t1)
	 *
	 * @function between
	 * @param {TimeFormat} time
	 * @return {EventEditing}
	 * @memberof Composition.Events#EventEditing
	 */
	between(t0: TimeFormat, t1: TimeFormat): EventEditing<T> {
		return this.before(t1).after(t0);
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
	 * @function applyRest
	 * @return {Function}
	 * @memberof Composition.Events#EventEditing
	 */
	applyRest(fn: (event: T) => boolean): T[] {
		this.selectionEvents()
			.flat()
			.forEach((event) => {
				event.isRest = fn(event);
			});

		return this._events;
	}

	/**
	 * Returns the events with rests applied to the active selection
	 *
	 * @function rest
	 * @return {Array<T>}
	 * @memberof Composition.Events#EventEditing
	 */
	rest(): T[] {
		this.selectionEvents()
			.flat()
			.forEach((event) => {
				event.isRest = true;
			});

		return this._events;
	}

	/**
	 * Returns the events with rests applied to the active selection
	 *
	 * @function insert
	 * @return {Array<T>}
	 * @memberof Composition.Events#EventEditing
	 */
	insert(events: T[]): T[] {
		this._selection.forEach((bracket, i) => {
			const len = bracket.length;
			const start = i === 0 ? bracket[0] : bracket[0] - (len - events.length);

			const eventsAdj = R.map(mapStartToEvent(this._events[start].time), events) as T[];

			this._events.splice(start, len, ...eventsAdj);
		});
		return this._events;
	}

	private selectionEvents() {
		return this._selection.map((bracket) => bracket.map((i) => this._events[i]));
	}

	private toIndices = (event: T) => this._events.indexOf(event);

	private selectTimewindow(
		time: TimeFormat,
		fn: (eventTime: TimeFormat, comparisonTime: TimeFormat) => boolean
	): EventEditing<T> {
		const t = new Time(time);

		if (R.isEmpty(this._data) && R.isEmpty(this._selection)) {
			this._selection = [this._events.filter((event) => fn(event.time, t)).map(this.toIndices)];

			return this;
		}

		const selection = R.isEmpty(this._selection) ? this._data : this._selection;

		this._selection = selection.map((events) => {
			const t1 = t.ticks;
			const tOffset = this._hasWindows ? this._events[events[0]].time : 0;

			return events.filter((eventIndex) => fn(this._events[eventIndex].time - tOffset, t1));
		});

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
