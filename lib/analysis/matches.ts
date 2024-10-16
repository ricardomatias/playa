import * as R from 'ramda';

import { Scale } from '../core/Scale';
import { Note, NoteLike } from '../core/Note';
import { Sharps, Flats, DiatonicNotes, NoteSymbol } from '../constants/note';
import { ScaleIntervals, ScaleName } from '../constants/scales';
import { Interval } from '../constants/intervals';
import * as distance from '../tools/distance';
import { stripOctave } from '../utils/note';
import whilst from '../utils/whilst';
import { valuesToArr, convObj, rotate } from '../utils/functional';
import { hasKeyValue, isDefined, isNotNull, Pull } from '../utils/types-guards';

const __ = R.__;

type Chromatic = Pull<typeof ScaleIntervals, 'Chromatic'>;

type FriendlyScales = Exclude<ScaleIntervals, Chromatic>;

type IntervalRanking = { [key in string]: number };

type isNotChromatic = (s: ScaleIntervals) => s is FriendlyScales;

const isNotChromatic = R.complement(R.equals(ScaleIntervals.Chromatic)) as isNotChromatic;

const SCALES_ARRAY = R.filter(isNotChromatic, valuesToArr(ScaleIntervals));

// ! KEEP IT HERE
// from least common (f.ex: 4A) to most common (f.ex: 5P)
export const rankIntervals = (scale: ScaleIntervals[]): Interval[] => {
	const intervals = R.flatten(R.map(R.split(' '), scale));

	const sortedIntervalsByType: Interval[] = R.sortBy(R.identity, intervals) as Interval[];
	const groupedIntervals = R.groupWith(R.equals, sortedIntervalsByType);
	const sortedIntervalsByCount = R.sortBy(R.length, groupedIntervals);

	return R.reject(R.equals('1P' as Interval), R.map(R.head, sortedIntervalsByCount) as Interval[]);
};

type ScaleRanking = Partial<{ [key in Interval]: ScaleIntervals[] }>;

// ! KEEP IT HERE
export const rankScales = (rankedIntervals: Interval[]): ScaleRanking => {
	const ranking: ScaleRanking = R.into({}, R.compose(convObj([])), rankedIntervals) as ScaleRanking;

	SCALES_ARRAY.forEach((scaleIntervals) => {
		const intervalsArr = <Interval[]>R.split(' ', scaleIntervals);

		intervalsArr.forEach((interval) => {
			if (hasKeyValue(ranking, interval)) {
				ranking[interval] = ranking[interval].concat(scaleIntervals);
			}
		});
	});

	return ranking;
};

const DEFAULT_RANKED_INTERVALS = rankIntervals(SCALES_ARRAY);
const DEFAULT_RANKED_SCALES = rankScales(DEFAULT_RANKED_INTERVALS);

// * [ '8P', '4A', '5A', '7m' ]
const getIntervals = (notes: string[]): Interval[] => {
	const root = R.head(notes) as NoteSymbol;
	return notes.map((n) => distance.interval(root, n)).filter(isNotNull);
};

// const getOrderedScoreRankings = R.compose(
// 	R.reverse as (score: number[]) => number[],
// 	R.sortBy(R.identity) as (score: number[]) => number[],
// 	R.map((score) => (parseInt(score, 10))),
// 	R.values as (ranking: { [key: string]: string }) => string[],
// );

const getOrderedScoreRankings = (ranking: IntervalRanking): string[] => {
	const sortedRanking: [string, number][] = R.sortWith([R.descend(R.nth(1) as any)], Object.entries(ranking));

	return sortedRanking.map(([interval]) => interval);
};

const calcIntervalsScore = R.reduce((acc, val) => R.add(acc, R.indexOf(val, DEFAULT_RANKED_INTERVALS)), 0) as (
	list: Interval[]
) => number;

const calcIntervalRankings = (list: Interval[][]): IntervalRanking => {
	const intervals = R.map(R.join(' '), list);
	const scores = R.map(calcIntervalsScore, list);

	return R.zipObj(intervals, scores) as IntervalRanking;
};

