import * as R from 'ramda';

export const sortBy = (f) => {
	return (combine) => {
		return (result, x) => {
			return combine(result, f(x));
		};
	};
};

export const valuesToArr = (map) => {
	return Array.from(map.values());
};

export const log = R.curry((title, val) => R.identity(console.log(title, val)));

export const convObj = (value) => R.map(R.flip(R.objOf)(value));

export const rotate = R.compose(R.flatten, R.reverse, R.splitAt(1));

// R.map((view) => (view(R.invertObj(rankings)))),
export const infuse = (a) => (fn) => fn(a);

export const hasNoNumber = R.complement(R.test(/\d/));
