import { Scale } from '../core/Scale';
import { Note } from '../core/Note';
import { Sharps, Flats, DiatonicNotes, ScaleIntervals, Interval, NoteSymbol, ScaleName } from '../constants';
import distance from './distance';
import { valuesToArr, convObj, rotate, hasNoNumber, whilst, stripOctave } from '../utils';
import * as R from 'ramda';
import { hasKeyValue, isDefined, isNotNull, isNumber, isString } from '../utils/types-guards';

const __ = R.__;

const isNotChromatic = R.complement(R.equals(ScaleIntervals.Chromatic));

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

type ScaleRanking = Partial<{ [key in Interval]: ScaleIntervals[] }>

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

const getOrderedScoreRankings = R.compose(
	R.reverse as (score: number[]) => number[],
	R.sortBy(R.identity) as (score: number[]) => number[],
	R.map((score) => (parseInt(score, 10))),
	R.values as (ranking: { [key: string]: string }) => string[],
);

const calcIntervalsScore = R.reduce((acc, val) => (
	R.add(acc, R.indexOf(val, DEFAULT_RANKED_INTERVALS))
), 0) as (list: readonly Interval[]) => number;


const calcIntervalRankings = (list: string[][]): { [key in string]: string } => {
	const rawScoreAndIntervals: Array<string | number> = R.converge(R.concat, [
		R.map(R.join(' ')), R.map(calcIntervalsScore),
	])(list);

	const score = rawScoreAndIntervals.filter(isNumber).map(R.toString);
	const intervals = rawScoreAndIntervals.filter(isString);

	return R.zipObj(intervals, score);
};

const findPossibleScales = (rankedScales: ScaleRanking, intervals: Interval[]): ScaleIntervals[] => {
	const c = R.flatten(R.map(R.prop(__, rankedScales), intervals)) as ScaleIntervals[];
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
		} else
		if (note.isFlat) {
			chromaticNotes = Array.from(Flats);
			break;
		}
	}

	if (R.isEmpty(chromaticNotes)) {
		chromaticNotes = Array.from(DiatonicNotes);
	}

	// in descending order
	const sortedNotes = R.sortBy(R.identity, notes);

	whilst(() => {
		if (sortedNotes.includes(chromaticNotes[chromaticIdx])) {
			leadingNote = chromaticNotes[chromaticIdx];
		} else {
			chromaticIdx++;
		}
	}, () => (!leadingNote));

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

interface FriendlyRanking {
	match: number;
	root: NoteSymbol;
	scale: ScaleIntervals;
	type: ScaleName;
	intervals: string;
}

/**
 * Approaches:
 * * Based on a list of notes, find possible compatible keys.
 * * The comparison is done between matching intervals. Categorized by the most notes in common to the least.
 *
 * @function friendly
 * @memberof Tools
 *
 * @param {Array<String>} notes
 * @param {Array<String>} [rankedScales]
 * @return {Array<Object>}
 */
export const friendly = (notes: string[], rankedScales = DEFAULT_RANKED_SCALES): FriendlyRanking[] => {
	// ["A", "C#", "G", "B"]
	const intervalsPermutations = [];
	let matchingScales: FriendlyRanking[] = [];

	const isRightType = Array.isArray(notes) && notes.every(hasNoNumber);

	if (!isRightType || notes.length < 2) {
		return [];
	}

	// => ["C#", "G", "A", "B"]
	let orderedNotes = orderNotes(R.uniq(notes));

	for (let index = 0; index < orderedNotes.length; index++) {
		// [ "C#", "4A", "5A", "7m" ]
		const intervals = R.adjust(0, R.replace('8P', orderedNotes[0]), getIntervals(orderedNotes));

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

	// [21, 15, 13, 6]
	const orderedScore = getOrderedScoreRankings(rankings);

	// ["A 2M 3M 7m", "B 2M 5A 7m", "G 2M 3M 4A", "C# 4A 5A 7m"]
	const orderedIntervals = R.props(R.map(R.toString, orderedScore), R.invertObj(rankings));

	orderedIntervals.forEach((intervalsStr) => {
		const intervalsArr = R.split(' ', intervalsStr);

		const root = R.head(intervalsArr) as NoteSymbol;

		const possibleScales: ScaleIntervals[] = findPossibleScales(rankedScales, R.tail(intervalsArr) as Interval[]);

		if (!Array.isArray(possibleScales)) {
			return;
		}

		// ["1P 2M 3m 4P 5P 6M 7M", "1P 2M 3m 4P 5P 6m 7M", ..]
		const scales: FriendlyRanking[] = possibleScales.map((scale) => {
			const scaleArr = R.split(' ', scale);

			const intervals = R.tail(intervalsArr);
			const intervalsInScaleCount = R.length(R.filter(R.contains(__, scaleArr), intervals));

			const match = intervalsInScaleCount / intervals.length;

			return {
				scale,
				match,
				root,
				intervals: [ '1P' ].concat(intervals).join(' '),
				type: Scale.getName(scale) as ScaleName,
			};
		});

		matchingScales = matchingScales.concat(scales);
	});

	return R.sort(R.descend(R.prop('match')), matchingScales);
};

