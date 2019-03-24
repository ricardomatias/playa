import * as R from 'ramda';
import { TICKS } from '../../constants';
import ring from '../ring';

const calcMaxRhythmNotes = (totalRhythmDuration, noteValue) => {
	const remainder = totalRhythmDuration % noteValue;

	return (totalRhythmDuration - remainder) / noteValue;
};

export default (totalRhythmDuration, subDivision) => {
	const grid = [];
	const normal = `${subDivision}n`;
	const triplet = `${subDivision}nt`;
	const normalTicks = TICKS.get(normal);
	const tripletTicks = TICKS.get(triplet);

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