const findPossibleScales = (rankedScales: ScaleRanking, intervals: Interval[]): ScaleIntervals[] => {
	const c = R.flatten(R.map(R.prop(__, rankedScales), intervals)) as any as ScaleIntervals[];
	return R.uniq(R.flatten(c).filter(isDefined));
};

/**
 * Orders a list of notes based on their diatonic position
 *
 * @function orderNotes
 * @private
 *
 * @param {Array<String>} notes
 * @return {Array<String>}
 */
export const orderNotes = (notes: string[]): string[] => {
	let orderedNotes: string[] = [];
	let leadingNote = '';
	let chromaticNotes: string[] = [];
	let chromaticIdx = 0;

	notes = notes.map(stripOctave);

	if (!notes.length) {
		return orderedNotes;
	}

	for (let index = 0; index < notes.length; index++) {
		const note = new Note(notes[index]);

		if (note.isSharp) {
			chromaticNotes = Array.from(Sharps);
			break;
		} else if (note.isFlat) {
			chromaticNotes = Array.from(Flats);
			break;
		}
	}

	if (R.isEmpty(chromaticNotes)) {
		chromaticNotes = Array.from(DiatonicNotes);
	}

	// in descending order
	const sortedNotes = R.sortBy(R.identity, notes);

	whilst(
		() => {
			if (sortedNotes.includes(chromaticNotes[chromaticIdx])) {
				leadingNote = chromaticNotes[chromaticIdx];
			} else {
				chromaticIdx++;
			}
		},
		() => !leadingNote
	);

	for (let index = 0; index < sortedNotes.length; index++) {
		const note = sortedNotes[index];

		if (note !== leadingNote) {
			orderedNotes.push(note);
		} else {
			orderedNotes = sortedNotes.slice(index, sortedNotes.length).concat(orderedNotes);

			break;
		}
	}

	return orderedNotes;
};

// {
// "match": 1,
// "note": "A",
// "scale": "1P 2M 3M 4P 5P 6M 7m",
// "type": "Mixolydian",
// }

export interface MatchRanking {
	match: number;
	root: NoteSymbol;
	scale: ScaleIntervals;
	type: ScaleName;
	intervals: string;
}

/**
* Key Match (friendly)
* @typedef {Object} MatchRanking
* @memberof Types
*
* @property {ScaleIntervals} scale the scale's intervals
* @property {number} match match value in the range [0,1]. 1 is a perfect match
* @property {string} root the root note
* @property {string} intervals the matching intervals from the given notes
* @property {ScaleName} type the type of scale
* @example
{
	scale: '1P 2M 3m 4P 5P 6m 7m',
	match: 1,
	root: 'B',
	intervals: '1P 2M 6m 7m',
	type: 'Minor',
}
*/

// * Approaches:
// * Based on a list of notes, find possible compatible keys.
//* The comparison is done between matching intervals.Categorized by the most notes in common to the least.

/**
 * Friendly is figures out the most suitable keys for the given notes.
 * Returns a list of possible matches
 *
 * @function findMatchingKeys
 * @memberof Tools
 * @example
 * findMatchingKeys([ 'A3', 'C#4', 'G4', 'B4' ]) =>
 * [{
	scale: '1P 2M 3m 4P 5P 6m 7m',
	match: 1,
	root: 'B',
	intervals: '1P 2M 6m 7m',
	type: 'Minor',
}, ...]
 *
 * @param {Array<NoteLike>} notes
 * @return {Array<MatchRanking>}
 */
