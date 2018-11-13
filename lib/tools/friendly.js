import Scale from '../core/Scale';
import Note from '../core/Note';
import { SHARPS, FLATS, DIATONIC_NOTES } from '../constants';
import distance from './distance';
import { valuesToArr, convObj, rotate, infuse } from '../utils/functional';
import * as R from 'ramda';

const __ = R.__;

const SCALES_ARRAY = valuesToArr(Scale.SCALES);

// ! KEEP IT HERE
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

const RANKED_INTERVALS = rankIntervals(SCALES_ARRAY);
const RANKED_SCALES = rankScales(RANKED_INTERVALS);

/**
 * Get a list of friendly scales
 *
 * Approaches:
 * * Based on a list of notes, find possible compatible keys.
 * * The comparison is done between matching intervals. Categorized by the most notes in common to the least.
 *
 * @param {Array<String>} notes
 * @param {Scale} [type]
 * @return {Array<Scale>}
 */
const friendly = (notes, type) => {
	// ["A", "C#", "G", "B"]
	const intervalsPermutations = [];
	const matchingScales = {};

	// => ["C#", "G", "A", "B"]
	let orderedNotes = orderNotes(R.uniq(notes));

	for (let index = 0; index < orderedNotes.length; index++) {
		// [ "C#", "4A", "5A", "7m" ]
		const intervals = R.adjust(R.replace('1P', R.head(orderedNotes)), 0, getIntervals(orderedNotes));

		intervalsPermutations.push(intervals);

		console.log(orderedNotes);
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

		const possibleScales = findPossibleScales(intervalsArr);
		// ["1P 2M 3m 4P 5P 6M 7M", "1P 2M 3m 4P 5P 6m 7M", ..]

		matchingScales[note] = possibleScales.map((scale) => {
			const scaleArr = R.split(' ', scale);

			const intervals = R.tail(intervalsArr);

			const match = R.compose(
				R.converge(R.divide, [ R.prop('true'), R.compose(R.sum, R.valuesIn) ]),
				R.countBy(R.contains(__, scaleArr))
			)(intervals);

			return {
				scale,
				match,
				type: Scale.NAMES[scale],
			};
		});

		matchingScales[note] = R.sort(R.descend(R.prop('match')), matchingScales[note]);
	});

	return matchingScales;
};

const getIntervals = R.compose(
	// * [ '1P', '4A', '5A', '7m' ]
	R.adjust(R.replace(/8P/, '1P'), 0),
	R.tail,
	R.flatten,
	R.converge(R.mapAccum((acc, x) => ([ acc, distance.interval(acc, x) ])), [ R.head, R.identity ])
);

const orderRankings = R.compose(
	R.reverse,
	R.sortBy(R.identity),
	R.valuesIn
);

const calcIntervalsScore = R.reduce((acc, val) => (R.add(acc, R.indexOf(val, RANKED_INTERVALS))), 0);

const calcIntervalRankings = R.compose(
	R.apply(R.zipObj),
	R.splitAt(4),
	R.converge(R.concat, [ R.map(R.join(' ')), R.map(calcIntervalsScore) ])
);

const findPossibleScales = R.compose(
	R.reduce((acc, val) => {
		const comparison = acc.length ? [ acc, R.unnest(val) ] : val;
		return R.apply(R.symmetricDifference, comparison);
	}, []),
	R.splitEvery(2),
	R.map(R.prop(__, RANKED_SCALES)),
	R.filter(R.has(__, RANKED_SCALES)),
	R.tail
);

export const orderNotes = (notes) => {
	let orderedNotes = [];
	let leadingNote; let chromaticNotes;
	let chromaticIdx = 0;

	if (!notes.length) {
		return orderedNotes;
	}

	for (let index = 0; index < notes.length; index++) {
		const note = new Note(notes[index]);

		if (note.isSharp()) {
			chromaticNotes = SHARPS;
			break;
		} else
		if (note.isFlat()) {
			chromaticNotes = FLATS;
			break;
		}
	}

	if (!chromaticNotes) {
		chromaticNotes = DIATONIC_NOTES;
	}

	let sortedNotes = R.sortBy(R.identity, notes);

	while (!leadingNote) {
		if (sortedNotes.includes(chromaticNotes[chromaticIdx])) {
			leadingNote = chromaticNotes[chromaticIdx];
		} else {
			chromaticIdx++;
		}
	}

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

export default friendly;
