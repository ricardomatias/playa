import * as R from 'ramda';
import { TICKS } from '../../constants';
import { whilst, findCombinationsSum } from '../../utils';
import { transportToTicks } from '../time';
import roll from '../roll';
import { randomInt } from '../random';
import distribute from '../distribute';
import createGrid from './grid';

const COMBINATION_FAVORED_NUM = 2;

const sortFavorNum = R.curry((favoredNumber = COMBINATION_FAVORED_NUM) =>
	R.descend(R.compose(R.length, R.filter(R.equals(favoredNumber)))),
);

const sortDiverseFirst = R.descend(R.compose(R.length, R.groupWith(R.equals)));

const drawGroupingCombination = (turns, combSorting = {}) => {
	const sortingAlgos = [];

	if (combSorting.diverseFirst) {
		sortingAlgos.push(sortDiverseFirst);
		sortingAlgos.push(R.descend(R.length));
	}

	if (combSorting.similarFirst) {
		sortingAlgos.push(R.ascend(R.length));
	}

	if (combSorting.favorNumber) {
		sortingAlgos.push(sortFavorNum(combSorting.favorNumber));
	}

	const combinations = R.sortWith(sortingAlgos, findCombinationsSum(turns));
	const combProbabilities = distribute.descending(combinations);

	const combination = roll(combinations, combProbabilities);

	return R.sortWith([ R.descend(R.identity) ], combination);
};

const calcDur = (grid, gridIndex, hitLength, totalRhythmDuration) => {
	let nextBeatTime = grid[gridIndex + hitLength].time;

	if (gridIndex + hitLength >= grid.length) {
		nextBeatTime = totalRhythmDuration;
	}

	return nextBeatTime - grid[gridIndex].time;
};

/**
 * Create turn based rhythms
 *
 * @example
 *  generateTurnRhythm(ONE_BAR * 2, 7, { combSorting: { diverseFirst: true }, });
 *  =>
 * { time: 0, dur: '8n' },
 * { time: 240, dur: '8n' },
 * { time: 480, dur: '8n' },
 * { time: 720, dur: '8n' },
 * { time: 960, dur: '2n' },
 * { time: 1920, dur: '2n' },
 * { time: 2880, dur: '2n' }
 *
 * @param {Number} length in ticks or transport
 * @param {Number} turns number of turns
 * @param {Object} [opts] available options
 * @param {Number} [opts.minNoteValue] available options
 * @param {Object} [opts.combSorting] algorithms: [diverseFirst, similarFirst, favorNumber]
 * @param {Boolean} [opts.debug] toggle debug mode
 * @return {Array<Object>} { time, dur }
 */
const createTurnRhythm = (length, turns, { minNoteValue = 8, combSorting = {}, debug = false } = {}) => {
	if (turns <= 1) {
		throw new Error('Cannot make a rhythm out of 1 or less turns');
	}

	const totalRhythmDuration = typeof length === 'number' ? length : transportToTicks(length);

	const grouping = drawGroupingCombination(turns, combSorting);

	const MAX_TURNS = totalRhythmDuration / TICKS.get(`${minNoteValue}nt`);

	if (MAX_TURNS < turns) {
		throw new Error('The minNoteValue is too big for the amount of turns wanted');
	}

	const grid = createGrid(totalRhythmDuration, minNoteValue);

	// because the first beat of the next bar is not in the grid
	// we need to add 1 to the grid length for the spacing
	// to be accounted correctly
	let availableBeats = grid.length;
	let gridIndex = 0;
	let turnsLeft = turns;

	const groupingHits = [];

	for (let index = 0; index < grouping.length; index++) {
		const nrOfHits = grouping[index];

		let hitLength = Math.floor(availableBeats / turnsLeft);

		turnsLeft -= nrOfHits;

		if (turnsLeft && index % 2 == 0) {
			hitLength = randomInt(hitLength, 2);
		}

		for (let hitsIndex = 0; hitsIndex < nrOfHits; hitsIndex++) {
			let dur = calcDur(grid, gridIndex, hitLength, totalRhythmDuration);

			if (turnsLeft) {
				whilst(() => {
					if (!turnsLeft) {
						hitLength -= 1;
					} else {
						hitLength += 1;
					}

					dur = calcDur(grid, gridIndex, hitLength, totalRhythmDuration);
				}, () => (!TICKS.get(dur)));
			}

			grid[gridIndex].hit = true;
			grid[gridIndex].dur = dur;

			if (debug) {
				groupingHits.push({
					gridIndex,
					grouping: index,
					hitLength,
					turnsLeft,
					time: grid[gridIndex].time,
					dur,
					availableBeats: (grid.length - gridIndex),
				});
			}

			gridIndex += hitLength;
			availableBeats = (grid.length - gridIndex);
		}
	}

	const hits = R.filter(R.propEq('hit', true), grid);

	if (debug) {
		console.table(grid);
		console.log('');
		console.table(groupingHits);
	}

	return R.project([ 'time', 'dur' ], hits);
};

export default createTurnRhythm;
