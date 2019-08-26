import Scale from '../core/Scale';
import Note from '../core/Note';
import { SHARPS, FLATS, DIATONIC_NOTES } from '../constants';
import distance from './distance';
import { valuesToArr, convObj, rotate, infuse, hasNoNumber, whilst } from '../utils';
import * as R from 'ramda';

const __ = R.__;

const SCALES_ARRAY = valuesToArr(Scale.SCALES);

// ! KEEP IT HERE
// from least common (f.ex: 4A) to most common (f.ex: 5P)
export const rankIntervals = R.compose(
	R.reject(R.equals('1P')),
	R.map(R.head),
	R.sortBy(R.length),
	R.groupWith(R.equals),
	R.sortBy(R.identity),
	R.flatten,
	R.map(R.split(' '))
);

// ! KEEP IT HERE
export const rankScales = (rankedIntervals) => {
	const ranking = R.into({}, R.compose(convObj([])), rankedIntervals);

	SCALES_ARRAY.forEach((scaleIntervals) => {
		const intervalsArr = R.split(' ', scaleIntervals);

		intervalsArr.forEach((interval) => {
			if (R.has(interval, ranking)) {
				ranking[interval] = ranking[interval].concat(scaleIntervals);
			}
		});
	});

	return ranking;
};

const DEFAULT_RANKED_INTERVALS = rankIntervals(SCALES_ARRAY);
const DEFAULT_RANKED_SCALES = rankScales(DEFAULT_RANKED_INTERVALS);

const getIntervals = R.compose(
	// * [ '8P', '4A', '5A', '7m' ]
	R.tail,
	R.flatten,
	R.converge(R.mapAccum((acc, x) => ([ acc, distance.interval(acc, x) ])), [ R.head, R.identity ])
);

const orderRankings = R.compose(
	R.reverse,
	R.sortBy(R.identity),
	R.valuesIn
);

const calcIntervalsScore = R.reduce((acc, val) => (R.add(acc, R.indexOf(val, DEFAULT_RANKED_INTERVALS))), 0);

const calcIntervalRankings = R.compose(
	R.apply(R.zipObj),
	R.converge(R.splitAt, [ R.compose(R.flip(R.divide)(2), R.length), R.identity ]),
	R.converge(R.concat, [ R.map(R.join(' ')), R.map(calcIntervalsScore) ])
);

const findPossibleScales = R.curry((rankedScales, intervals) => (R.compose(
	R.reduce((acc, val) => {
		const comparison = acc.length ? [ acc, R.unnest(val) ] : val;

		if (comparison.length === 1) {
			return R.flatten(val);
		}

		return R.apply(R.symmetricDifference, comparison);
	}, []),
	R.splitEvery(2),
	R.map(R.prop(__, rankedScales)),
	R.filter(R.has(__, rankedScales)),
	R.tail
)(intervals)));

/**
 * Orders a list of notes based on their diatonic position
 *
 * @function orderNotes
 * @private
 *
 * @param {Array<String>} notes
 * @return {Array<String>}
 */
export const orderNotes = (notes) => {
	let orderedNotes = [];
	let leadingNote; let chromaticNotes;
	let chromaticIdx = 0;

	if (!notes.length) {
		return orderedNotes;
	}

	for (let index = 0; index < notes.length; index++) {
		const note = new Note(notes[index]);

		if (note.isSharp) {
			chromaticNotes = SHARPS;
			break;
		} else
		if (note.isFlat) {
			chromaticNotes = FLATS;
			break;
		}
	}

	if (!chromaticNotes) {
		chromaticNotes = DIATONIC_NOTES;
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
const friendly = (notes, rankedScales = DEFAULT_RANKED_SCALES) => {
	// ["A", "C#", "G", "B"]
	const intervalsPermutations = [];
	let matchingScales = [];

	const isRightType = Array.isArray(notes) && notes.every(hasNoNumber);

	if (!isRightType || notes.length < 2) {
		return [];
	}

	// => ["C#", "G", "A", "B"]
	let orderedNotes = orderNotes(R.uniq(notes));

	for (let index = 0; index < orderedNotes.length; index++) {
		// [ "C#", "4A", "5A", "7m" ]
		const intervals = R.adjust(0, R.replace('8P', R.head(orderedNotes)), getIntervals(orderedNotes));

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
	const orderedScore = orderRankings(rankings);

	// ["A 2M 3M 7m", "B 2M 5A 7m", "G 2M 3M 4A", "C# 4A 5A 7m"]
	const orderedIntervals = R.compose(
		R.map(infuse(R.invertObj(rankings))),
		R.map(R.compose(R.view, R.lensProp))
	)(orderedScore);

	orderedIntervals.forEach((intervalsStr) => {
		const intervalsArr = R.split(' ', intervalsStr);

		const note = R.head(intervalsArr);

		const possibleScales = findPossibleScales(rankedScales, intervalsArr);

		if (!Array.isArray(possibleScales)) {
			return;
		}
		// ["1P 2M 3m 4P 5P 6M 7M", "1P 2M 3m 4P 5P 6m 7M", ..]

		matchingScales = matchingScales.concat(possibleScales.map((scale) => {
			const scaleArr = R.split(' ', scale);

			const intervals = R.tail(intervalsArr);

			const match = R.compose(
				R.converge(R.divide, [ R.prop('true'), R.compose(R.sum, R.valuesIn) ]),
				R.countBy(R.contains(__, scaleArr))
			)(intervals);

			return {
				scale,
				match,
				note,
				type: Scale.NAMES[scale],
			};
		}));
	});

	return R.sort(R.descend(R.prop('match')), matchingScales);
};

export default friendly;
