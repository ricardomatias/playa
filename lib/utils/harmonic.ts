import { HarmonicPosition, HarmonicShift } from '../constants/intervals';
import { PlayaError } from './error';
import { isNull, isNumber } from './types-guards';

export const parseHarmonicShift = (shift: HarmonicShift): { octaveShift: number; position: HarmonicPosition } => {
	if (isNumber(shift)) {
		return { octaveShift: 0, position: shift };
	}

	const regex = new RegExp(/(\+{0,2}|-{0,2})([1-7])/);

	const result = regex.exec(shift);

	if (isNull(result)) {
		throw new PlayaError('parseHarmonicShift', `${shift} is not a supported Harmonic shift`);
	}

	const position = parseInt(result[2], 10) as HarmonicPosition;
	const octaveShiftType = /-/.test(result[1]) ? -1 : 1;
	const octaveShift = result[1].split('').length * octaveShiftType;

	return { position, octaveShift };
};
