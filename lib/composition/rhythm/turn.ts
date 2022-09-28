import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';

import { Ticks, Notevalue } from '../../constants';
import { whilst, findCombinationsSum } from '../../utils';
import random from '../../tools/random';
import { createGrid, GridCell } from './grid';
import { Time, TimeFormat } from '../../core/Time';
import { Event } from '../../core/Event';

const PRECISION = 5;
const MAX_DUR = Ticks['1nd'];

const sortDiverseFirst = R.descend(R.compose(R.length, R.groupWith(R.equals)));

type CombinationSorting = Partial<{
	diverseFirst: boolean;
	similarFirst: boolean;
}>;

type SortingFunction = (a: readonly number[], b: readonly number[]) => number;

const drawGroupingCombination = (turns: number, combSorting: CombinationSorting = {}): number[] => {
	const sortingAlgos: SortingFunction[] = [];

	if (combSorting.diverseFirst) {
		sortingAlgos.push(sortDiverseFirst);
		sortingAlgos.push(R.descend(R.length));
	} else if (combSorting.similarFirst) {
		sortingAlgos.push(R.ascend(R.length));
	}

	const combinations = R.sortWith(sortingAlgos, findCombinationsSum(turns, 4));
	const combProbabilities: string[] = distribute.decreasing(combinations, PRECISION);

	const combination = roll(combinations, combProbabilities, random.float);

	return R.sortWith([R.descend(R.identity)], combination);
};

const calcDur = (grid: GridCell[], gridIndex: number, hitLength: number, totalRhythmDuration: number) => {
	let nextBeatTime = grid[gridIndex + hitLength].time;

	if (gridIndex + hitLength >= grid.length) {
		nextBeatTime = totalRhythmDuration;
	}

	return nextBeatTime - grid[gridIndex].time;
};

type TurnOptions = Partial<{
	minNoteValue: number;
	combSorting: CombinationSorting;
	debug: boolean;
}>;

/**
 * Create turn based rhythms
 * @function turn
 * @memberof Composition.Rhythm
 *
 * @example
 * createTurnRhythm('2n', 3) =>
 * [
 *	 { time: 0, dur: 240, next: 240, isRest: false },
 *	 { time: 240, dur: 480, next: 720, isRest: false },
 *	 { time: 720, dur: 240, next: 960, isRest: false }
 * ]
 *
 * @param {TimeFormat} length in ticks or transport
 * @param {Number} turns number of turns
 * @param {Object} [opts = {}] available options
 * @param {Number} [opts.minNoteValue = 8] [16, 8, 4]
 * @param {Object} [opts.combSorting = {}] algorithms: [diverseFirst, similarFirst, favorNumber]
 * @return {Array<Event>} { time, dur }
 */
export function createTurnRhythm(
	length: TimeFormat,
	turns: number,
	{ minNoteValue = 8, combSorting = {}, debug = false }: TurnOptions = {}
): Event[] {
	if (turns <= 1) {
		throw new Error('Cannot make a rhythm out of less than 2 turns');
	}

	const totalRhythmDuration = new Time(length).ticks;

	const avoidrandomHitLength = Math.floor(totalRhythmDuration / turns) > MAX_DUR;

	const grouping = drawGroupingCombination(turns, combSorting);

	const MAX_TURNS = totalRhythmDuration / Ticks[`${minNoteValue}nt` as Notevalue];

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

		if (turnsLeft && index % 2 == 0 && !avoidrandomHitLength && hitLength > 1) {
			hitLength = random.int(hitLength, 1);
		}

		for (let hitsIndex = 0; hitsIndex < nrOfHits; hitsIndex++) {
			let dur = calcDur(grid, gridIndex, hitLength, totalRhythmDuration);

			if (turnsLeft && !avoidrandomHitLength) {
				whilst(
					() => {
						if (!turnsLeft) {
							hitLength -= 1;
						} else {
							hitLength += 1;
						}

						dur = calcDur(grid, gridIndex, hitLength, totalRhythmDuration);
					},
					() => !Ticks[dur]
				);
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
					availableBeats: grid.length - gridIndex,
				});
			}

			gridIndex += hitLength;
			availableBeats = grid.length - gridIndex;
		}

		if (debug) {
			console.table(grid);
			console.log('');
			console.table(groupingHits);
		}
	}

	const hits = grid.filter((cell: GridCell) => cell.hit);

	if (debug) {
		console.table(grid);
		console.log('');
		console.table(groupingHits);
	}

	return hits.map((cell: GridCell) => Event({ time: cell.time, dur: cell.dur, next: cell.time + (cell.dur as number) }));
}
