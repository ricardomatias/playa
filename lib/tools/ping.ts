import { next } from './next';

export const ping = <T>(a: T[], b: T[], reverse: boolean): () => T => {
	let aIdx = 0;
	let bIdx = 0;
	const nextA = next(a, reverse);
	const nextB = next(b, reverse);

	return () => {
		if (aIdx <= bIdx) {
			aIdx++;
			return nextA();
		}

		bIdx++;
		return nextB();
	};
};
