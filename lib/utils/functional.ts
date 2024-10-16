import * as R from 'ramda';

export const valuesToArr = <T>(map: { [key: string]: T }): T[] => {
	return Array.from(Object.values(map));
};

export const convObj = <T extends string | number | symbol>(list: T[]): ((list: T[]) => Record<string, T>[]) =>
	R.map(R.flip(R.objOf)(list as string[])) as (list: T[]) => Record<string, T>[];

export const rotate = R.compose(
	R.flatten as (list: string[][]) => string[],
	R.reverse as (list: string[][]) => string[][],
	R.splitAt(1) as (list: string[]) => string[][]
);
