import * as R from 'ramda';

/**
 * @function combinationSumRecursive
 * @private
 *
 * @param {Array<Number>} candidates - candidate numbers we're picking from.
 * @param {Number} remainingSum - remaining sum after adding candidates to currentCombination.
 * @param {Array<Array<Number>>} finalCombinations - resulting list of combinations.
 * @param {Array<Number>} currentCombination - currently explored candidates.
 * @param {Number} startFrom - index of the candidate to start further exploration from.
 *
 * @return {Array<Array<Number>>}
 */
function combinationSumRecursive(
	candidates: number[],
	remainingSum: number,
	finalCombinations: number[][] = [],
	currentCombination: number[] = [],
	startFrom = 0,
): number[][] {
	if (remainingSum < 0) {
		// By adding another candidate we've gone below zero.
		// This would mean that the last candidate was not acceptable.
		return finalCombinations;
	}

	if (remainingSum === 0) {
		// If after adding the previous candidate our remaining sum
		// became zero - we need to save the current combination since it is one
		// of the answers we're looking for.
		finalCombinations.push(currentCombination.slice());

		return finalCombinations;
	}

	// If we haven't reached zero yet let's continue to add all
	// possible candidates that are left.
	for (let candidateIndex = startFrom; candidateIndex < candidates.length; candidateIndex += 1) {
		const currentCandidate = candidates[candidateIndex];

		// Let's try to add another candidate.
		currentCombination.push(currentCandidate);

		// Explore further option with current candidate being added.
		combinationSumRecursive(
			candidates,
			remainingSum - currentCandidate,
			finalCombinations,
			currentCombination,
			candidateIndex,
		);

		// BACKTRACKING.
		// Let's get back, exclude current candidate and try another ones later.
		currentCombination.pop();
	}

	return finalCombinations;
}

/**
 * @private
 * @param {Number} number
 * @param {Number} times
 * @return {boolean}
 */
const hasMoreThan = (number: number, times: number) => (coll: readonly number[]) => {
	const count = R.length(R.filter(R.equals(number), coll));
	return count <= times;
};

/**
 * Backtracking algorithm for finding all possible combination for a specific sum.
 * @memberof Utils
 * @function findCombinationsSum
 * @private
 *
 * @param {Number} sum
 * @param {Number} maxOnes Number of times the number 1 can appear in the combinations
 *
 * @example
 * combinationSum(3, 3) => [ [1,1,1], [1,2] ]
 *
 * @return {Array<Array<Number>>}
 */
export function findCombinationsSum(sum: number, maxOnes = 2): number[][] {
	const candidates = R.drop(1, R.times(R.identity, sum));

	return R.compose(
		R.filter(hasMoreThan(1, maxOnes)),
	)(combinationSumRecursive(candidates, sum));
}
