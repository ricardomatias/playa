import * as R from 'ramda';
import { TICKS } from '../lib/constants';

export const calcRythmDuration = R.compose(
	R.reduce(R.add, 0),
	R.map(TICKS.get)
);
