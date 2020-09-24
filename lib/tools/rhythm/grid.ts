import * as R from 'ramda';
import { TICKS } from '../../constants';
import ring from '@ricardomatias/ring';

const calcMaxRhythmNotes = (totalRhythmDuration: number, noteValue: number) => {
	const remainder = totalRhythmDuration % noteValue;

	return (totalRhythmDuration - remainder) / noteValue;
};

export type GridCell = {
	time: number;
	res: string[];
	hit?: boolean;
	dur?: number;
}

export default (totalRhythmDuration: number, subDivision: number): GridCell[] => {
	const grid = [];
	const normal = `${subDivision}n`;
	const triplet = `${subDivision}nt`;
	const normalTicks: number = TICKS.get(normal);
	const tripletTicks: number = TICKS.get(triplet);

	let maxRhythmNotes = calcMaxRhythmNotes(totalRhythmDuration, tripletTicks);

	for (let index = 0; index < Math.floor(maxRhythmNotes); index++) {
		grid.push({
			time: index * tripletTicks,
			res: [ triplet ],
		});
	}

	maxRhythmNotes = calcMaxRhythmNotes(totalRhythmDuration, normalTicks);

	for (let index = 0; index < Math.floor(maxRhythmNotes); index++) {
		const beat = index * normalTicks;
		const beatIndex = R.findIndex(R.propEq('time', beat), grid);

		if (beatIndex !== -1) {
			grid[beatIndex].res.push(normal);
		} else {
			grid.push({
				time: index * normalTicks,
				res: [ normal ],
			});
		}
	}

	return ring(R.uniq(R.sortBy(R.prop('time'), grid)));
};
