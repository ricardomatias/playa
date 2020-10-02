import * as R from 'ramda';

export const valuesToArr = <T>(map: { [key: string]: T; }): T[] => {
	return Array.from(Object.values(map));
};

export const convObj = <T>(list: T[]): ((list: T[]) => Record<string, T>[]) => R.map(R.flip(R.objOf)(list));

export const rotate = R.compose(
	R.flatten as (list: string[][]) => string[],
	R.reverse as (list: string[][]) => string[][],
	R.splitAt(1) as (list: string[]) => string[][],
);

export const hasNoNumber = R.complement(R.test(/\d/));