export const findMatchingKeys = (notes: NoteLike[]): MatchRanking[] => {
	// ["A", "C#", "G", "B"]
	const intervalsPermutations: Interval[][] = [];
	let matchingScales: MatchRanking[] = [];

	if (notes.length < 2) {
		return [];
	}

	const parsedNotes = notes.map((n) => new Note(n).note);

	// => ["C#", "G", "A", "B"]
	let orderedNotes = orderNotes(R.uniq(parsedNotes));

	for (let index = 0; index < orderedNotes.length; index++) {
		// [ "C#", "4A", "5A", "7m" ]
		const intervals: Interval[] = R.adjust(0, R.replace('8P', orderedNotes[0]), getIntervals(orderedNotes)) as Interval[];

		intervalsPermutations.push(intervals);

		orderedNotes = rotate(orderedNotes);
	}

	// {
	// 	"C# 4A 5A 7m": 6,
	// 	"G 2M 3M 4A": 13,
	// 	"A 2M 3M 7m": 21,
	// 	"B 2M 5A 7m": 15
	// }
	const rankings = calcIntervalRankings(intervalsPermutations);

	// ["A 2M 3M 7m", "B 2M 5A 7m", "G 2M 3M 4A", "C# 4A 5A 7m"]
	const orderedIntervals = getOrderedScoreRankings(rankings);

	orderedIntervals.forEach((intervalsStr) => {
		const intervalsArr = R.split(' ', intervalsStr);

		const root = R.head(intervalsArr) as NoteSymbol;

		const possibleScales: ScaleIntervals[] = findPossibleScales(DEFAULT_RANKED_SCALES, R.tail(intervalsArr) as Interval[]);

		if (!Array.isArray(possibleScales)) {
			return;
		}

		// ["1P 2M 3m 4P 5P 6M 7M", "1P 2M 3m 4P 5P 6m 7M", ..]
		const scales: MatchRanking[] = possibleScales.map((scale) => {
			const scaleArr = R.split(' ', scale);

			const intervals = R.tail(intervalsArr);
			const intervalsInScaleCount = R.length(R.filter(R.includes(__, scaleArr), intervals));

			const match = intervalsInScaleCount / intervals.length;

			return {
				scale,
				match,
				root,
				intervals: ['1P'].concat(intervals).join(' '),
				type: Scale.getName(scale) as ScaleName,
			};
		});

		matchingScales = matchingScales.concat(scales);
	});

	return R.sort(R.descend(R.prop('match')), matchingScales);
};

type RequiredKeys<T, K extends keyof T> = Required<Pick<T, K>>;

/**
 * Find the closest match from a list of candidates
 *
 * @function findClosestMatches
 * @memberof Tools
 *
 * @param {MatchRanking} match
 * @param {MatchRanking[]} candidates
 * @return {MatchRanking[]}
 */
export const findClosestMatches = (
	match: RequiredKeys<MatchRanking, 'root' | 'scale'>,
	candidates: MatchRanking[]
): MatchRanking[] => {
	const intervals = match.scale.split(' ');
	const scale = new Scale(match.root, match.scale);
	const notes = scale.notes.map((note) => note.note);

	const common: [number, number, MatchRanking, string[]][] = candidates.map((c) => {
		const i = c.scale.split(' ');
		const s = new Scale(c.root, c.scale);
		const n = s.notes.map((note) => note.note);

		return [R.intersection(notes, n).length, R.intersection(intervals, i).length, c, n];
	});

	const maxMatchingNotes = R.reduce(R.max, 0, R.map(R.nth(0), common));

	const matchesNotes = common.filter((m) => {
		return m[0] === maxMatchingNotes;
	});

	const maxMatchingIntervals = R.reduce(R.max, 0, R.map(R.nth(1), matchesNotes));

	const closestMatch = matchesNotes.filter((m) => {
		return m[1] === maxMatchingIntervals;
	});

	return closestMatch.map((match) => match[2]);
};

/**
 * Get only the top matches from friendly rankings
 * @function filterHighestMatches
 * @memberof Tools
 *
 * @param {MatchRanking[]} rankings
 * @return {MatchRanking[]}
 */
export const filterHighestMatches = (rankings: MatchRanking[]): MatchRanking[] => {
	const maxMatch = R.reduce(R.max, 0, R.map(R.prop('match'), rankings));
	return R.filter(R.propEq('match', maxMatch), rankings);
};
