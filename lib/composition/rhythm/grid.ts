import * as R from 'ramda';
import { Notevalue, Ticks } from '../../constants';
import ring from '@ricardomatias/ring';
import { Time, TimeFormat } from '../../core/Time';

const calcMaxRhythmNotes = (totalRhythmDuration: number, noteValue: number) => {
	const remainder = totalRhythmDuration % noteValue;

	return (totalRhythmDuration - remainder) / noteValue;
};

export type GridCell = {
	time: number;
	res: string[];
	hit?: boolean;
	dur?: number;
};

/**
 * Creates a grid
 * @function createGrid
 * @memberof Composition.Rhythm
 * @example
 * createGrid(new Time('2n'), 4) =>
 * [
      { time: 0, res: [ '4nt', '4n' ] },
      { time: 320, res: [ '4nt' ] },
      { time: 480, res: [ '4n' ] },
      { time: 640, res: [ '4nt' ] }
    ]
 *
 * @param {TimeFormat} totalRhythmDuration in Ticks
 * @param {number} subDivision in powers of 2 - 2/4/8/16
 * @return {Array<GridCell>}
 */
export function createGrid(totalRhythmDuration: TimeFormat, subDivision: number): GridCell[] {
	const grid = [];
	const normal = `${subDivision}n`;
	const triplet = `${subDivision}nt`;
	const normalTicks: number = Ticks[normal as Notevalue];
	const tripletTicks: number = Ticks[triplet as Notevalue];
	const length = new Time(totalRhythmDuration).ticks;

	let maxRhythmNotes = calcMaxRhythmNotes(length, tripletTicks);

	for (let index = 0; index < Math.floor(maxRhythmNotes); index++) {
		grid.push({
			time: index * tripletTicks,
			res: [triplet],
		});
	}

	maxRhythmNotes = calcMaxRhythmNotes(length, normalTicks);

	for (let index = 0; index < Math.floor(maxRhythmNotes); index++) {
		const beat = index * normalTicks;
		const beatIndex = grid.findIndex((cell) => cell.time === beat);

		if (beatIndex !== -1) {
			grid[beatIndex].res.push(normal);
		} else {
			grid.push({
				time: index * normalTicks,
				res: [normal],
			});
		}
	}

	return ring(R.uniqBy(R.prop('time'), R.sortBy(R.prop('time'), grid)));
}
