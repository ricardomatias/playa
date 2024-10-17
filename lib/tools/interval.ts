import * as R from 'ramda';
import { Interval, Semitones } from '../constants';
import { Note, NoteLike } from '../core/Note';
import { isNotNull } from '../utils/types-guards';
import { naturalPosition, semitones } from './distance';

const TOTAL_INTERVALS = 21;

/**
 * Intervals
 * @namespace Interval
 * @memberof Tools
 */

/**
 * Gets one or several intervals from a number of semitones
 * @function fromSemitones
 * @memberof Tools.Interval
 * @example fromSemitones(4) => ['3M']
 *
 * @param {Number} semitones
 * @return {Array<Interval>|null}
 */
export const fromSemitones = (semitones: number): Interval[] | null => {
	const intervals: Interval[] = [];

	for (const [interv, semit] of Object.entries(Semitones)) {
		if (semit === semitones) {
			intervals.push(interv as Interval);
		}
	}

	if (!intervals.length) {
		return null;
	}

	return intervals;
};

/**
 * Inverts the given interval
 * @function invert
 * @memberof Tools.Interval
 * @example invert('3m') => ['6M']
 *
 * @param {Interval} interv
 * @return {Array<Interval>|null}
 */
export const invert = (interv: Interval): Interval[] | null => {
	const semit = Semitones[interv];

	if (!semit || semit > 12) {
		return null;
	}

	return fromSemitones(12 - semit);
};

/**
 * Adds two intervals together
 * @function add
 * @memberof Tools.Interval
 *
 * @param {Interval} a
 * @param {Interval} b
 *
 * @example
 * add("3M", "3M") => [ '5A', '6m' ]
 *
 * @return {Array<Interval>|null} How many semitones are they apart or null if not possible
 */
export const add = (a: Interval, b: Interval): Interval[] | null => {
	const aSemit = Semitones[a];
	const bSemit = Semitones[b];

	if (aSemit && bSemit) {
		const result = aSemit + bSemit;

		// Max number of semitones (also the number of USED intervals x) )
		if (result > TOTAL_INTERVALS) {
			return null;
		}

		return fromSemitones(result);
	}

	return null;
};

/**
 * Subtracts two intervals together
 * @function subtract
 * @memberof Tools.Interval
 *
 * @param {Interval} a
 * @param {Interval} b
 *
 * @example
 * subtract("9m", "3m") => ['7m']
 *
 * @return {Array<Interval>|null} How many semitones are they apart or null if not possible
 */
export const subtract = (a: Interval, b: Interval): Interval[] | null => {
	const aSemit = Semitones[a];
	const bSemit = Semitones[b];

	if (aSemit && bSemit) {
		const result = aSemit - bSemit;

		// Max number of semitones (also the number of USED intervals x) )
		if (result < 0) {
			return null;
		}

		return fromSemitones(result);
	}

	return null;
};

/**
 * Checks if the interval exists
 * @function exists
 * @memberof Tools.Interval
 *
 * @param {Interval} a
 *
 * @example
 * exists("55m") => false
 *
 * @return {bool}
 */
export const exists = (interval: Interval): boolean => Object.keys(Semitones).includes(interval);

/**
 * Separates an intervals string into an array, filtering out any invalid interval
 *
 * @function separate
 * @memberof Tools.Interval
 *
 * @param {string} intervals
 *
 * @example
 * separate("1P 3M 5P") => ["1P", "3M", "5P"]
 * separate("1P 98M 5P") => ["1P", "5P"]
 *
 * @return {Array<Interval>}
 */
export const separate = (intervals: string): Interval[] => {
	const arr = intervals.split(' ') as Interval[];

	return arr.filter(exists);
};

/**
 * Extracts the positions from an interval's string
 *
 * @function positions
 * @memberof Tools.Interval
 *
 * @param {string} intervals
 *
 * @example
 * positions("1P 3M 5P") => [1, 3, 5]
 * positions("1P 98M 5P") => [1, 5]
 *
 * @return {Array<number>}
 */
export const positions = (intervals: string): number[] => {
	return separate(intervals).map((interval) => parseInt(interval.replace(/\D*/, ''), 10));
};

/**
 * Get the interval between 2 notes
 * @function between
 * @memberof Tools.Interval
 *
 * @param {Note | NoteSymbol | string} a
 * @param {Note | NoteSymbol | string} b
 * @example interval(C, G) // => "5P"
 * @return {Interval|null} The interval between 2 notes
 */
export const between = (a: NoteLike, b: NoteLike): Interval | null => {
	const semit = semitones(a, b);
	const intervals = fromSemitones(semit);

	if (isNotNull(intervals)) {
		if (intervals.length > 1) {
			const noteA = new Note(a);
			const noteB = new Note(b);
			const natSemit = naturalPosition(noteA, noteB);

			return intervals.find(R.includes(`${natSemit}`)) || intervals[0];
		} else {
			return intervals[0];
		}
	} else {
		return null;
	}
};

/**
 * Detects the intervals from a string of notes
 *
 * @function detect
 * @memberof Tools.Interval
 *
 * @param {string} notes
 *
 * @example
 * detect("C E G") => "1P 3M 5P"
 *
 * @return {string}
 */
export const detect = (notes: string): Interval[] | null => {
	const arr = notes.split(' ').filter((note) => Note.isNoteLike(note)) as NoteLike[];

	if (arr.some((note) => !note)) {
		return [];
	}

	const intervals = arr
		.filter((note) => note !== null)
		.map((note, index, arr) => {
			if (index === 0) {
				return '1P';
			}

			return between(arr[0], note)!;
		});

	return intervals;
};
